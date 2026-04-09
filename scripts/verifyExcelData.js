const excelToJson = require('convert-excel-to-json');
const path = require('path');

const EXCEL_PATH = path.resolve(__dirname, '../testdata/Follett/follettTestData.xlsx');

function unflatten(flat) {
  const result = {};
  for (const [dotKey, value] of Object.entries(flat)) {
    if (value === '' || value === undefined || value === null) continue;
    const keys = dotKey.split('.');
    let current = result;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  }
  return result;
}

function tryParseJson(value) {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if ((trimmed.startsWith('[') && trimmed.endsWith(']')) ||
      (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
    try { return JSON.parse(trimmed); } catch { return value; }
  }
  return value;
}

const COMMON_PREFIXES = ['store.', 'customer.', 'delivery.', 'payment.'];
function isCommonColumn(col) {
  return COMMON_PREFIXES.some(prefix => col.startsWith(prefix));
}

const raw = excelToJson({
  sourceFile: EXCEL_PATH,
  header: { rows: 1 },
  columnToKey: { '*': '{{columnHeader}}' },
});

const rows = raw['TestData'] || [];

// Determine common baseline via most frequent value per common column
const commonFreqs = {};
for (const row of rows) {
  for (const [key, val] of Object.entries(row)) {
    if (key === 'specId' || !isCommonColumn(key)) continue;
    if (val === '' || val === undefined || val === null) continue;
    if (!commonFreqs[key]) commonFreqs[key] = new Map();
    const count = commonFreqs[key].get(val) || 0;
    commonFreqs[key].set(val, count + 1);
  }
}
const commonFlat = {};
for (const [key, freqMap] of Object.entries(commonFreqs)) {
  let maxVal, maxCount = 0;
  for (const [val, count] of freqMap.entries()) {
    if (count > maxCount) { maxCount = count; maxVal = val; }
  }
  if (maxVal !== undefined) commonFlat[key] = tryParseJson(maxVal);
}
const common = unflatten(commonFlat);

const specs = {};
for (const row of rows) {
  const specId = row['specId'];
  if (!specId) continue;
  const flat = {};
  for (const [key, val] of Object.entries(row)) {
    if (key === 'specId') continue;
    if (isCommonColumn(key)) {
      if (val !== '' && val !== undefined && val !== null && val !== commonFlat[key]) {
        flat[key] = tryParseJson(val);
      }
      continue;
    }
    flat[key] = tryParseJson(val);
  }
  specs[specId] = unflatten(flat);
}

const testData = { ...common, ...specs };

// Compare with original JSON
const fs = require('fs');
const original = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../testdata/Follett/follettTestData.json'), 'utf-8'));

// Check key-level match
const origKeys = Object.keys(original).sort();
const newKeys = Object.keys(testData).sort();

console.log('=== Keys comparison ===');
console.log('Original keys:', origKeys);
console.log('Excel keys:   ', newKeys);
console.log('Keys match:', JSON.stringify(origKeys) === JSON.stringify(newKeys));

// Deep compare a few entries
console.log('\n=== Sample deep comparisons ===');
for (const key of ['store', 'customer', 'delivery', 'payment', 'TMSHOP-430', 'TMSHOP-447', 'TMSHOP-463']) {
  const match = JSON.stringify(original[key]) === JSON.stringify(testData[key]);
  console.log(`  ${key}: ${match ? 'MATCH' : 'MISMATCH'}`);
  if (!match) {
    console.log(`    Original: ${JSON.stringify(original[key])}`);
    console.log(`    Excel:    ${JSON.stringify(testData[key])}`);
  }
}

console.log('\n=== Full deep comparison ===');
const fullMatch = JSON.stringify(original) === JSON.stringify(testData);
console.log('Full match:', fullMatch);

if (!fullMatch) {
  for (const key of origKeys) {
    const m = JSON.stringify(original[key]) === JSON.stringify(testData[key]);
    if (!m) {
      console.log(`\nMISMATCH in "${key}":`);
      console.log('  Original:', JSON.stringify(original[key], null, 2).substring(0, 500));
      console.log('  Excel:   ', JSON.stringify(testData[key], null, 2).substring(0, 500));
    }
  }
}
