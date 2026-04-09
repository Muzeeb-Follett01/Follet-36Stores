/**
 * courseDataFetch.ts
 *
 * Playwright-based script that fetches all course/textbook data from a
 * Follett/bkstr store.  A real browser is used to establish the Shopify
 * session (handles both custom domains *and* *.myshopify.com URLs that
 * return HTTP 401 when called from plain Node.js fetch).  All three API
 * calls are then made via page.evaluate() so they carry the browser's
 * session cookies automatically.
 *
 * 3-step API flow:
 *   1. GET /apps/shopifyData/getFilteredCampusTerm        → campus_entity_id + term_id
 *   2. GET /apps/shopifyData/getFilteredData?...          → all depts/courses/sections
 *   3. GET /apps/shopifyData/products?query=metafields... → textbooks per section
 *
 * Early-exit condition: stop once at least one textbook has been found for
 * every purchase type: "buy-new", "buy-used", "rent-used", "rent".
 *
 * Usage:
 *   npx ts-node --transpile-only scripts/courseDataFetch.ts [STORE_URL]
 *   e.g. npx ts-node --transpile-only scripts/courseDataFetch.ts https://blackhawktechnical.bkstr.com
 *   e.g. npx ts-node --transpile-only scripts/courseDataFetch.ts https://bkstr-0354.myshopify.com/
 *   e.g. npx ts-node --transpile-only scripts/courseDataFetch.ts https://blackhawktechnical.bkstr.com/pages/course-materials-results
 *
 * Output file: output/courseData.json
 */

import * as fs from "fs";
import * as path from "path";
import { chromium } from "playwright";
import { FollettLoginPage } from "../pages/Follett/LoginPage";

// ─── Config ─────────────────────────────────────────────────────────────────

/** Accept either the full page URL or just the base domain */
const INPUT_URL = (
  process.argv[2] ?? "https://blackhawktechnical.bkstr.com"
).replace(/\/$/, "");

/** Strip /pages/... suffix to get the store root */
const BASE_URL = INPUT_URL.replace(/\/pages.*$/, "");

/** The course-materials-results page — used to establish a browser session */
const COURSE_PAGE_URL = INPUT_URL.includes("/pages/")
  ? INPUT_URL
  : `${BASE_URL}/pages/course-materials-results`;

/**
 * Optional store password (for password-protected Shopify stores).
 * Pass as the second CLI argument:
 *   npx ts-node --transpile-only scripts/courseDataFetch.ts <URL> <password>
 */
const STORE_PASSWORD = process.argv[3] ?? "";

const OUTPUT_FILE = path.join(__dirname, "..", "output", "courseData.json");

/** ms delay between product API requests to be respectful to the server */
const REQUEST_DELAY_MS = 150;

/** All purchase types we want to find at least one example of before stopping */
const TARGET_PURCHASE_TYPES = new Set([
  "buy-new",
  "buy-used",
  "rent-used",
  "rent",
]);

/** Purchase type keys to exclude entirely from output */
const EXCLUDED_PURCHASE_TYPES = new Set(["wine"]);

/** Early-exit: stop once this many examples of every target purchase type are found */
const MIN_PER_PURCHASE_TYPE = 2;

// ─── Types ───────────────────────────────────────────────────────────────────

interface DdcsTerm {
  term_id: string;
  name: string;
  campus_entity_id: string;
  rental_start_date: string;
  rental_end_date: string;
  store_number: string;
}

interface DdcsCampusDepartment {
  campus_department_id: string;
  name: string; // display name e.g. "103", "543"
  abbreviation: string;
  disabled_flag: boolean;
}

interface DdcsCourse {
  course_id: string;
  campus_department_id: string;
  coursenumber: string;
  disabled_flag: boolean;
}

interface DdcsSection {
  gid: string; // Shopify metaobject GID
  section_id: string;
  course_id: string;
  name: string; // section number e.g. "030"
  section_key: string;
  instructor_first_name: string | null;
  instructor_last_name: string | null;
  adoption_status: string;
  disabled_flag: boolean;
  note: string | null;
}

