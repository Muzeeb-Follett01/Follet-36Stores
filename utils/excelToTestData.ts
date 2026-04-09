import excelToJson from "convert-excel-to-json";
import path from "path";

const excelFileName = process.env.EXCEL_FILE ?? "follettTestData.xlsx";
const EXCEL_PATH = path.isAbsolute(excelFileName)
  ? excelFileName
  : path.resolve(__dirname, "../testdata/Follett", excelFileName);

/**
 * Unflatten dot-notation keys into a nested object.
 * e.g. { "store.url": "x", "product.name": "y" } → { store: { url: "x" }, product: { name: "y" } }
 */
function unflatten(flat: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [dotKey, value] of Object.entries(flat)) {
    if (value === "" || value === undefined || value === null) continue;
    const keys = dotKey.split(".");
    let current = result;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  }
  return result;
}

/**
 * Try to parse a value as JSON (for array columns like "products").
 * Returns the parsed value if valid JSON array/object, otherwise the original string.
 */
function tryParseJson(value: any): any {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (
    (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
    (trimmed.startsWith("{") && trimmed.endsWith("}"))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return value;
    }
  }
  return value;
}

/** Common (root-level) column prefixes or exact names */
const COMMON_PREFIXES = [
  "store.",
  "customer.",
  "delivery.",
  "payment.",
  "confirmMessage",
];

function isCommonColumn(col: string): boolean {
  return COMMON_PREFIXES.some((prefix) =>
    prefix.endsWith(".") ? col.startsWith(prefix) : col === prefix,
  );
}

const enabledSpecs = new Set<string>();

function loadTestData() {
  const raw = excelToJson({
    sourceFile: EXCEL_PATH,
    header: { rows: 1 },
    columnToKey: { "*": "{{columnHeader}}" },
  }) as Record<string, Record<string, any>[]>;

  // ── Single "TestData" sheet (or first available sheet) ───────────────────
  // Each row = one spec with all common data filled in.
  // Common columns are repeated on every row; spec overrides take precedence.
  const sheetName = raw["TestData"] ? "TestData" : Object.keys(raw)[0];
  const rows = (sheetName ? raw[sheetName] : []) || [];
  if (rows.length === 0) return {};

  // Determine the common baseline for each common column as the most frequent value
  const commonFreqs: Record<string, Map<any, number>> = {};
  for (const row of rows) {
    for (const [key, val] of Object.entries(row)) {
      if (key === "specId" || !isCommonColumn(key)) continue;
      if (val === "" || val === undefined || val === null) continue;
      if (!commonFreqs[key]) commonFreqs[key] = new Map();
      const count = commonFreqs[key].get(val) || 0;
      commonFreqs[key].set(val, count + 1);
    }
  }

  // The common default is the most frequent value per column
  const commonFlat: Record<string, any> = {};
  for (const [key, freqMap] of Object.entries(commonFreqs)) {
    let maxVal: any = undefined;
    let maxCount = 0;
    for (const [val, count] of freqMap.entries()) {
      if (count > maxCount) {
        maxCount = count;
        maxVal = val;
      }
    }
    if (maxVal !== undefined) commonFlat[key] = tryParseJson(maxVal);
  }
  const common = unflatten(commonFlat);

  // Extract spec-specific data per row
  // Common columns that differ from the baseline are included in the spec's data
  const specs: Record<string, any> = {};
  for (const row of rows) {
    const specId = row["specId"];
    if (!specId) continue;

    if (row["execute"]?.toString().toUpperCase() === "Y") {
      enabledSpecs.add(specId);
    }

    const flat: Record<string, any> = {};
    for (const [key, val] of Object.entries(row)) {
      if (key === "specId" || key === "execute") continue;
      if (val === "" || val === undefined || val === null) continue;
      flat[key] = tryParseJson(val);
    }
    specs[specId] = unflatten(flat);
  }

  return { ...common, ...specs };
}

const testData = loadTestData();
export default testData;

// Store ID derived from the Excel file name, e.g. "bkstr-0125.xlsx" → "0125"
const _fileNameMatch = path
  .basename(excelFileName, ".xlsx")
  .match(/bkstr[-.]?(\d+)/i);
export const storeId: string = _fileNameMatch ? _fileNameMatch[1] : "store";

export function isEnabled(specId: string): boolean {
  return enabledSpecs.has(specId);
}
