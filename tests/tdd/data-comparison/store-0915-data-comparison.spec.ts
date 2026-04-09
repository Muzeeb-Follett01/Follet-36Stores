import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { parseExcelFile } from "./excelParser";
import {
  getCampusAndTerms,
  getFilteredData,
  getProductsForSectionsBatch,
  CampusData,
  TermData,
  SectionData,
  DepartmentData,
  CourseData,
} from "./apiHelpers";

const STORE_NUMBER = process.env.STORE_NUMBER || "0915";
const EXCEL_FILE = process.env.EXCEL_FILE || `testdata/Follett/${STORE_NUMBER}-cm-active-titles.xlsx`;
const REPORT_OUTPUT = path.resolve(process.env.REPORT_OUTPUT || `test-results/store-${STORE_NUMBER}-data-comparison-report.txt`);

// Maps API campus names → Excel campus name (add mappings for each store as needed)
const CAMPUS_NAME_MAP: Record<string, string> = JSON.parse(
  process.env.CAMPUS_MAP || JSON.stringify({
    "Manitoba Institute of Trade and Technology": "The University of Winnipeg Bookstore",
    "UNIV OF WINNIPEG BOOKSTORE": "The University of Winnipeg Bookstore",
  })
);

function resolveExcelCampus(apiCampusName: string, excelCampuses: string[]): string | undefined {
  const direct = excelCampuses.find((ec) => ec === apiCampusName);
  if (direct) return direct;
  const mapped = CAMPUS_NAME_MAP[apiCampusName];
  if (mapped && excelCampuses.includes(mapped)) return mapped;
  return excelCampuses.find(
    (ec) =>
      ec.toLowerCase().includes(apiCampusName.toLowerCase()) ||
      apiCampusName.toLowerCase().includes(ec.toLowerCase())
  );
}

// ── Normalized row for comparison ──
interface NormalizedRow {
  campus: string;
  term: string;
  department: string;
  course: string;
  section: string;
  title: string;
}

function rowKey(r: NormalizedRow): string {
  return `${r.campus}||${r.term}||${r.department}||${r.course}||${r.section}||${r.title}`;
}

function sectionKeyFromRow(r: NormalizedRow): string {
  return `${r.campus}||${r.term}||${r.department}||${r.course}||${r.section}`;
}

// ── Report types ──
interface MismatchDetail {
  level: "Campus" | "Term" | "Department" | "Course" | "Section" | "Title";
  direction: "Excel only" | "API only";
  context: string;
  excelValue?: string | number;
  apiValue?: string | number;
}

function buildAndSaveReport(
  mismatches: MismatchDetail[],
  stats: { excelRows: number; apiRows: number; sectionsChecked: number; apiErrors: number }
) {
  const lines: string[] = [];
  lines.push("╔══════════════════════════════════════════════════════════════════════════════╗");
  lines.push(`║       FULL DATA COMPARISON REPORT — Store ${STORE_NUMBER} (Bidirectional)             ║`);
  lines.push(`║       Generated: ${new Date().toISOString()}                              ║`);
  lines.push("╚══════════════════════════════════════════════════════════════════════════════╝");
  lines.push("");
  lines.push(`Excel rows: ${stats.excelRows}`);
  lines.push(`API sections checked: ${stats.sectionsChecked}`);
  lines.push(`API rows (titles) resolved: ${stats.apiRows}`);
  lines.push(`API errors (sections skipped): ${stats.apiErrors}`);
  lines.push("");

  if (mismatches.length === 0) {
    lines.push("All data matched between Excel and API.");
  } else {
    const grouped: Record<string, Record<string, MismatchDetail[]>> = {};
    for (const m of mismatches) {
      if (!grouped[m.level]) grouped[m.level] = {};
      if (!grouped[m.level][m.direction]) grouped[m.level][m.direction] = [];
      grouped[m.level][m.direction].push(m);
    }

    for (const level of ["Campus", "Term", "Department", "Course", "Section", "Title"] as const) {
      const dirs = grouped[level];
      if (!dirs) continue;
      const totalForLevel = Object.values(dirs).reduce((s, arr) => s + arr.length, 0);
      lines.push(`── ${level} ── (${totalForLevel} mismatch${totalForLevel > 1 ? "es" : ""})`);

      for (const [direction, items] of Object.entries(dirs)) {
        lines.push(`  [${direction}] (${items.length}):`);
        for (const item of items) {
          lines.push(`    • ${item.context}`);
          if (item.excelValue !== undefined) lines.push(`      Excel: ${item.excelValue}`);
          if (item.apiValue !== undefined) lines.push(`      API:   ${item.apiValue}`);
        }
      }
      lines.push("");
    }

    lines.push("── Summary ──");
    lines.push(`  Total mismatches: ${mismatches.length}`);
    for (const level of ["Campus", "Term", "Department", "Course", "Section", "Title"] as const) {
      const dirs = grouped[level];
      if (!dirs) continue;
      const total = Object.values(dirs).reduce((s, arr) => s + arr.length, 0);
      const byDir = Object.entries(dirs).map(([d, arr]) => `${d}: ${arr.length}`).join(", ");
      lines.push(`    ${level}: ${total} (${byDir})`);
    }
  }

  const report = lines.join("\n");
  console.log("\n" + report);

  const dir = path.dirname(REPORT_OUTPUT);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(REPORT_OUTPUT, report, "utf-8");
  console.log(`\nReport saved to: ${REPORT_OUTPUT}`);
}