interface ProductVariant {
  title: string;
  option1: string | null; // Format: "Print" | "Digital"
  option2: string | null; // Type: "Buy New" | "Buy Used" | "Rent" …
  price: string;
  available: boolean;
  inventory_quantity?: number;
  sku?: string;
  metafields?: Record<string, string>[]; // array of { [key]: value, namespace: string }
}

interface Product {
  title: string;
  material_type: string; // "Required" | "Suggested"
  image?: string;
  variants: ProductVariant[];
  metafields?: {
    course_materials?: {
      isbn?: string;
      author?: string;
      publisher_name?: string;
      edition?: string;
    };
  };
}

interface PurchaseOption {
  format: string;
  type: string;
  price: number;
}

interface FlatTextbook {
  name: string;
  format: string;
  condition: string;
}

interface CourseRecord {
  term: string;
  department: string;
  course: string;
  section: string;
  textbooks: FlatTextbook[];
}

interface Output {
  term: string;
  term_id: string;
  campus_entity_id: string;
  store_number: string;
  courses: CourseRecord[];
}

type FlatOutput = CourseRecord[];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Returns true if the variant is a "rental-only SKU" — i.e. a physical rental-program
 * copy listed as Buy New/Used in the API but not actually purchasable outright.
 * The Follett UI hides these variants.
 */
function isRentalOnlySku(v: ProductVariant): boolean {
  if (!v.metafields) return false;
  return v.metafields.some(
    (mf) => mf["namespace"] === "cm_rental" && mf["rental_only_sku"] === "true",
  );
}

/**
 * Direct Node.js fetch using headers captured from the page's own API calls.
 * This reuses the exact auth headers (tokens, cookies, etc.) that the store's
 * JavaScript bundles — bypassing any same-origin / OAuth requirement.
 */
