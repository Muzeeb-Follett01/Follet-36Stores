import ExcelJS from "exceljs";
import path from "path";

export interface ExcelRow {
  store_number: string;
  campus_name: string;
  term_name: string;
  division_name: string;
  department_name: string;
  course_name: string;
  section_name: string;
  title: string;
}

export interface ExcelData {
  rows: ExcelRow[];
  campuses: string[];
  terms: string[];
  termsByCampus: Map<string, string[]>;
  ddcsByCampusTerm: Map<string, { departments: string[]; courses: string[]; sections: string[] }>;
  titlesBySection: Map<string, string[]>;
}

function cellToString(value: ExcelJS.CellValue): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

export async function parseExcelFile(filePath: string): Promise<ExcelData> {
  const resolvedPath = path.resolve(filePath);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(resolvedPath);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) throw new Error(`No worksheets found in ${resolvedPath}`);

  const rows: ExcelRow[] = [];

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

  const campusSet = new Set<string>();
  const termSet = new Set<string>();
  const termsByCampus = new Map<string, Set<string>>();
  const ddcsByCampusTerm = new Map<string, { departments: Set<string>; courses: Set<string>; sections: Set<string> }>();
  const titlesBySection = new Map<string, Set<string>>();

  for (const row of rows) {
    campusSet.add(row.campus_name);
    termSet.add(row.term_name);

    // Terms grouped by campus
    if (!termsByCampus.has(row.campus_name)) {
      termsByCampus.set(row.campus_name, new Set());
    }
    termsByCampus.get(row.campus_name)!.add(row.term_name);

    // DDCs grouped by campus+term
    const campusTermKey = `${row.campus_name}||${row.term_name}`;
    if (!ddcsByCampusTerm.has(campusTermKey)) {
      ddcsByCampusTerm.set(campusTermKey, { departments: new Set(), courses: new Set(), sections: new Set() });
    }
    const ddc = ddcsByCampusTerm.get(campusTermKey)!;
    if (row.department_name) ddc.departments.add(row.department_name);
    if (row.course_name) ddc.courses.add(row.course_name);

    // Sections keyed by campus+term+department+course
    const sectionKey = `${campusTermKey}||${row.department_name}||${row.course_name}||${row.section_name}`;
    ddc.sections.add(sectionKey);

    // Titles grouped by section
    if (!titlesBySection.has(sectionKey)) {
      titlesBySection.set(sectionKey, new Set());
    }
    if (row.title) titlesBySection.get(sectionKey)!.add(row.title);
  }

  // Convert sets to arrays for the final output
  const termsByCampusArr = new Map<string, string[]>();
  termsByCampus.forEach((v, k) => termsByCampusArr.set(k, [...v]));

  const ddcsByCampusTermArr = new Map<string, { departments: string[]; courses: string[]; sections: string[] }>();
  ddcsByCampusTerm.forEach((v, k) =>
    ddcsByCampusTermArr.set(k, {
      departments: [...v.departments],
      courses: [...v.courses],
      sections: [...v.sections],
    })
  );

  const titlesBySectionArr = new Map<string, string[]>();
  titlesBySection.forEach((v, k) => titlesBySectionArr.set(k, [...v]));

  return {
    rows,
    campuses: [...campusSet],
    terms: [...termSet],
    termsByCampus: termsByCampusArr,
    ddcsByCampusTerm: ddcsByCampusTermArr,
    titlesBySection: titlesBySectionArr,
  };
}
