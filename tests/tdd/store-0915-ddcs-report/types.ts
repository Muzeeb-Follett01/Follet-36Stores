// ── API Response Types ──

export interface CampusTermApiResponse {
  success: boolean;
  data: {
    ddcs_campus: ApiCampus[];
    ddcs_term: ApiTerm[];
  };
}

export interface ApiCampus {
  status: string;
  gid: string;
  campus_entity_id: string;
  name: string;
  store_number: string;
  is_division_used_flag: boolean;
  is_department_used_flag: boolean;
  disabled_flag: boolean;
}

export interface ApiTerm {
  status: string;
  gid: string;
  term_id: string;
  term: string;
  campus_entity_id: string;
  name: string;
  disabled_flag: boolean;
  is_term_open_flag: boolean;
  store_number: string;
}

export interface FilteredDataApiResponse {
  success: boolean;
  data: {
    ddcs_section: ApiSection[];
    ddcs_course: ApiCourse[];
    ddcs_campus_department: ApiDepartment[];
    ddcs_campus_division: ApiDivision[];
  };
}

export interface ApiSection {
  status: string;
  gid: string;
  section_id: string;
  course_id: string;
  term_id: string;
  campus_entity_id: string;
  name: string;
}

export interface ApiCourse {
  status: string;
  gid: string;
  course_id: string;
  campus_department_id: string;
  campus_entity_id: string;
  coursenumber: string;
}

export interface ApiDepartment {
  status: string;
  gid: string;
  campus_department_id: string;
  campus_division_id: string;
  campus_entity_id: string;
  name: string;
  abbreviation: string;
}

export interface ApiDivision {
  status: string;
  gid: string;
  campus_division_id: string;
  campus_entity_id: string;
  name: string;
}

export interface ProductsApiResponse {
  success: boolean;
  products: ApiProduct[];
  count: number;
}

export interface ApiProduct {
  title: string;
  url: string;
  status: string;
  id: string;
  handle: string;
  material_type: string;
}

// ── Output Row Types ──

export interface CampusTermRow {
  campusName: string;
  campusEntityId: string;
  termName: string;
  termId: string;
}

export interface SectionRow {
  campusName: string;
  campusEntityId: string;
  termName: string;
  termId: string;
  departmentName: string;
  courseName: string;
  sectionName: string;
  sectionGid: string;
}

export interface TitleRow {
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
  productId: string;
  productUrl: string;
}

// ── Excel Source Row ──

export interface EcommExcelRow {
  store_number: string;
  campus_name: string;
  term_name: string;
  division_name: string;
  department_name: string;
  course_name: string;
  section_name: string;
  title: string;
}

// ── Comparison Report Row ──

export interface ComparisonReportRow {
  campusName: string;
  termName: string;
  departmentName: string;
  courseName: string;
  sectionName: string;
  titleName: string;
  campusEntityId: string;
  termId: string;
  sectionGid: string;
  matchStatus: "FOUND_IN_ECOMM" | "NOT_FOUND_IN_ECOMM";
  source: "API" | "EXCEL_ONLY";
}
