import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import {
  fetchCampusAndTerms,
  fetchFilteredData,
  fetchProductsBatch,
} from "./ddcsApiHelper";
import { readEcommExcel } from "./excelUtils";
import { ApiCampus, ApiTerm, EcommExcelRow } from "./types";

// ── Configuration ──

const STORE_NUMBER = process.env.STORE_NUMBER || "0915";
const EXCEL_FILE =
  process.env.EXCEL_FILE ||
  `testdata/Follett/${STORE_NUMBER}-cm-active-titles.xlsx`;

const OUTPUT_DIR = path.resolve(`output/${STORE_NUMBER}`);
const FILE_1 = path.join(OUTPUT_DIR, "1_campus_term_ids.txt");
const FILE_2 = path.join(OUTPUT_DIR, "2_section_gid_ids.txt");
const FILE_3 = path.join(OUTPUT_DIR, "3_titles_by_gid.txt");
const FILE_4 = path.join(OUTPUT_DIR, "4_matched_ecomm_details.txt");

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function normalizeTitle(title: string): string {
  return title.trim().toLowerCase();
}

function separator(char = "─", len = 100): string {
  return char.repeat(len);
}

// ── Main test ──

test.describe(`Store ${STORE_NUMBER} — DDCS TXT Reports`, () => {
  test.describe.configure({ timeout: 1_800_000 }); // 30 min

  test("Fetch DDCS data, match with eComm Excel, generate 4 txt reports", async ({
    request,
  }) => {
    ensureDir(OUTPUT_DIR);

    // ================================================================
    //  FILE 1 — Campus IDs & Term IDs from API #1
    // ================================================================
    console.log("\n═══ FILE 1: Fetching Campus & Term IDs (API #1) ═══");

    const campusTermResp = await fetchCampusAndTerms(request);
    expect(campusTermResp.success, "Campus/Term API should succeed").toBe(true);

    const apiCampuses: ApiCampus[] = campusTermResp.data.ddcs_campus;
    const apiTerms: ApiTerm[] = campusTermResp.data.ddcs_term;

    console.log(`  Campuses: ${apiCampuses.length}`);
    console.log(`  Terms:    ${apiTerms.length}`);

    // Build File 1 content
    const file1Lines: string[] = [];
    file1Lines.push(separator("="));
    file1Lines.push(`  FILE 1 — Campus IDs & Term IDs (API #1)`);
    file1Lines.push(`  Store: ${STORE_NUMBER}`);
    file1Lines.push(`  Generated: ${new Date().toISOString()}`);
    file1Lines.push(separator("="));
    file1Lines.push("");
    file1Lines.push(`Total Campuses: ${apiCampuses.length}`);
    file1Lines.push(`Total Terms:    ${apiTerms.length}`);
    file1Lines.push("");

    for (const campus of apiCampuses) {
      file1Lines.push(separator());
      file1Lines.push(`Campus Name:      ${campus.name}`);
      file1Lines.push(`Campus Entity ID: ${campus.campus_entity_id}`);
      file1Lines.push(`Store Number:     ${campus.store_number}`);
      file1Lines.push(`Status:           ${campus.status}`);
      file1Lines.push("");

      const campusTerms = apiTerms.filter(
        (t) => t.campus_entity_id === campus.campus_entity_id
      );
      file1Lines.push(`  Terms (${campusTerms.length}):`);
      file1Lines.push(
        `  ${"Term Name".padEnd(45)} ${"Term ID".padEnd(40)}`
      );
      file1Lines.push(`  ${separator("─", 85)}`);

      for (const term of campusTerms) {
        file1Lines.push(
          `  ${term.name.padEnd(45)} ${term.term_id.padEnd(40)}`
        );
      }
      file1Lines.push("");
    }

    fs.writeFileSync(FILE_1, file1Lines.join("\n"), "utf-8");
    console.log(`  ✔ File 1 saved: ${FILE_1}`);

    // ================================================================
    //  FILE 2 — Section GID IDs from API #2
    // ================================================================
    console.log("\n═══ FILE 2: Fetching Section GID IDs (API #2) ═══");

    interface SectionInfo {
      campusName: string;
      campusEntityId: string;
      termName: string;
      termId: string;
      departmentName: string;
      courseName: string;
      sectionName: string;
      sectionGid: string;
    }

    const allSections: SectionInfo[] = [];

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

        allSections.push({
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

      console.log(
        `  ${campus.name} / ${term.name}: ${sections.length} sections`
      );
    }

    // Build File 2 content
    const file2Lines: string[] = [];
    file2Lines.push(separator("="));
    file2Lines.push(`  FILE 2 — Section GID IDs (API #2)`);
    file2Lines.push(`  Store: ${STORE_NUMBER}`);
    file2Lines.push(`  Generated: ${new Date().toISOString()}`);
    file2Lines.push(separator("="));
    file2Lines.push("");
    file2Lines.push(`Total Section GIDs: ${allSections.length}`);
    file2Lines.push("");

    // Group by campus → term
    const byCampusTerm = new Map<string, SectionInfo[]>();
    for (const sec of allSections) {
      const key = `${sec.campusName}||${sec.termName}`;
      if (!byCampusTerm.has(key)) byCampusTerm.set(key, []);
      byCampusTerm.get(key)!.push(sec);
    }

    for (const [key, sections] of byCampusTerm) {
      const [campusName, termName] = key.split("||");
      const campusId = sections[0].campusEntityId;
      const termId = sections[0].termId;

      file2Lines.push(separator());
      file2Lines.push(`Campus:    ${campusName} (${campusId})`);
      file2Lines.push(`Term:      ${termName} (${termId})`);
      file2Lines.push(`Sections:  ${sections.length}`);
      file2Lines.push("");
      file2Lines.push(
        `  ${"#".padEnd(5)} ${"Department".padEnd(30)} ${"Course".padEnd(20)} ${"Section".padEnd(20)} GID`
      );
      file2Lines.push(`  ${separator("─", 140)}`);

      sections.forEach((sec, i) => {
        file2Lines.push(
          `  ${String(i + 1).padEnd(5)} ${sec.departmentName.padEnd(30)} ${sec.courseName.padEnd(20)} ${sec.sectionName.padEnd(20)} ${sec.sectionGid}`
        );
      });
      file2Lines.push("");
    }

    fs.writeFileSync(FILE_2, file2Lines.join("\n"), "utf-8");
    console.log(`  ✔ File 2 saved: ${FILE_2}`);

    // ================================================================
    //  FILE 3 — Titles + GID IDs from API #3
    // ================================================================
    console.log(
      `\n═══ FILE 3: Fetching Titles for ${allSections.length} sections (API #3) ═══`
    );

    const allGids = allSections.map((s) => s.sectionGid);
    const productsMap = await fetchProductsBatch(request, allGids, 10);

    interface TitleEntry {
      sectionGid: string;
      campusName: string;
      termName: string;
      departmentName: string;
      courseName: string;
      sectionName: string;
      titleName: string;
      materialType: string;
    }

    const allTitles: TitleEntry[] = [];
    let apiErrors = 0;
    const seenTitles = new Set<string>();

    for (const sec of allSections) {
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

        allTitles.push({
          sectionGid: sec.sectionGid,
          campusName: sec.campusName,
          termName: sec.termName,
          departmentName: sec.departmentName,
          courseName: sec.courseName,
          sectionName: sec.sectionName,
          titleName: product.title,
          materialType: product.material_type ?? "",
        });
      }
    }

    // Build File 3 content
    const file3Lines: string[] = [];
    file3Lines.push(separator("="));
    file3Lines.push(`  FILE 3 — DDCS Titles by Section GID (API #3)`);
    file3Lines.push(`  Store: ${STORE_NUMBER}`);
    file3Lines.push(`  Generated: ${new Date().toISOString()}`);
    file3Lines.push(separator("="));
    file3Lines.push("");
    file3Lines.push(`Total Titles (deduplicated): ${allTitles.length}`);
    file3Lines.push(`API Errors (skipped):        ${apiErrors}`);
    file3Lines.push("");

    // Group by GID
    const titlesByGid = new Map<string, TitleEntry[]>();
    for (const t of allTitles) {
      if (!titlesByGid.has(t.sectionGid)) titlesByGid.set(t.sectionGid, []);
      titlesByGid.get(t.sectionGid)!.push(t);
    }

    for (const [gid, titles] of titlesByGid) {
      const first = titles[0];
      file3Lines.push(separator());
      file3Lines.push(`GID:        ${gid}`);
      file3Lines.push(`Campus:     ${first.campusName}`);
      file3Lines.push(`Term:       ${first.termName}`);
      file3Lines.push(`Department: ${first.departmentName}`);
      file3Lines.push(`Course:     ${first.courseName}`);
      file3Lines.push(`Section:    ${first.sectionName}`);
      file3Lines.push(`Titles (${titles.length}):`);

      for (const t of titles) {
        file3Lines.push(`  • ${t.titleName}${t.materialType ? ` [${t.materialType}]` : ""}`);
      }
      file3Lines.push("");
    }

    fs.writeFileSync(FILE_3, file3Lines.join("\n"), "utf-8");
    console.log(
      `  ✔ File 3 saved: ${FILE_3} (${allTitles.length} titles, ${apiErrors} errors)`
    );

    // ================================================================
    //  FILE 4 — Matched eComm Excel Details
    // ================================================================
    console.log("\n═══ FILE 4: Matching titles with eComm Excel ═══");

    const ecommRows: EcommExcelRow[] = await readEcommExcel(EXCEL_FILE);

    // Build eComm lookup: normalized title → EcommExcelRow[]
    const ecommByTitle = new Map<string, EcommExcelRow[]>();
    for (const row of ecommRows) {
      if (!row.title) continue;
      const nt = normalizeTitle(row.title);
      if (!ecommByTitle.has(nt)) ecommByTitle.set(nt, []);
      ecommByTitle.get(nt)!.push(row);
    }

    const file4Lines: string[] = [];
    file4Lines.push(separator("="));
    file4Lines.push(`  FILE 4 — DDCS Titles Matched with eComm Excel`);
    file4Lines.push(`  Store: ${STORE_NUMBER}`);
    file4Lines.push(`  Excel:  ${EXCEL_FILE}`);
    file4Lines.push(`  Generated: ${new Date().toISOString()}`);
    file4Lines.push(separator("="));
    file4Lines.push("");

    let foundCount = 0;
    let notFoundCount = 0;

    // ── Section A: Titles FOUND in eComm ──
    file4Lines.push(separator("="));
    file4Lines.push("  SECTION A — Titles FOUND in eComm Excel");
    file4Lines.push(separator("="));
    file4Lines.push("");

    for (const t of allTitles) {
      const nt = normalizeTitle(t.titleName);
      const matches = ecommByTitle.get(nt);
      if (!matches || matches.length === 0) continue;

      foundCount++;
      file4Lines.push(separator());
      file4Lines.push(`  Status:       FOUND_IN_ECOMM`);
      file4Lines.push(`  API Title:    ${t.titleName}`);
      file4Lines.push(`  Section GID:  ${t.sectionGid}`);
      file4Lines.push(`  Campus (API): ${t.campusName}`);
      file4Lines.push(`  Term (API):   ${t.termName}`);
      file4Lines.push(`  Dept (API):   ${t.departmentName}`);
      file4Lines.push(`  Course (API): ${t.courseName}`);
      file4Lines.push(`  Section(API): ${t.sectionName}`);
      file4Lines.push("");
      file4Lines.push(`  eComm Excel Match(es): ${matches.length}`);

      for (const m of matches) {
        file4Lines.push(`    ┌─ Excel Row ─────────────────────────────────`);
        file4Lines.push(`    │ Store Number:  ${m.store_number}`);
        file4Lines.push(`    │ Campus Name:   ${m.campus_name}`);
        file4Lines.push(`    │ Term:          ${m.term_name}`);
        file4Lines.push(`    │ Division:      ${m.division_name}`);
        file4Lines.push(`    │ Department:    ${m.department_name}`);
        file4Lines.push(`    │ Course:        ${m.course_name}`);
        file4Lines.push(`    │ Section:       ${m.section_name}`);
        file4Lines.push(`    │ Title:         ${m.title}`);
        file4Lines.push(`    └──────────────────────────────────────────────`);
      }
      file4Lines.push("");
    }

    // ── Section B: Titles NOT FOUND in eComm ──
    file4Lines.push("");
    file4Lines.push(separator("="));
    file4Lines.push("  SECTION B — Titles NOT FOUND in eComm Excel");
    file4Lines.push(separator("="));
    file4Lines.push("");

    for (const t of allTitles) {
      const nt = normalizeTitle(t.titleName);
      const matches = ecommByTitle.get(nt);
      if (matches && matches.length > 0) continue;

      notFoundCount++;
      file4Lines.push(`  [NOT_FOUND_IN_ECOMM]`);
      file4Lines.push(`    Title:       ${t.titleName}`);
      file4Lines.push(`    Section GID: ${t.sectionGid}`);
      file4Lines.push(`    Campus:      ${t.campusName}`);
      file4Lines.push(`    Term:        ${t.termName}`);
      file4Lines.push(`    Department:  ${t.departmentName}`);
      file4Lines.push(`    Course:      ${t.courseName}`);
      file4Lines.push(`    Section:     ${t.sectionName}`);
      file4Lines.push("");
    }

    // ── Summary ──
    file4Lines.push("");
    file4Lines.push(separator("="));
    file4Lines.push("  SUMMARY");
    file4Lines.push(separator("="));
    file4Lines.push(`  Total API Titles:          ${allTitles.length}`);
    file4Lines.push(`  Titles FOUND in eComm:     ${foundCount}`);
    file4Lines.push(`  Titles NOT FOUND in eComm: ${notFoundCount}`);
    file4Lines.push(`  eComm Excel rows:          ${ecommRows.length}`);

    fs.writeFileSync(FILE_4, file4Lines.join("\n"), "utf-8");
    console.log(`  ✔ File 4 saved: ${FILE_4}`);

    // ── Final Summary ──
    console.log("\n══════════ FINAL SUMMARY ══════════");
    console.log(`  Campuses:               ${apiCampuses.length}`);
    console.log(`  Terms:                  ${apiTerms.length}`);
    console.log(`  Sections (GIDs):        ${allSections.length}`);
    console.log(`  Titles (deduplicated):  ${allTitles.length}`);
    console.log(`  eComm Excel rows:       ${ecommRows.length}`);
    console.log(`  Titles FOUND in eComm:  ${foundCount}`);
    console.log(`  Titles NOT FOUND:       ${notFoundCount}`);
    console.log(`  API errors:             ${apiErrors}`);
    console.log(`  ──────────────────────────────`);
    console.log(`  Output files:`);
    console.log(`    1. ${FILE_1}`);
    console.log(`    2. ${FILE_2}`);
    console.log(`    3. ${FILE_3}`);
    console.log(`    4. ${FILE_4}`);
    console.log("══════════════════════════════════\n");
  });
});
