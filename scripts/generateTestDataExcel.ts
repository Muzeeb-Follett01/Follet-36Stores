/**
 * generateTestDataExcel.ts
 *
 * Reads courseDataMinCoverage.json (or courseData.json) and an existing
 * store-specific Excel template, then auto-fills the `courses` and
 * `courseProducts` columns for each test case that needs course data.
 *
 * If no store Excel exists yet, it copies the structure from a template
 * (follettTestData.xlsx) and creates a new bkstr-{storeId}.xlsx.
 *
 * Usage:
 *   # After running courseDataFetch + minCoverageFilter:
 *   npx ts-node --transpile-only scripts/generateTestDataExcel.ts 0001
 *   npx ts-node --transpile-only scripts/generateTestDataExcel.ts 0001 https://bkstr-0001.myshopify.com/ bkstr0001
 *
 * What it does:
 *   1. Reads courseDataMinCoverage.json from output/
 *   2. Copies structure from the template Excel (bkstr-0026.xlsx)
 *   3. Updates store.url, store.password with the new store info
 *   4. Fills courses + courseProducts columns for test cases that use them
 *   5. Saves as testdata/Follett/bkstr-{storeId}.xlsx
 */

import * as fs from "fs";
import * as path from "path";
import ExcelJS from "exceljs";
import { chromium } from "playwright";

// ─── CLI args ───────────────────────────────────────────────────────────────
const storeId = process.argv[2];
const storeUrl = process.argv[3]; // optional — e.g. https://bkstr-0001.myshopify.com/
const storePassword = process.argv[4]; // optional — e.g. bkstr0001

if (!storeId) {
  console.error(
    "Usage:\n" +
      "  npx ts-node --transpile-only scripts/generateTestDataExcel.ts <storeId> [storeUrl] [storePassword]\n" +
      "  e.g. npx ts-node --transpile-only scripts/generateTestDataExcel.ts 0001\n" +
      "  e.g. npx ts-node --transpile-only scripts/generateTestDataExcel.ts 0001 https://bkstr-0001.myshopify.com/ bkstr0001"
  );
  process.exit(1);
}

// ─── Paths ──────────────────────────────────────────────────────────────────
const PROJECT_ROOT = path.resolve(__dirname, "..");
const COURSE_DATA_FILE = path.join(PROJECT_ROOT, "output", "courseDataMinCoverage.json");
const COURSE_DATA_FALLBACK = path.join(PROJECT_ROOT, "output", "courseData.json");
const TEMPLATE_FILE = path.join(PROJECT_ROOT, "testdata", "Follett", "bkstr-0026.xlsx");
const OUTPUT_DIR = path.join(PROJECT_ROOT, "testdata", "Follett");
const OUTPUT_FILE = path.join(OUTPUT_DIR, `bkstr-${storeId}.xlsx`);

// ─── Types ──────────────────────────────────────────────────────────────────
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

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Build the courses JSON array for a single course record */
function buildCourseEntry(rec: CourseRecord) {
  return {
    term: rec.term,
    department: rec.department,
    course: rec.course,
    section: rec.section,
  };
}

/** Build courseProducts JSON array from course textbooks */
function buildCourseProducts(textbooks: FlatTextbook[]) {
  return textbooks.map((tb) => ({
    name: tb.name,
    format: tb.format,
    condition: tb.condition,
  }));
}

/** Fetch the store logo text by opening the store URL in a headless browser */
async function fetchStoreLogoText(url: string, password: string): Promise<string> {
  console.log(`  🌐 Opening ${url} to fetch store logo...`);
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ ignoreHTTPSErrors: true });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });

    // Handle password-protected stores
    const isPasswordPage =
      (await page.locator('form[action="/password"]').count()) > 0 ||
      (await page.locator('input[type="password"]').count()) > 0;
    if (isPasswordPage && password) {
      const pwdInput = page.locator('input[type="password"]').first();
      await pwdInput.fill(password);
      const submitBtn = page.locator(
        'button[type="submit"], input[type="submit"]'
      ).first();
      await submitBtn.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(2000);
    }

    // Try multiple selectors to find the store logo/name
    const selectors = [
      'h1.header__heading a',           // Shopify Dawn theme
      '.header__heading a',
      '.site-header__logo a',
      '.header-logo a',
      'a.header__heading-link',
      '.header h1 a',
      'header a[href="/"]',
    ];

    let logoText = "";
    for (const sel of selectors) {
      const el = page.locator(sel).first();
      if ((await el.count()) > 0) {
        // Check for img alt text first, then text content
        const img = el.locator("img").first();
        if ((await img.count()) > 0) {
          logoText = (await img.getAttribute("alt")) ?? "";
        }
        if (!logoText) {
          logoText = ((await el.textContent()) ?? "").trim();
        }
        if (logoText) break;
      }
    }

    // Fallback: check page title
    if (!logoText) {
      const title = await page.title();
      // Remove common suffixes like " – Bookstore" or " | Store"
      logoText = title.split(/[–|\-]/)[0].trim();
    }

    await browser.close();
    return logoText;
  } catch (err) {
    await browser.close();
    console.log(`  ⚠️  Could not fetch logo: ${(err as Error).message}`);
    return "";
  }
}

