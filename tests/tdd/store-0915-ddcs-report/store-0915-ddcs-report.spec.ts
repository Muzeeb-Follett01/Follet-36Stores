import { test, expect } from "@playwright/test";
import {
  fetchCampusAndTerms,
  fetchFilteredData,
  fetchProductsBatch,
} from "./ddcsApiHelper";
import {
  readEcommExcel,
  writeCampusTermExcel,
  writeSectionExcel,
  writeTitlesExcel,
  writeComparisonReport,
} from "./excelUtils";
import {
  CampusTermRow,
  SectionRow,
  TitleRow,
  ComparisonReportRow,
  EcommExcelRow,
  ApiCampus,
  ApiTerm,
} from "./types";

// ── Configuration ──

const STORE_NUMBER = process.env.STORE_NUMBER || "0915";
const EXCEL_FILE =
  process.env.EXCEL_FILE ||
  `testdata/Follett/${STORE_NUMBER}-cm-active-titles.xlsx`;

const OUTPUT_DIR = `output/${STORE_NUMBER}`;
const CAMPUS_TERM_OUTPUT = `${OUTPUT_DIR}/campus_term_output.xlsx`;
const SECTION_OUTPUT = `${OUTPUT_DIR}/campus_term_section_output.xlsx`;
const TITLES_OUTPUT = `${OUTPUT_DIR}/ddcs_titles_output.xlsx`;
const COMPARISON_OUTPUT = `${OUTPUT_DIR}/ddcs_ecomm_comparison_report.xlsx`;

// Campus name mapping: API name → Excel name
const CAMPUS_NAME_MAP: Record<string, string> = JSON.parse(
  process.env.CAMPUS_MAP ||
    JSON.stringify({
      "Manitoba Institute of Trade and Technology":
        "The University of Winnipeg Bookstore",
      "UNIV OF WINNIPEG BOOKSTORE":
        "The University of Winnipeg Bookstore",
    })
);

// ── Utility: normalise title for comparison ──

function normalizeTitle(title: string): string {
  return title.trim().toLowerCase();
}

// ── Main test ──

