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

const STORE_NUMBER = process.env.STORE_NUMBER || "0915";
const EXCEL_FILE =
  process.env.EXCEL_FILE ||
  `testdata/Follett/${STORE_NUMBER}-cm-active-titles.xlsx`;

const OUTPUT_DIR = path.resolve(`output/${STORE_NUMBER}`);
const HTML_REPORT = path.join(OUTPUT_DIR, "ddcs_report_v3.html");

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function normalizeTitle(title: string): string {
  return title
    .replace(/&amp;/gi, "&")
    .trim()
    .toLowerCase();
}

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Main test ──

test.describe(`Store ${STORE_NUMBER} — DDCS HTML Report`, () => {
  test.describe.configure({ timeout: 1_800_000 });

  test("Fetch DDCS data, match with eComm Excel, generate HTML report", async ({
    request,
  }) => {
    ensureDir(OUTPUT_DIR);

    // ═══════════════════════════════════════════════════════════
    //  STEP 1 — Campus & Term IDs
    // ═══════════════════════════════════════════════════════════
    console.log("\n═══ STEP 1: Fetching Campus & Term IDs ═══");
    const campusTermResp = await fetchCampusAndTerms(request);
    expect(campusTermResp.success).toBe(true);

    const apiCampuses: ApiCampus[] = campusTermResp.data.ddcs_campus;
    const apiTerms: ApiTerm[] = campusTermResp.data.ddcs_term;
    console.log(`  Campuses: ${apiCampuses.length}, Terms: ${apiTerms.length}`);

    // ═══════════════════════════════════════════════════════════
    //  STEP 2 — Section GIDs
    // ═══════════════════════════════════════════════════════════
    console.log("\n═══ STEP 2: Fetching Section GIDs ═══");

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
      if (!filtered.success) continue;

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

    // ═══════════════════════════════════════════════════════════
    //  STEP 3 — Titles per GID
    // ═══════════════════════════════════════════════════════════
    console.log(
      `\n═══ STEP 3: Fetching titles for ${allSections.length} sections ═══`
    );

    const productsMap = await fetchProductsBatch(
      request,
      allSections.map((s) => s.sectionGid),
      10
    );

    interface TitleEntry {
      campusName: string;
      campusEntityId: string;
      termName: string;
      termId: string;
      departmentName: string;
      courseName: string;
      sectionName: string;
      sectionGid: string;
      titleName: string;
      materialType: string;
    }

    const allTitles: TitleEntry[] = [];
    let apiErrors = 0;
    const seen = new Set<string>();

    for (const sec of allSections) {
      const resp = productsMap.get(sec.sectionGid);
      if (!resp || resp.count === -1) {
        apiErrors++;
        continue;
      }
      seen.clear();
      for (const p of resp.products) {
        const key = `${sec.sectionGid}||${normalizeTitle(p.title)}`;
        if (seen.has(key)) continue;
        seen.add(key);
        allTitles.push({
          ...sec,
          titleName: p.title,
          materialType: p.material_type ?? "",
        });
      }
    }
    console.log(`  Titles: ${allTitles.length}, API errors: ${apiErrors}`);

    // ═══════════════════════════════════════════════════════════
    //  STEP 4 — Match eComm Excel titles against Shopify API
    // ═══════════════════════════════════════════════════════════
    console.log("\n═══ STEP 4: Checking eComm Excel titles in Shopify API ═══");
    const ecommRows: EcommExcelRow[] = await readEcommExcel(EXCEL_FILE);

    // Build a map: normalized title → list of API entries where it appears
    const shopifyByTitle = new Map<string, TitleEntry[]>();
    for (const t of allTitles) {
      const nt = normalizeTitle(t.titleName);
      if (!shopifyByTitle.has(nt)) shopifyByTitle.set(nt, []);
      shopifyByTitle.get(nt)!.push(t);
    }

    interface ReportRow {
      // eComm Excel fields
      excelTitle: string;
      excelCampusName: string;
      excelTermName: string;
      excelDepartmentName: string;
      excelCourseName: string;
      excelSectionName: string;
      // match status
      found: boolean;
      // Shopify API matches (sections where this title exists)
      shopifyMatches: TitleEntry[];
    }

    const reportRows: ReportRow[] = [];
    let foundCount = 0;
    let notFoundCount = 0;

    for (const row of ecommRows) {
      if (!row.title) continue;
      const nt = normalizeTitle(row.title);
      const matches = shopifyByTitle.get(nt) ?? [];
      const found = matches.length > 0;
      if (found) foundCount++;
      else notFoundCount++;

      reportRows.push({
        excelTitle: row.title,
        excelCampusName: row.campus_name ?? "",
        excelTermName: row.term_name ?? "",
        excelDepartmentName: row.department_name ?? "",
        excelCourseName: row.course_name ?? "",
        excelSectionName: row.section_name ?? "",
        found,
        shopifyMatches: matches,
      });
    }

    console.log(`  eComm Excel: ${ecommRows.length} rows loaded from ${path.resolve(EXCEL_FILE)}`);
    console.log(`  Found in Shopify: ${foundCount}, Not found: ${notFoundCount}`);

    // ═══════════════════════════════════════════════════════════
    //  BUILD HTML REPORT
    // ═══════════════════════════════════════════════════════════
    console.log("\n═══ Generating HTML Report ═══");

    const now = new Date().toISOString();

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Store ${STORE_NUMBER} — DDCS Report</title>
<style>
  :root {
    --bg: #f5f7fa;
    --card: #ffffff;
    --border: #e2e8f0;
    --text: #1a202c;
    --muted: #718096;
    --green: #38a169;
    --green-bg: #c6f6d5;
    --green-border: #9ae6b4;
    --red: #e53e3e;
    --red-bg: #fed7d7;
    --red-border: #feb2b2;
    --blue: #3182ce;
    --blue-bg: #bee3f8;
    --purple: #805ad5;
    --purple-bg: #e9d8fd;
    --orange: #dd6b20;
    --orange-bg: #feebc8;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }

  .header { background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%); color: white; padding: 2rem; text-align: center; }
  .header h1 { font-size: 1.8rem; font-weight: 700; margin-bottom: .3rem; }
  .header .sub { color: #a0aec0; font-size: .95rem; }

  .summary-bar { display: flex; flex-wrap: wrap; gap: 1rem; padding: 1.5rem 2rem; background: var(--card); border-bottom: 1px solid var(--border); }
  .stat { flex: 1; min-width: 140px; padding: 1rem; border-radius: 8px; text-align: center; }
  .stat .num { font-size: 1.8rem; font-weight: 700; }
  .stat .label { font-size: .8rem; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); }
  .stat.blue { background: var(--blue-bg); }
  .stat.blue .num { color: var(--blue); }
  .stat.purple { background: var(--purple-bg); }
  .stat.purple .num { color: var(--purple); }
  .stat.orange { background: var(--orange-bg); }
  .stat.orange .num { color: var(--orange); }
  .stat.green { background: var(--green-bg); }
  .stat.green .num { color: var(--green); }
  .stat.red { background: var(--red-bg); }
  .stat.red .num { color: var(--red); }

  .container { max-width: 1400px; margin: 0 auto; padding: 1.5rem; }

  .section-title { font-size: 1.3rem; font-weight: 700; margin: 2rem 0 1rem; padding-bottom: .5rem; border-bottom: 2px solid var(--border); display: flex; align-items: center; gap: .5rem; }
  .section-title .icon { font-size: 1.4rem; }

  .filter-bar { display: flex; gap: .8rem; margin-bottom: 1rem; flex-wrap: wrap; align-items: center; }
  .filter-bar input { padding: .5rem .8rem; border: 1px solid var(--border); border-radius: 6px; font-size: .9rem; width: 300px; }
  .filter-bar button { padding: .5rem 1rem; border: none; border-radius: 6px; cursor: pointer; font-size: .85rem; font-weight: 600; transition: .15s; }
  .filter-bar .btn-all { background: var(--blue-bg); color: var(--blue); }
  .filter-bar .btn-found { background: var(--green-bg); color: var(--green); }
  .filter-bar .btn-notfound { background: var(--red-bg); color: var(--red); }
  .filter-bar button:hover { opacity: .8; }
  .filter-bar button.active { outline: 2px solid currentColor; outline-offset: 1px; }
  .count-display { font-size: .85rem; color: var(--muted); margin-left: auto; }

  table { width: 100%; border-collapse: collapse; background: var(--card); border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.08); margin-bottom: 1.5rem; font-size: .85rem; }
  th { background: #2d3748; color: white; padding: .65rem .7rem; text-align: left; font-weight: 600; position: sticky; top: 0; white-space: nowrap; }
  td { padding: .55rem .7rem; border-bottom: 1px solid var(--border); vertical-align: top; }
  tr:hover td { background: #f7fafc; }
  tr.found td:first-child { border-left: 4px solid var(--green); }
  tr.not-found td:first-child { border-left: 4px solid var(--red); }

  .badge { display: inline-block; padding: .15rem .55rem; border-radius: 999px; font-size: .75rem; font-weight: 600; }
  .badge-found { background: var(--green-bg); color: var(--green); border: 1px solid var(--green-border); }
  .badge-not-found { background: var(--red-bg); color: var(--red); border: 1px solid var(--red-border); }

  .excel-details { margin-top: .3rem; }
  .excel-pill { display: inline-block; background: #edf2f7; padding: .15rem .5rem; border-radius: 4px; font-size: .75rem; color: var(--muted); margin: .1rem .15rem .1rem 0; }

  .campus-table { margin-bottom: 1rem; }
  .gid-cell { font-family: 'Cascadia Code', 'Fira Code', monospace; font-size: .78rem; color: var(--purple); word-break: break-all; }
  .id-cell { font-family: 'Cascadia Code', 'Fira Code', monospace; font-size: .78rem; color: var(--muted); word-break: break-all; }

  .footer { text-align: center; padding: 2rem; color: var(--muted); font-size: .8rem; }

  @media (max-width: 900px) {
    .summary-bar { padding: 1rem; }
    .container { padding: .8rem; }
    table { font-size: .78rem; }
    .filter-bar input { width: 100%; }
  }
</style>
</head>
<body>

<div class="header">
  <h1>📊 Store ${STORE_NUMBER} — eComm → Shopify Validation Report</h1>
  <div class="sub">Generated: ${now} &nbsp;|&nbsp; Checking if eComm (Excel) titles exist in Shopify (DDCS API)</div>
</div>

<div class="summary-bar">
  <div class="stat blue"><div class="num">${apiCampuses.length}</div><div class="label">Campuses</div></div>
  <div class="stat blue"><div class="num">${apiTerms.length}</div><div class="label">Terms</div></div>
  <div class="stat purple"><div class="num">${allSections.length.toLocaleString()}</div><div class="label">Sections (GIDs)</div></div>
  <div class="stat orange"><div class="num">${allTitles.length.toLocaleString()}</div><div class="label">Shopify Titles</div></div>
  <div class="stat blue"><div class="num">${ecommRows.length.toLocaleString()}</div><div class="label">eComm Excel Rows</div></div>
  <div class="stat green"><div class="num">${foundCount.toLocaleString()}</div><div class="label">Found in Shopify</div></div>
  <div class="stat red"><div class="num">${notFoundCount.toLocaleString()}</div><div class="label">Not in Shopify</div></div>
</div>

<div class="container">

<!-- ─── Section 1: Campus & Terms ─── -->
<div class="section-title"><span class="icon">🏫</span> Campus & Term IDs (API #1)</div>
<table class="campus-table">
  <thead><tr><th>#</th><th>Campus Name</th><th>Campus Entity ID</th><th>Term Name</th><th>Term ID</th></tr></thead>
  <tbody>
${(() => {
  const rows: string[] = [];
  let i = 0;
  for (const campus of apiCampuses) {
    const terms = apiTerms.filter(
      (t) => t.campus_entity_id === campus.campus_entity_id
    );
    for (const term of terms) {
      i++;
      rows.push(`    <tr><td>${i}</td><td>${esc(campus.name)}</td><td class="id-cell">${esc(campus.campus_entity_id)}</td><td>${esc(term.name)}</td><td class="id-cell">${esc(term.term_id)}</td></tr>`);
    }
  }
  return rows.join("\n");
})()}
  </tbody>
</table>

<!-- ─── Section 2: Main Titles Table ─── -->
<div class="section-title"><span class="icon">📋</span> eComm Titles — Shopify (DDCS) Availability</div>

<div class="filter-bar">
  <input type="text" id="searchBox" placeholder="Search title, campus, term, dept..." oninput="filterTable()">
  <button class="btn-all active" onclick="setFilter('all')">All (${reportRows.length.toLocaleString()})</button>
  <button class="btn-found" onclick="setFilter('found')">In Shopify (${foundCount.toLocaleString()})</button>
  <button class="btn-notfound" onclick="setFilter('notfound')">Not in Shopify (${notFoundCount.toLocaleString()})</button>
  <span class="count-display" id="countDisplay">Showing ${reportRows.length.toLocaleString()} rows</span>
</div>

<table id="mainTable">
  <thead>
    <tr>
      <th>#</th>
      <th>Status</th>
      <th>eComm Title</th>
      <th>eComm Campus</th>
      <th>eComm Term</th>
      <th>eComm Dept / Course / Section</th>
      <th>Shopify Matches</th>
    </tr>
  </thead>
  <tbody>
${reportRows
  .map((r, i) => {
    const cls = r.found ? "found" : "not-found";
    const badge = r.found
      ? '<span class="badge badge-found">IN SHOPIFY</span>'
      : '<span class="badge badge-not-found">NOT IN SHOPIFY</span>';

    let shopifyCol = "—";
    if (r.shopifyMatches.length > 0) {
      // Show unique section GIDs with campus/term context
      const seen = new Set<string>();
      const pills: string[] = [];
      for (const m of r.shopifyMatches) {
        const key = m.sectionGid;
        if (seen.has(key)) continue;
        seen.add(key);
        pills.push(`<span class="excel-pill">${esc(m.campusName)} › ${esc(m.termName)} › ${esc(m.departmentName)} › ${esc(m.courseName)} › ${esc(m.sectionName)} <span class="gid-cell">[${esc(m.sectionGid.substring(0, 8))}…]</span></span>`);
      }
      shopifyCol = `<div class="excel-details">${pills.join("")}</div>`;
    }

    return `    <tr class="${cls}" data-status="${r.found ? "found" : "notfound"}">
      <td>${i + 1}</td>
      <td>${badge}</td>
      <td><strong>${esc(r.excelTitle)}</strong></td>
      <td>${esc(r.excelCampusName)}</td>
      <td>${esc(r.excelTermName)}</td>
      <td>${esc(r.excelDepartmentName)} › ${esc(r.excelCourseName)} › ${esc(r.excelSectionName)}</td>
      <td>${shopifyCol}</td>
    </tr>`;
  })
  .join("\n")}
  </tbody>
</table>

</div>

<div class="footer">
  Store ${STORE_NUMBER} — eComm → Shopify Report &nbsp;|&nbsp; ${now} &nbsp;|&nbsp; ${reportRows.length.toLocaleString()} eComm titles &nbsp;|&nbsp; ${foundCount.toLocaleString()} in Shopify, ${notFoundCount.toLocaleString()} not in Shopify
</div>

<script>
let currentFilter = 'all';

function setFilter(f) {
  currentFilter = f;
  document.querySelectorAll('.filter-bar button').forEach(b => b.classList.remove('active'));
  document.querySelector('.btn-' + (f === 'notfound' ? 'notfound' : f)).classList.add('active');
  filterTable();
}

function filterTable() {
  const q = document.getElementById('searchBox').value.toLowerCase();
  const rows = document.querySelectorAll('#mainTable tbody tr');
  let shown = 0;
  rows.forEach(row => {
    const status = row.getAttribute('data-status');
    const text = row.textContent.toLowerCase();
    const matchFilter = currentFilter === 'all' || status === currentFilter;
    const matchSearch = !q || text.includes(q);
    const visible = matchFilter && matchSearch;
    row.style.display = visible ? '' : 'none';
    if (visible) shown++;
  });
  document.getElementById('countDisplay').textContent = 'Showing ' + shown.toLocaleString() + ' rows';
}
</script>

</body>
</html>`;

    fs.writeFileSync(HTML_REPORT, html, "utf-8");
    console.log(`  ✔ HTML Report saved: ${HTML_REPORT}`);
    console.log(`    ${reportRows.length} total rows, ${foundCount} found, ${notFoundCount} not found`);
  });
});