// ── Main test ──
test.describe(`Store ${STORE_NUMBER} — Full Bidirectional Data Comparison`, () => {
  test.describe.configure({ timeout: 1_800_000 }); // 30 min

  test("Compare all Excel rows against DDCS APIs (both directions)", async ({ request }) => {
    const mismatches: MismatchDetail[] = [];

    // ── STEP 1: Parse Excel ──
    console.log("Step 1: Parsing Excel file...");
    const excelData = await parseExcelFile(EXCEL_FILE);
    console.log(`  Excel: ${excelData.rows.length} rows, ${excelData.campuses.length} campus(es), ${excelData.terms.length} terms`);

    const excelNormalized: NormalizedRow[] = excelData.rows.map((r) => ({
      campus: r.campus_name, term: r.term_name, department: r.department_name,
      course: r.course_name, section: r.section_name, title: r.title,
    }));
    const excelRowKeys = new Set(excelNormalized.map(rowKey));

    // ── STEP 2: Fetch Campus & Terms ──
    console.log("Step 2: Fetching Campus & Term data from API...");
    const campusTermResp = await getCampusAndTerms(request);
    expect(campusTermResp.success).toBe(true);
    const apiCampuses = campusTermResp.data.ddcs_campus;
    const apiTerms = campusTermResp.data.ddcs_term;
    console.log(`  API: ${apiCampuses.length} campus(es), ${apiTerms.length} terms`);

    // ── STEP 3: Campus comparison (bidirectional) ──
    console.log("Step 3: Comparing campuses...");
    const mappedApiCampuses = new Map<string, string[]>();
    for (const apiCampus of apiCampuses) {
      const excelCampus = resolveExcelCampus(apiCampus.name, excelData.campuses);
      if (!excelCampus) {
        mismatches.push({ level: "Campus", direction: "API only", context: apiCampus.name });
        continue;
      }
      if (!mappedApiCampuses.has(excelCampus)) mappedApiCampuses.set(excelCampus, []);
      mappedApiCampuses.get(excelCampus)!.push(apiCampus.name);
    }
    for (const ec of excelData.campuses) {
      if (!mappedApiCampuses.has(ec)) {
        mismatches.push({ level: "Campus", direction: "Excel only", context: ec });
      }
    }

    // ── STEP 4: Term comparison (bidirectional) ──
    console.log("Step 4: Comparing terms...");
    const apiTermNames = new Set(apiTerms.map((t) => t.name));
    for (const et of excelData.terms) {
      if (!apiTermNames.has(et)) mismatches.push({ level: "Term", direction: "Excel only", context: et });
    }
    for (const at of apiTermNames) {
      if (!excelData.terms.includes(at)) mismatches.push({ level: "Term", direction: "API only", context: at });
    }

    // ── STEP 5: Fetch DDCs for all campus+term combos ──
    console.log("Step 5: Fetching DDCs for all campus+term combinations...");

    interface ApiSectionInfo {
      gid: string; campus: string; term: string;
      department: string; course: string; section: string;
    }

    const allApiSections: ApiSectionInfo[] = [];
    const apiDeptsByCT = new Map<string, Set<string>>();
    const apiCoursesByCT = new Map<string, Set<string>>();
    const apiSecsByCT = new Map<string, Set<string>>();

    for (const apiTerm of apiTerms) {
      const apiCampus = apiCampuses.find((c) => c.campus_entity_id === apiTerm.campus_entity_id);
      if (!apiCampus) continue;
      const excelCampus = resolveExcelCampus(apiCampus.name, excelData.campuses);
      if (!excelCampus) continue;

      const filteredResp = await getFilteredData(request, apiTerm.campus_entity_id, apiTerm.term_id);
      if (!filteredResp.success) continue;

      const sections: SectionData[] = filteredResp.data.ddcs_section ?? [];
      const courses: CourseData[] = filteredResp.data.ddcs_course ?? [];
      const departments: DepartmentData[] = filteredResp.data.ddcs_campus_department ?? [];

      const ctKey = `${excelCampus}||${apiTerm.name}`;
      const deptSet = new Set<string>(departments.map((d) => d.name));
      const courseSet = new Set<string>(courses.map((c) => c.coursenumber));
      const secSet = new Set<string>();

      apiDeptsByCT.set(ctKey, deptSet);
      apiCoursesByCT.set(ctKey, courseSet);

      for (const sec of sections) {
        const course = courses.find((c) => c.course_id === sec.course_id);
        const dept = course ? departments.find((d) => d.campus_department_id === course.campus_department_id) : undefined;
        const deptName = dept?.name ?? "";
        const courseName = course?.coursenumber ?? "";
        const sectionName = sec.name ?? "";

        secSet.add(`${deptName}||${courseName}||${sectionName}`);
        allApiSections.push({ gid: sec.gid, campus: excelCampus, term: apiTerm.name, department: deptName, course: courseName, section: sectionName });
      }
      apiSecsByCT.set(ctKey, secSet);
      console.log(`  ${apiCampus.name} / ${apiTerm.name}: ${departments.length} depts, ${courses.length} courses, ${sections.length} sections`);
    }

    // ── STEP 6: Dept / Course / Section comparison (bidirectional) ──
    console.log("Step 6: Comparing Departments, Courses, Sections...");

    for (const [ctKey, excelDdc] of excelData.ddcsByCampusTerm) {
      const apiDepts = apiDeptsByCT.get(ctKey) ?? new Set<string>();
      const apiCourses = apiCoursesByCT.get(ctKey) ?? new Set<string>();
      const apiSecs = apiSecsByCT.get(ctKey) ?? new Set<string>();
      const label = ctKey.replace("||", " / ");

      for (const d of excelDdc.departments) {
        if (!apiDepts.has(d)) mismatches.push({ level: "Department", direction: "Excel only", context: `"${d}" in ${label}` });
      }
      for (const d of apiDepts) {
        if (!excelDdc.departments.includes(d)) mismatches.push({ level: "Department", direction: "API only", context: `"${d}" in ${label}` });
      }

      for (const c of excelDdc.courses) {
        if (!apiCourses.has(c)) mismatches.push({ level: "Course", direction: "Excel only", context: `"${c}" in ${label}` });
      }
      for (const c of apiCourses) {
        if (!excelDdc.courses.includes(c)) mismatches.push({ level: "Course", direction: "API only", context: `"${c}" in ${label}` });
      }

      // Sections — extract last 3 parts from full key (campus||term||dept||course||section)
      const excelSecKeys = new Set(excelDdc.sections.map((fk) => { const p = fk.split("||"); return `${p[2]}||${p[3]}||${p[4]}`; }));
      for (const s of excelSecKeys) {
        if (!apiSecs.has(s)) {
          const [dept, course, sec] = s.split("||");
          mismatches.push({ level: "Section", direction: "Excel only", context: `"${dept} > ${course} > ${sec}" in ${label}` });
        }
      }
      for (const s of apiSecs) {
        if (!excelSecKeys.has(s)) {
          const [dept, course, sec] = s.split("||");
          mismatches.push({ level: "Section", direction: "API only", context: `"${dept} > ${course} > ${sec}" in ${label}` });
        }
      }
    }

    // Check for campus+term combos in API not in Excel
    for (const ctKey of apiDeptsByCT.keys()) {
      if (!excelData.ddcsByCampusTerm.has(ctKey)) {
        mismatches.push({ level: "Term", direction: "API only", context: `Campus+Term combo: ${ctKey.replace("||", " / ")}` });
      }
    }

    // ── STEP 7: Fetch products for ALL sections (parallel batches of 10) ──
    console.log(`Step 7: Fetching products for ${allApiSections.length} sections (10 parallel)...`);
    const productsMap = await getProductsForSectionsBatch(request, allApiSections.map((s) => s.gid), 10);

    // ── STEP 8: Title-level bidirectional comparison ──
    console.log("Step 8: Comparing titles (row-level, both directions)...");

    const apiNormalized: NormalizedRow[] = [];
    let apiErrors = 0;

    for (const secInfo of allApiSections) {
      const productsResp = productsMap.get(secInfo.gid);
      if (!productsResp || productsResp.count === -1) { apiErrors++; continue; }
      for (const product of productsResp.products) {
        apiNormalized.push({
          campus: secInfo.campus, term: secInfo.term, department: secInfo.department,
          course: secInfo.course, section: secInfo.section, title: product.title,
        });
      }
    }

    const apiRowKeys = new Set(apiNormalized.map(rowKey));

    // Excel rows not in API
    const excelOnlyRows = excelNormalized.filter((r) => !apiRowKeys.has(rowKey(r)));
    // API rows not in Excel
    const apiOnlyRows = apiNormalized.filter((r) => !excelRowKeys.has(rowKey(r)));

    console.log(`  Excel-only rows (in Excel, missing from API): ${excelOnlyRows.length}`);
    console.log(`  API-only rows (in API, missing from Excel): ${apiOnlyRows.length}`);
    console.log(`  Matched rows: ${excelData.rows.length - excelOnlyRows.length}`);

    // Group by section for readable report
    const groupBySection = (rows: NormalizedRow[]) => {
      const map = new Map<string, NormalizedRow[]>();
      for (const r of rows) {
        const sk = sectionKeyFromRow(r);
        if (!map.has(sk)) map.set(sk, []);
        map.get(sk)!.push(r);
      }
      return map;
    };

    const excelOnlyBySection = groupBySection(excelOnlyRows);
    const apiOnlyBySection = groupBySection(apiOnlyRows);
    const allMismatchSections = new Set([...excelOnlyBySection.keys(), ...apiOnlyBySection.keys()]);

    for (const sk of allMismatchSections) {
      const parts = sk.split("||");
      const sectionLabel = `${parts[2]} > ${parts[3]} > ${parts[4]} (${parts[1]})`;

      const excelOnly = excelOnlyBySection.get(sk) ?? [];
      const apiOnly = apiOnlyBySection.get(sk) ?? [];

      if (excelOnly.length > 0) {
        mismatches.push({
          level: "Title", direction: "Excel only", context: sectionLabel,
          excelValue: excelOnly.map((r) => r.title).join("; "),
          apiValue: `${excelOnly.length} title(s) not found in API`,
        });
      }
      if (apiOnly.length > 0) {
        mismatches.push({
          level: "Title", direction: "API only", context: sectionLabel,
          excelValue: `${apiOnly.length} title(s) not found in Excel`,
          apiValue: apiOnly.map((r) => r.title).join("; "),
        });
      }
    }

    // ── STEP 9: Generate report ──
    console.log("Step 9: Generating report...");
    buildAndSaveReport(mismatches, {
      excelRows: excelData.rows.length,
      apiRows: apiNormalized.length,
      sectionsChecked: allApiSections.length,
      apiErrors,
    });
    console.log(`\nDone. ${mismatches.length} total mismatches found.`);
  });
});
