import { APIRequestContext } from "@playwright/test";

const BASE_URL = process.env.API_BASE_URL || "https://winnipeg.bkstr.com/apps/shopifyData";

export interface CampusTermResponse {
  success: boolean;
  data: {
    ddcs_campus: CampusData[];
    ddcs_term: TermData[];
  };
}

export interface CampusData {
  status: string;
  gid: string;
  campus_entity_id: string;
  name: string;
  store_number: string;
  is_division_used_flag: boolean;
  is_department_used_flag: boolean;
  disabled_flag: boolean;
}

export interface TermData {
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

export interface FilteredDataResponse {
  success: boolean;
  data: {
    ddcs_section: SectionData[];
    ddcs_course: CourseData[];
    ddcs_campus_department: DepartmentData[];
    ddcs_campus_division: DivisionData[];
  };
}

export interface SectionData {
  status: string;
  gid: string;
  section_id: string;
  course_id: string;
  term_id: string;
  campus_entity_id: string;
  name: string;
}

export interface CourseData {
  status: string;
  gid: string;
  course_id: string;
  campus_department_id: string;
  campus_entity_id: string;
  coursenumber: string;
}

export interface DepartmentData {
  status: string;
  gid: string;
  campus_department_id: string;
  campus_division_id: string;
  campus_entity_id: string;
  name: string;
  abbreviation: string;
}

export interface DivisionData {
  status: string;
  gid: string;
  campus_division_id: string;
  campus_entity_id: string;
  name: string;
}

export interface ProductsResponse {
  success: boolean;
  products: ProductData[];
  count: number;
}

export interface ProductData {
  title: string;
  url: string;
  status: string;
  id: string;
  handle: string;
  material_type: string;
}

export async function getCampusAndTerms(request: APIRequestContext): Promise<CampusTermResponse> {
  const response = await request.get(`${BASE_URL}/getFilteredCampusTerm`);
  if (!response.ok()) {
    throw new Error(`getCampusAndTerms failed: ${response.status()} ${response.statusText()}`);
  }
  return response.json();
}

export async function getFilteredData(
  request: APIRequestContext,
  campusEntityId: string,
  termId: string
): Promise<FilteredDataResponse> {
  const url = `${BASE_URL}/getFilteredData?campus_entity_id=${encodeURIComponent(campusEntityId)}&term_id=${encodeURIComponent(termId)}`;
  const response = await request.get(url);
  if (!response.ok()) {
    throw new Error(`getFilteredData failed for campus=${campusEntityId}, term=${termId}: ${response.status()}`);
  }
  return response.json();
}

export async function getProductsBySection(
  request: APIRequestContext,
  sectionGid: string,
  retries = 2
): Promise<ProductsResponse> {
  const query = `metafields.ddcs.ddcs_section:'${sectionGid}'`;
  const url = `${BASE_URL}/products?query=${encodeURIComponent(query)}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const response = await request.get(url);
    if (response.ok()) {
      return response.json();
    }
    if (attempt < retries && response.status() >= 500) {
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      continue;
    }
    return { success: false, products: [], count: -1 };
  }
  return { success: false, products: [], count: -1 };
}

/**
 * Fetch products for multiple sections in parallel batches.
 * Returns a Map of sectionGid → ProductsResponse.
 */
export async function getProductsForSectionsBatch(
  request: APIRequestContext,
  sectionGids: string[],
  concurrency = 10
): Promise<Map<string, ProductsResponse>> {
  const results = new Map<string, ProductsResponse>();

  for (let i = 0; i < sectionGids.length; i += concurrency) {
    const batch = sectionGids.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(async (gid) => {
        const resp = await getProductsBySection(request, gid);
        return { gid, resp };
      })
    );
    for (const { gid, resp } of batchResults) {
      results.set(gid, resp);
    }
    if ((i + concurrency) % 100 === 0 || i + concurrency >= sectionGids.length) {
      console.log(`    Products fetched: ${Math.min(i + concurrency, sectionGids.length)}/${sectionGids.length}`);
    }
  }

  return results;
}