/** Find column index by header name */
function findColumn(ws: ExcelJS.Worksheet, name: string): number | null {
  const headerRow = ws.getRow(1);
  for (let c = 1; c <= ws.columnCount; c++) {
    const val = headerRow.getCell(c).value;
    if (val && String(val).trim().toLowerCase() === name.toLowerCase()) {
      return c;
    }
  }
  return null;
}

/** Get cell value as string */
function cellStr(cell: ExcelJS.Cell): string {
  const v = cell.value;
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

// Map of specId → which specs NEED course data (test cases with textbook flows)
// These are the spec IDs that should have their courses/courseProducts filled.
const COURSE_SPEC_IDS = new Set([
  "TMSHOP-450", // Basic Flow
  "TMSHOP-453", // Checkout / Delivery Ship
  "TMSHOP-454", // User Account (Rental)
  "TMSHOP-459", // Course materials
  "TMSHOP-460", // Multiple courses
  "TMSHOP-461", // Digital rental
  "TMSHOP-462", // Course materials flow
]);

// ─── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n═══ Generate Test Data Excel ═══`);
  console.log(`  Store: ${storeId}`);

  // Step 1: Load course data
  let courseDataFile = COURSE_DATA_FILE;
  if (!fs.existsSync(courseDataFile)) {
    courseDataFile = COURSE_DATA_FALLBACK;
  }
  if (!fs.existsSync(courseDataFile)) {
    console.error(`  ❌ Course data not found. Run these first:`);
    console.error(`     npx ts-node --transpile-only scripts/courseDataFetch.ts <storeUrl> <password>`);
    console.error(`     npx ts-node --transpile-only scripts/minCoverageFilter.ts`);
    process.exit(1);
  }

  const courseData: CourseRecord[] = JSON.parse(
    fs.readFileSync(courseDataFile, "utf-8")
  );
  console.log(`  ✅ Course data loaded: ${courseData.length} records from ${path.basename(courseDataFile)}`);

  // Categorize textbooks by purchase type
  const buyNewCourses: CourseRecord[] = [];
  const buyUsedCourses: CourseRecord[] = [];
  const rentCourses: CourseRecord[] = [];
  const digitalCourses: CourseRecord[] = [];
  const allCourses = courseData;

  for (const rec of courseData) {
    for (const tb of rec.textbooks) {
      const cond = tb.condition.toLowerCase();
      const fmt = tb.format.toLowerCase();
      if (cond.includes("buy new")) buyNewCourses.push(rec);
      if (cond.includes("buy used")) buyUsedCourses.push(rec);
      if (cond.includes("rent")) rentCourses.push(rec);
      if (fmt === "digital") digitalCourses.push(rec);
    }
  }

  // Step 2: Load or create Excel
  const wb = new ExcelJS.Workbook();

  if (fs.existsSync(OUTPUT_FILE)) {
    console.log(`  📄 Existing file found: ${OUTPUT_FILE}`);
    await wb.xlsx.readFile(OUTPUT_FILE);
  } else if (fs.existsSync(TEMPLATE_FILE)) {
    console.log(`  📄 Copying template from: bkstr-0026.xlsx`);
    await wb.xlsx.readFile(TEMPLATE_FILE);
  } else {
    console.error(`  ❌ Template file not found: ${TEMPLATE_FILE}`);
    process.exit(1);
  }

  // Rename sheet to match store
  const sheetName = `bkstr-${storeId}`;
  const ws = wb.worksheets[0];
  ws.name = sheetName;

  // Step 3: Find key columns
  const colSpecId = findColumn(ws, "specId");
  const colCourses = findColumn(ws, "courses");
  const colCourseProducts = findColumn(ws, "courseProducts");
  const colStoreUrl = findColumn(ws, "store.url");
  const colStorePassword = findColumn(ws, "store.password");
  const colStoreRequiresLogin = findColumn(ws, "store.requiresLogin");
  const colStoreLogoText = findColumn(ws, "storeLogoText");

  if (!colSpecId || !colCourses || !colCourseProducts) {
    console.error(
      `  ❌ Missing columns. Need: specId (${colSpecId}), courses (${colCourses}), courseProducts (${colCourseProducts})`
    );
    process.exit(1);
  }

  console.log(`  Columns: specId=${colSpecId}, courses=${colCourses}, courseProducts=${colCourseProducts}`);

  // Step 4: Update store info and fill course data
  const defaultUrl = storeUrl ?? `https://bkstr-${storeId}.myshopify.com/`;
  const defaultPassword = storePassword ?? `bkstr${storeId}`;

  // Fetch store logo text from the live site
  console.log(`\n▸ Fetching store logo from live site...`);
  const storeLogoText = await fetchStoreLogoText(defaultUrl, defaultPassword);
  if (storeLogoText) {
    console.log(`  ✅ Store Logo: "${storeLogoText}"\n`);
  } else {
    console.log(`  ⚠️  Could not detect logo text, column will not be updated\n`);
  }

  let updatedRows = 0;

  for (let r = 2; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const specId = cellStr(row.getCell(colSpecId));
    if (!specId) continue;

    // Update store URL, password, and logo text for all rows
    if (colStoreUrl) row.getCell(colStoreUrl).value = defaultUrl;
    if (colStorePassword) row.getCell(colStorePassword).value = defaultPassword;
    if (colStoreLogoText && storeLogoText) row.getCell(colStoreLogoText).value = storeLogoText;

    // Fill course data for specs that need it
    if (COURSE_SPEC_IDS.has(specId) && courseData.length > 0) {
      let selectedCourses: CourseRecord[] = [];

      // Assign different course data based on test case needs
      if (specId === "TMSHOP-461") {
        // Digital rental — pick a course with digital/rent textbook
        const digital = digitalCourses.length > 0 ? digitalCourses : rentCourses;
        selectedCourses = digital.length > 0 ? [digital[0]] : [allCourses[0]];
      } else if (specId === "TMSHOP-460") {
        // Multiple courses — pick up to 3 different courses
        selectedCourses = allCourses.slice(0, Math.min(3, allCourses.length));
      } else if (specId === "TMSHOP-454") {
        // Rental flow — pick a course with rental textbooks
        const rental = rentCourses.length > 0 ? rentCourses : allCourses;
        selectedCourses = [rental[0]];
      } else if (specId === "TMSHOP-459") {
        // Basic course materials — pick a course with buy-new
        const buyNew = buyNewCourses.length > 0 ? buyNewCourses : allCourses;
        selectedCourses = [buyNew[0]];
      } else {
        // General: pick first available course
        selectedCourses = [allCourses[0]];
      }

      // Build courses JSON
      const coursesJson = selectedCourses.map(buildCourseEntry);
      row.getCell(colCourses).value = JSON.stringify(coursesJson, null, 0);

      // Build courseProducts JSON — combine textbooks from selected courses
      const allTextbooks: FlatTextbook[] = [];
      for (const sc of selectedCourses) {
        allTextbooks.push(...sc.textbooks);
      }
      row.getCell(colCourseProducts).value = JSON.stringify(
        buildCourseProducts(allTextbooks),
        null,
        0
      );

      updatedRows++;
      console.log(
        `  ✅ ${specId}: ${selectedCourses.length} course(s), ${allTextbooks.length} textbook(s)`
      );
    }
  }

  // Step 5: Save
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  await wb.xlsx.writeFile(OUTPUT_FILE);

  console.log(`\n═══ Done ═══`);
  console.log(`  📊 Excel saved: ${OUTPUT_FILE}`);
  console.log(`  Sheet: "${sheetName}"`);
  console.log(`  Store URL: ${defaultUrl}`);
  console.log(`  Store Password: ${defaultPassword}`);
  if (storeLogoText) console.log(`  Store Logo Text: ${storeLogoText}`);
  console.log(`  Rows with course data updated: ${updatedRows}`);
  console.log(`  Total course records available: ${courseData.length}\n`);
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