async function nodeFetch<T>(
  url: string,
  headers: Record<string, string>,
): Promise<T> {
  const res = await fetch(url, {
    headers: { ...headers, Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return res.json() as Promise<T>;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\ncourseDataFetch starting (Playwright browser mode)`);
  console.log(`  Base URL    : ${BASE_URL}`);
  console.log(`  Course page : ${COURSE_PAGE_URL}`);
  console.log(`  Output      : ${OUTPUT_FILE}\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  // ── page.on('response') captures API response bodies immediately when they
  //    arrive, before Playwright drops the buffer.  Also captures request headers
  //    for use in the per-section Node.js fetch calls.
  let capturedApiHeaders: Record<string, string> = {};
  page.on("request", (req) => {
    if (req.url().includes("/apps/shopifyData/")) {
      capturedApiHeaders = { ...req.headers() };
    }
  });

  // Promises resolved with the parsed JSON body as soon as the response arrives
  let resolveCampusTerm!: (data: any) => void;
  let resolveFilteredData!: (data: any) => void;
  const campusTermBodyPromise = new Promise<any>((r) => {
    resolveCampusTerm = r;
  });
  const filteredDataBodyPromise = new Promise<any>((r) => {
    resolveFilteredData = r;
  });

  page.on("response", async (response) => {
    const url = response.url();
    if (!response.ok()) return;
    if (url.includes("getFilteredCampusTerm")) {
      try {
        resolveCampusTerm(await response.json());
      } catch {
        /* ignore */
      }
    } else if (url.includes("getFilteredData")) {
      try {
        resolveFilteredData(await response.json());
      } catch {
        /* ignore */
      }
    }
  });

  /** Wait up to `ms` for a body-resolved promise; returns null on timeout */
  function waitFor<T>(promise: Promise<T>, ms: number): Promise<T | null> {
    return Promise.race([
      promise,
      new Promise<null>((r) => setTimeout(() => r(null), ms)),
    ]);
  }

  try {
    // ── Step 0: Navigate, handle password gate, then load course-materials page
    console.log(
      "Step 0: Opening course-materials-results page (establishing session)...",
    );

    await page.goto(COURSE_PAGE_URL, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });

    // Detect Shopify password-protected stores and log in if a password was supplied
    const isPasswordPage =
      (await page.locator('form[action="/password"]').count()) > 0 ||
      (await page.locator('input[type="password"]').count()) > 0;
    if (isPasswordPage) {
      if (!STORE_PASSWORD) {
        throw new Error(
          "Store is password-protected but no password was provided. " +
            "Pass the store password as the second argument:\n" +
            "  npx ts-node --transpile-only scripts/courseDataFetch.ts <URL> <password>",
        );
      }
      console.log(
        "  Password gate detected — logging in via FollettLoginPage...",
      );
      const loginPage = new FollettLoginPage(page, "TMSHOP-459");
      await loginPage.clickEnterUsingPassword();
      await loginPage.enterPasswordAndSubmit(STORE_PASSWORD);
      console.log(
        "  ✅ Password accepted — navigating to course-materials page...\n",
      );
    }

    // Navigate to course-materials page. page.on('response') (registered above)
    // will capture getFilteredCampusTerm and getFilteredData bodies automatically.
    await page.goto(COURSE_PAGE_URL, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });

    // Allow the page's JS to fire its initial API calls
    await page.waitForTimeout(5_000);

    const resolvedOrigin = new URL(page.url()).origin;
    console.log(`  Resolved origin: ${resolvedOrigin}\n`);

    // ── Step 1: Campus / term ────────────────────────────────────────────────
    console.log("Step 1: Fetching campus/term config...");
    let campusTermResp: { success: boolean; data: { ddcs_term: DdcsTerm[] } };

    const campusTermBody = await waitFor(campusTermBodyPromise, 8_000);
    if (campusTermBody) {
      console.log("  (captured from page response)");
      campusTermResp = campusTermBody;
    } else {
      console.log("  (calling via browser fetch with session cookies)");
      campusTermResp = await page.evaluate(async () => {
        const r = await fetch("/apps/shopifyData/getFilteredCampusTerm", {
          headers: { Accept: "application/json" },
        });
        return r.json();
      });
    }

    if (!campusTermResp.success || !campusTermResp.data.ddcs_term.length) {
      throw new Error(
        "Failed to get campus/term data — response: " +
          JSON.stringify(campusTermResp),
      );
    }

    const term = campusTermResp.data.ddcs_term[0];
    const { campus_entity_id, term_id } = term;
    const termName = term.name;
    console.log(`  Term  : ${termName} (${term_id})`);
    console.log(`  Campus: ${campus_entity_id}\n`);

    // ── Step 2: Full dept / course / section hierarchy ──────────────────────
    console.log("Step 2: Fetching full course hierarchy...");
    let filteredRaw: any;

    const filteredDataBody = await waitFor(filteredDataBodyPromise, 8_000);
    if (filteredDataBody) {
      console.log("  (captured from page response)");
      filteredRaw = filteredDataBody;
    } else {
      console.log("  (calling via browser fetch with session cookies)");
      filteredRaw = await page.evaluate(
        async ({ campusId, termId }) => {
          const r = await fetch(
            `/apps/shopifyData/getFilteredData?campus_entity_id=${campusId}&term_id=${termId}`,
            { headers: { Accept: "application/json" } },
          );
          return r.json();
        },
        { campusId: campus_entity_id, termId: term_id },
      );
    }

    // Response may be flat { ddcs_section, ddcs_course, ddcs_campus_department }
    // or wrapped { data: { ... } } — handle both
    const filteredData = filteredRaw.data ?? filteredRaw;
    const ddcs_section: DdcsSection[] = filteredData.ddcs_section ?? [];
    const ddcs_course: DdcsCourse[] = filteredData.ddcs_course ?? [];
    const ddcs_campus_department: DdcsCampusDepartment[] =
      filteredData.ddcs_campus_department ?? [];
    console.log(`  Departments : ${ddcs_campus_department.length}`);
    console.log(`  Courses     : ${ddcs_course.length}`);
    console.log(`  Sections    : ${ddcs_section.length}\n`);

    // Build lookup maps
    const deptMap = new Map<string, string>(
      ddcs_campus_department.map((d) => [d.campus_department_id, d.name]),
    );
    const courseMap = new Map<string, DdcsCourse>(
      ddcs_course.map((c) => [c.course_id, c]),
    );

    // ── Step 3: Fetch textbooks for each section ───────────────────────────────
    console.log("Step 3: Fetching textbook data per section...\n");
    const results: CourseRecord[] = [];
    const purchaseTypeCounts = new Map<string, number>();
    const total = ddcs_section.length;

    for (let i = 0; i < ddcs_section.length; i++) {
      const section = ddcs_section[i];
      const course = courseMap.get(section.course_id);
      if (!course) continue;

      const deptName =
        deptMap.get(course.campus_department_id) ?? course.campus_department_id;

      process.stdout.write(
        `  [${String(i + 1).padStart(4)}/${total}] dept=${deptName.padEnd(4)} course=${course.coursenumber.padEnd(4)} section=${section.name} ... `,
      );

      let textbooks: FlatTextbook[] = [];
      try {
        // Use page.evaluate with a RELATIVE path — the browser carries the
        // correct session cookies from the password-authenticated session.
        const encodedGid = encodeURIComponent(section.gid);
        const relativePath = `/apps/shopifyData/products?query=metafields.ddcs.ddcs_section:'${encodedGid}'`;
        const productsResp = (await page.evaluate(async (path: string) => {
          const res = await fetch(path, {
            headers: { Accept: "application/json" },
            credentials: "include",
          });
          if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
          return res.json();
        }, relativePath)) as {
          success: boolean;
          count: number;
          products: Product[];
        };

        if (productsResp.success && productsResp.products?.length) {
          const allTextbooks: FlatTextbook[] = productsResp.products.flatMap(
            (p) =>
              p.variants
                .filter((v) => v.available)
                .filter((v) => !isRentalOnlySku(v))
                .map((v) => {
                  const format =
                    v.option2 != null ? (v.option1 ?? "Buy") : "Buy";
                  const type =
                    v.option2 != null ? v.option2 : (v.option1 ?? v.title);
                  const typeKey = type.toLowerCase().replace(/\s+/g, "-");
                  purchaseTypeCounts.set(
                    typeKey,
                    (purchaseTypeCounts.get(typeKey) ?? 0) + 1,
                  );
                  return {
                    name: p.title,
                    format: format.toLowerCase(),
                    condition: type,
                  };
                })
                .filter(
                  (fb) =>
                    !EXCLUDED_PURCHASE_TYPES.has(
                      fb.condition.toLowerCase().replace(/\s+/g, "-"),
                    ),
                ),
          );

          textbooks = allTextbooks;
          process.stdout.write(`${textbooks.length} option(s)\n`);
        } else {
          process.stdout.write("no materials\n");
        }
      } catch (err: any) {
        process.stdout.write(`ERROR: ${err.message}\n`);
      }

      // Skip courses with no available textbooks
      if (textbooks.length > 0) {
        results.push({
          term: termName,
          department: deptName,
          course: course.coursenumber,
          section: section.name,
          textbooks,
        });
      }

      // Early-exit when every target purchase type has been found at least MIN_PER_PURCHASE_TYPE times
      if (TARGET_PURCHASE_TYPES.size > 0) {
        const allFound = [...TARGET_PURCHASE_TYPES].every(
          (t) => (purchaseTypeCounts.get(t) ?? 0) >= MIN_PER_PURCHASE_TYPE,
        );
        if (allFound) {
          console.log(
            `\n  Early exit: ${MIN_PER_PURCHASE_TYPE}x of every target purchase type found`,
          );
          console.log(
            `  Counts: ${[...TARGET_PURCHASE_TYPES].map((t) => `${t}=${purchaseTypeCounts.get(t) ?? 0}`).join(", ")}`,
          );
          break;
        }
      }

      await sleep(REQUEST_DELAY_MS);
    }

    // ── Write output ──────────────────────────────────────────────────────────
    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), "utf-8");

    console.log(`\nDone!`);
    console.log(`  Total sections processed : ${results.length}`);
    console.log(`  Sections with materials  : ${results.length}`);
    console.log(
      `  Purchase type counts     : ${[...purchaseTypeCounts.entries()]
        .sort()
        .map(([k, v]) => `${k}=${v}`)
        .join(", ")}`,
    );
    console.log(`  Output written to        : ${OUTPUT_FILE}\n`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
