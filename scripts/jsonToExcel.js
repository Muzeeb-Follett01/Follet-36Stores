/**
 * One-time script: Converts follettTestData.json → follettTestData.xlsx
 * Run with:  node scripts/jsonToExcel.js
 */
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const jsonPath = path.resolve(__dirname, '../testdata/Follett/follettTestData.json');
const excelPath = path.resolve(__dirname, '../testdata/Follett/follettTestData.xlsx');

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Flatten a nested object into dot-notation keys. Arrays are stored as JSON strings. */
function flatten(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(value)) {
      result[fullKey] = JSON.stringify(value);
    } else if (value !== null && typeof value === 'object') {
      Object.assign(result, flatten(value, fullKey));
    } else {
      result[fullKey] = value;
    }
  }
  return result;
}

// ── Separate common vs spec-specific data ──────────────────────────────────────

const commonKeys = ['store', 'customer', 'delivery', 'payment'];
const common = {};
const specs = {};

for (const [key, value] of Object.entries(data)) {
  if (commonKeys.includes(key)) {
    common[key] = value;
  } else {
    specs[key] = value;
  }
}

// ── Single sheet: every row has all common + spec data filled ──────────────────

const flatCommon = flatten(common);

// Collect all possible spec-specific columns
const allSpecColumns = new Set();
const specRows = [];

for (const [specId, specData] of Object.entries(specs)) {
  const flatSpec = flatten(specData);
  for (const col of Object.keys(flatSpec)) {
    allSpecColumns.add(col);
  }
  specRows.push({ specId, flatSpec });
}

// Build column order: specId → common columns → spec columns (sorted)
const commonColumnKeys = Object.keys(flatCommon).sort();
const specOnlyKeys = Array.from(allSpecColumns).filter(c => !flatCommon[c]).sort();
const allColumns = ['specId', 'execute', ...commonColumnKeys, ...specOnlyKeys];

// Each row gets common defaults merged with spec data (spec overrides common)
const rows = specRows.map(({ specId, flatSpec }) => {
  const row = {};
  for (const col of allColumns) {
    if (col === 'specId') {
      row[col] = specId;
    } else if (col === 'execute') {
      row[col] = 'Y';
    } else if (flatSpec[col] !== undefined) {
      // Spec value overrides common default
      row[col] = flatSpec[col];
    } else if (flatCommon[col] !== undefined) {
      // Fall back to common default
      row[col] = flatCommon[col];
    } else {
      row[col] = '';
    }
  }
  return row;
});

const sheet = XLSX.utils.json_to_sheet(rows, { header: allColumns });

// ── Write workbook ─────────────────────────────────────────────────────────────

const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, sheet, 'TestData');
XLSX.writeFile(workbook, excelPath);

console.log(`Excel file created at: ${excelPath}`);
console.log(`  Single sheet "TestData": ${rows.length} rows (one per spec), ${allColumns.length} columns`);
