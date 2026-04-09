import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";
import {
  CampusTermRow,
  SectionRow,
  TitleRow,
  ComparisonReportRow,
  EcommExcelRow,
} from "./types";

// ── Helpers ──

function cellToString(value: ExcelJS.CellValue): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function ensureDir(filePath: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ── Read eComm Excel ──

export async function readEcommExcel(filePath: string): Promise<EcommExcelRow[]> {
  const resolved = path.resolve(filePath);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(resolved);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) throw new Error(`No worksheets found in ${resolved}`);

  const rows: EcommExcelRow[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // skip header
    rows.push({
      store_number: cellToString(row.getCell(1).value),
      campus_name: cellToString(row.getCell(2).value),
      term_name: cellToString(row.getCell(3).value),
      division_name: cellToString(row.getCell(4).value),
      department_name: cellToString(row.getCell(5).value),
      course_name: cellToString(row.getCell(6).value),
      section_name: cellToString(row.getCell(7).value),
      title: cellToString(row.getCell(8).value),
    });
  });

  console.log(`  eComm Excel: ${rows.length} rows loaded from ${resolved}`);
  return rows;
}

// ── Write Campus + Term output ──

export async function writeCampusTermExcel(
  filePath: string,
  rows: CampusTermRow[]
): Promise<void> {
  ensureDir(filePath);
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Campus_Term");

  sheet.columns = [
    { header: "Campus Name", key: "campusName", width: 40 },
    { header: "Campus Entity ID", key: "campusEntityId", width: 20 },
    { header: "Term Name", key: "termName", width: 30 },
    { header: "Term ID", key: "termId", width: 15 },
  ];

  // Style header row
  sheet.getRow(1).font = { bold: true };

  for (const r of rows) {
    sheet.addRow(r);
  }

  await workbook.xlsx.writeFile(path.resolve(filePath));
  console.log(`  ✔ Campus/Term output saved: ${filePath} (${rows.length} rows)`);
}

// ── Write Section / GID output ──

export async function writeSectionExcel(
  filePath: string,
  rows: SectionRow[]
): Promise<void> {
  ensureDir(filePath);
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Sections");

  sheet.columns = [
    { header: "Campus Name", key: "campusName", width: 40 },
    { header: "Campus Entity ID", key: "campusEntityId", width: 20 },
    { header: "Term Name", key: "termName", width: 30 },
    { header: "Term ID", key: "termId", width: 15 },
    { header: "Department", key: "departmentName", width: 30 },
    { header: "Course", key: "courseName", width: 25 },
    { header: "Section", key: "sectionName", width: 25 },
    { header: "Section GID", key: "sectionGid", width: 50 },
  ];

  sheet.getRow(1).font = { bold: true };

  for (const r of rows) {
    sheet.addRow(r);
  }

  await workbook.xlsx.writeFile(path.resolve(filePath));
  console.log(`  ✔ Section output saved: ${filePath} (${rows.length} rows)`);
}

// ── Write DDCS Titles output ──

export async function writeTitlesExcel(
  filePath: string,
  rows: TitleRow[]
): Promise<void> {
  ensureDir(filePath);
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("DDCS_Titles");

  sheet.columns = [
    { header: "Campus Name", key: "campusName", width: 40 },
    { header: "Campus Entity ID", key: "campusEntityId", width: 20 },
    { header: "Term Name", key: "termName", width: 30 },
    { header: "Term ID", key: "termId", width: 15 },
    { header: "Department", key: "departmentName", width: 30 },
    { header: "Course", key: "courseName", width: 25 },
    { header: "Section", key: "sectionName", width: 25 },
    { header: "Section GID", key: "sectionGid", width: 50 },
    { header: "Title / Product Name", key: "titleName", width: 60 },
    { header: "Material Type", key: "materialType", width: 20 },
    { header: "Product ID", key: "productId", width: 25 },
    { header: "Product URL", key: "productUrl", width: 60 },
  ];

  sheet.getRow(1).font = { bold: true };

  for (const r of rows) {
    sheet.addRow(r);
  }

  await workbook.xlsx.writeFile(path.resolve(filePath));
  console.log(`  ✔ Titles output saved: ${filePath} (${rows.length} rows)`);
}

// ── Write Comparison Report ──

export async function writeComparisonReport(
  filePath: string,
  rows: ComparisonReportRow[]
): Promise<void> {
  ensureDir(filePath);
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Comparison_Report");

  sheet.columns = [
    { header: "Match Status", key: "matchStatus", width: 22 },
    { header: "Source", key: "source", width: 14 },
    { header: "Campus Name", key: "campusName", width: 40 },
    { header: "Term Name", key: "termName", width: 30 },
    { header: "Department", key: "departmentName", width: 30 },
    { header: "Course", key: "courseName", width: 25 },
    { header: "Section", key: "sectionName", width: 25 },
    { header: "Title / Product Name", key: "titleName", width: 60 },
    { header: "Campus Entity ID", key: "campusEntityId", width: 20 },
    { header: "Term ID", key: "termId", width: 15 },
    { header: "Section GID", key: "sectionGid", width: 50 },
  ];

  sheet.getRow(1).font = { bold: true };

  const greenFill: ExcelJS.Fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFC6EFCE" },
  };
  const redFill: ExcelJS.Fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFC7CE" },
  };

  for (const r of rows) {
    const excelRow = sheet.addRow(r);
    // Highlight: green for found, red for not found
    const statusCell = excelRow.getCell(1);
    statusCell.fill = r.matchStatus === "FOUND_IN_ECOMM" ? greenFill : redFill;
  }

  await workbook.xlsx.writeFile(path.resolve(filePath));
  console.log(`  ✔ Comparison report saved: ${filePath} (${rows.length} rows)`);
}
