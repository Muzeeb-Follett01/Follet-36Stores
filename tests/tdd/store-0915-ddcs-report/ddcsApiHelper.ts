import { APIRequestContext } from "@playwright/test";
import {
  CampusTermApiResponse,
  FilteredDataApiResponse,
  ProductsApiResponse,
} from "./types";

const BASE_URL =
  process.env.API_BASE_URL || "https://winnipeg.bkstr.com/apps/shopifyData";

/**
 * Step 1 — Fetch all campuses and terms.
 */
export async function fetchCampusAndTerms(
  request: APIRequestContext
): Promise<CampusTermApiResponse> {
  console.log(`  GET ${BASE_URL}/getFilteredCampusTerm`);
  const response = await request.get(`${BASE_URL}/getFilteredCampusTerm`);
  if (!response.ok()) {
    throw new Error(
      `fetchCampusAndTerms failed: ${response.status()} ${response.statusText()}`
    );
  }
  return response.json();
}

/**
 * Step 2 — Fetch filtered DDCS data (sections, courses, departments) for a
 * given campus + term combination.
 */
export async function fetchFilteredData(
  request: APIRequestContext,
  campusEntityId: string,
  termId: string
): Promise<FilteredDataApiResponse> {
  const url = `${BASE_URL}/getFilteredData?campus_entity_id=${encodeURIComponent(
    campusEntityId
  )}&term_id=${encodeURIComponent(termId)}`;
  console.log(`  GET ${url}`);
  const response = await request.get(url);
  if (!response.ok()) {
    throw new Error(
      `fetchFilteredData failed (campus=${campusEntityId}, term=${termId}): ${response.status()}`
    );
  }
  return response.json();
}

/**
 * Step 3 — Fetch products for a single section GID with retry logic.
 */
export async function fetchProductsBySection(
  request: APIRequestContext,
  sectionGid: string,
  retries = 2
): Promise<ProductsApiResponse> {
  const query = `metafields.ddcs.ddcs_section:'${sectionGid}'`;
  const url = `${BASE_URL}/products?query=${encodeURIComponent(query)}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const response = await request.get(url);
    if (response.ok()) {
      return response.json();
    }
    if (attempt < retries && response.status() >= 500) {
      await new Promise((r) => setTimeout(r, 1_000 * (attempt + 1)));
      continue;
    }
    console.warn(
      `  ⚠ Products request failed for GID ${sectionGid}: ${response.status()}`
    );
    return { success: false, products: [], count: -1 };
  }
  return { success: false, products: [], count: -1 };
}

/**
 * Fetch products for many sections in parallel batches.
 * Returns Map<sectionGid, ProductsApiResponse>.
 */
export async function fetchProductsBatch(
  request: APIRequestContext,
  sectionGids: string[],
  concurrency = 10
): Promise<Map<string, ProductsApiResponse>> {
  const results = new Map<string, ProductsApiResponse>();

  for (let i = 0; i < sectionGids.length; i += concurrency) {
    const batch = sectionGids.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(async (gid) => {
        const resp = await fetchProductsBySection(request, gid);
        return { gid, resp };
      })
    );
    for (const { gid, resp } of batchResults) {
      results.set(gid, resp);
    }
    const processed = Math.min(i + concurrency, sectionGids.length);
    if (processed % 100 === 0 || processed === sectionGids.length) {
      console.log(
        `    Products fetched: ${processed} / ${sectionGids.length}`
      );
    }
  }

  return results;
}