test.describe(`Store ${STORE_NUMBER} — DDCS API Data Fetch & eComm Comparison`, () => {
  test.describe.configure({ timeout: 1_800_000 }); // 30 min

  test("Fetch DDCS data, correlate with eComm Excel, and generate reports", async ({
    request,
  }) => {
    // ================================================================
    //  STEP 1 — Fetch Campus IDs and Term IDs (API #1)
    // ================================================================
    console.log("\n═══ STEP 1: Fetching Campus & Term data (API #1) ═══");

    const campusTermResp = await fetchCampusAndTerms(request);
    expect(campusTermResp.success, "Campus/Term API should succeed").toBe(true);

    const apiCampuses: ApiCampus[] = campusTermResp.data.ddcs_campus;
    const apiTerms: ApiTerm[] = campusTermResp.data.ddcs_term;

    console.log(`  Campuses: ${apiCampuses.length}`);
    console.log(`  Terms:    ${apiTerms.length}`);

    // Build campus+term rows for output
    const campusTermRows: CampusTermRow[] = [];
    for (const campus of apiCampuses) {
      const campusTerms = apiTerms.filter(
        (t) => t.campus_entity_id === campus.campus_entity_id
      );
      if (campusTerms.length === 0) {
        // Campus with no terms — still record it
        campusTermRows.push({
          campusName: campus.name,
          campusEntityId: campus.campus_entity_id,
          termName: "",
          termId: "",
        });
      }
      for (const term of campusTerms) {
        campusTermRows.push({
          campusName: campus.name,
          campusEntityId: campus.campus_entity_id,
          termName: term.name,
          termId: term.term_id,
        });
      }
    }

    await writeCampusTermExcel(CAMPUS_TERM_OUTPUT, campusTermRows);
    console.log(
      `  Step 1 complete — ${campusTermRows.length} campus+term entries saved.`
    );

    // ================================================================
    //  STEP 2 — Fetch Section / GID IDs (API #2)
    // ================================================================
    console.log("\n═══ STEP 2: Fetching Sections per campus+term (API #2) ═══");

    const sectionRows: SectionRow[] = [];
    let totalSections = 0;

    for (const term of apiTerms) {
      const campus = apiCampuses.find(
        (c) => c.campus_entity_id === term.campus_entity_id
      );
      if (!campus) continue;

      const filtered = await fetchFilteredData(
        request,
        term.campus_entity_id,
        term.term_id
      );
      if (!filtered.success) {
        console.warn(
          `  ⚠ Filtered data failed for campus=${campus.name}, term=${term.name}`
        );
        continue;
      }

      const sections = filtered.data.ddcs_section ?? [];
      const courses = filtered.data.ddcs_course ?? [];
      const departments = filtered.data.ddcs_campus_department ?? [];

      for (const sec of sections) {
        const course = courses.find((c) => c.course_id === sec.course_id);
        const dept = course
          ? departments.find(
              (d) => d.campus_department_id === course.campus_department_id
            )
          : undefined;

        sectionRows.push({
          campusName: campus.name,
          campusEntityId: campus.campus_entity_id,
          termName: term.name,
          termId: term.term_id,
          departmentName: dept?.name ?? "",
          courseName: course?.coursenumber ?? "",
          sectionName: sec.name ?? "",
          sectionGid: sec.gid,
        });
      }

      totalSections += sections.length;
      console.log(
        `  ${campus.name} / ${term.name}: ${sections.length} sections, ${courses.length} courses, ${departments.length} depts`
      );
    }

    await writeSectionExcel(SECTION_OUTPUT, sectionRows);
    console.log(
      `  Step 2 complete — ${totalSections} total sections saved.`
    );

    // ================================================================
    //  STEP 3 — Fetch Course Material Titles (API #3)
    // ================================================================
    console.log(
      `\n═══ STEP 3: Fetching product titles for ${sectionRows.length} sections (API #3) ═══`
    );

    const allGids = sectionRows.map((r) => r.sectionGid);
    const productsMap = await fetchProductsBatch(request, allGids, 10);

    const titleRows: TitleRow[] = [];
    let apiErrors = 0;
    const seenTitles = new Set<string>(); // for dedup per section

    for (const sec of sectionRows) {
      const resp = productsMap.get(sec.sectionGid);
      if (!resp || resp.count === -1) {
        apiErrors++;
        continue;
      }

      seenTitles.clear();
      for (const product of resp.products) {
        const dedupKey = `${sec.sectionGid}||${normalizeTitle(product.title)}`;
        if (seenTitles.has(dedupKey)) continue;
        seenTitles.add(dedupKey);

        titleRows.push({
          campusName: sec.campusName,
          campusEntityId: sec.campusEntityId,
          termName: sec.termName,
          termId: sec.termId,
          departmentName: sec.departmentName,
          courseName: sec.courseName,
          sectionName: sec.sectionName,
          sectionGid: sec.sectionGid,
          titleName: product.title,
          materialType: product.material_type ?? "",
          productId: product.id ?? "",
          productUrl: product.url ?? "",
        });
      }
    }

    await writeTitlesExcel(TITLES_OUTPUT, titleRows);
    console.log(
      `  Step 3 complete — ${titleRows.length} unique titles saved (${apiErrors} API errors skipped).`
    );

    // ================================================================
    //  STEP 4 — Match DDCS Titles with eComm Excel Data
    // ================================================================
    console.log("\n═══ STEP 4: Matching DDCS titles with eComm Excel ═══");

    const ecommRows: EcommExcelRow[] = await readEcommExcel(EXCEL_FILE);

    // Build a lookup set of normalised eComm titles for fast matching
    const ecommTitleSet = new Set<string>();
    // Also build a map: normalised title → full EcommExcelRow[] for detail extraction
    const ecommByTitle = new Map<string, EcommExcelRow[]>();

    for (const row of ecommRows) {
      if (!row.title) continue;
      const nt = normalizeTitle(row.title);
      ecommTitleSet.add(nt);
      if (!ecommByTitle.has(nt)) ecommByTitle.set(nt, []);
      ecommByTitle.get(nt)!.push(row);
    }

    const comparisonRows: ComparisonReportRow[] = [];
    let foundCount = 0;
    let notFoundCount = 0;

    // Direction 1: API titles → check if in eComm
    for (const tr of titleRows) {
      const nt = normalizeTitle(tr.titleName);
      const matched = ecommTitleSet.has(nt);

      comparisonRows.push({
        campusName: tr.campusName,
        termName: tr.termName,
        departmentName: tr.departmentName,
        courseName: tr.courseName,
        sectionName: tr.sectionName,
        titleName: tr.titleName,
        campusEntityId: tr.campusEntityId,
        termId: tr.termId,
        sectionGid: tr.sectionGid,
        matchStatus: matched ? "FOUND_IN_ECOMM" : "NOT_FOUND_IN_ECOMM",
        source: "API",
      });

      if (matched) foundCount++;
      else notFoundCount++;
    }

    // Direction 2: eComm titles not found in any API data
    const apiTitleSet = new Set<string>(
      titleRows.map((r) => normalizeTitle(r.titleName))
    );
    let excelOnlyCount = 0;

    for (const row of ecommRows) {
      if (!row.title) continue;
      const nt = normalizeTitle(row.title);
      if (!apiTitleSet.has(nt)) {
        comparisonRows.push({
          campusName: row.campus_name,
          termName: row.term_name,
          departmentName: row.department_name,
          courseName: row.course_name,
          sectionName: row.section_name,
          titleName: row.title,
          campusEntityId: "",
          termId: "",
          sectionGid: "",
          matchStatus: "NOT_FOUND_IN_ECOMM",
          source: "EXCEL_ONLY",
        });
        excelOnlyCount++;
      }
    }

    await writeComparisonReport(COMPARISON_OUTPUT, comparisonRows);

    // ── Summary log ──
    console.log("\n══════════ FINAL SUMMARY ══════════");
    console.log(`  Campuses from API:          ${apiCampuses.length}`);
    console.log(`  Terms from API:             ${apiTerms.length}`);
    console.log(`  Campus+Term entries:        ${campusTermRows.length}`);
    console.log(`  Sections from API:          ${totalSections}`);
    console.log(`  DDCS Titles (deduplicated): ${titleRows.length}`);
    console.log(`  eComm Excel rows:           ${ecommRows.length}`);
    console.log(`  API errors (skipped):       ${apiErrors}`);
    console.log(`  ──────────────────────────────`);
    console.log(`  Titles FOUND in eComm:      ${foundCount}`);
    console.log(`  Titles NOT FOUND in eComm:  ${notFoundCount}`);
    console.log(`  eComm titles NOT in API:    ${excelOnlyCount}`);
    console.log(`  ──────────────────────────────`);
    console.log(`  Output files:`);
    console.log(`    1. ${CAMPUS_TERM_OUTPUT}`);
    console.log(`    2. ${SECTION_OUTPUT}`);
    console.log(`    3. ${TITLES_OUTPUT}`);
    console.log(`    4. ${COMPARISON_OUTPUT}`);
    console.log("══════════════════════════════════\n");
  });
});
