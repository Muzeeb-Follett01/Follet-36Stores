/**
 * Migrate follettTestData.xlsx — full restructure:
 *   - Remove old product columns: product.*, product1.*, product2.*, productSearch, search-product.*, shopBy.*, products
 *   - Remove old course columns:  course.*, course1.*, course2.*
 *   - Add 3 product JSON-array columns: products, courseProducts, categoryProducts
 *   - Add 1 course JSON-array column:   courses
 *   - Add metadata columns: paymentMethod, deliveryMethod, requiresLogin
 *
 * Run:  node scripts/migrateExcel.js
 */
const ExcelJS = require('exceljs');
const path = require('path');

const SRC = path.resolve(__dirname, '../testdata/Follett/follettTestData.xlsx');
const DEST = path.resolve(__dirname, '../testdata/Follett/follettTestData_new.xlsx');

// ── Row-level migration rules ───────────────────────────────────────────────

const SEARCH_PRODUCT_SPECS = new Set([
  'TMSHOP-430', 'TMSHOP-540', 'TMSHOP-447', 'TMSHOP-376',
  'TMSHOP-387', 'TMSHOP-438', 'TMSHOP-531', 'TMSHOP-453',
  'TMSHOP-454', 'TMSHOP-458',
]);

const COURSE_PRODUCT_SPECS = new Set([
  'TMSHOP-444', 'TMSHOP-539', 'TMSHOP-461', 'TMSHOP-462',
]);

const CATEGORY_PRODUCT_SPECS = new Set([
  'TMSHOP-538', 'TMSHOP-463',
]);

// Specs that require password-gated login
const REQUIRES_LOGIN_SPECS = new Set([
  'TMSHOP-430', 'TMSHOP-540', 'TMSHOP-531', 'TMSHOP-447',
  'TMSHOP-438', 'TMSHOP-387', 'TMSHOP-376', 'TMSHOP-444',
  'TMSHOP-461', 'TMSHOP-453', 'TMSHOP-454', 'TMSHOP-458',
]);

// Payment method per spec
const PAYMENT_METHOD_MAP = {
  'TMSHOP-430': 'creditCard',
  'TMSHOP-540': 'creditCard',
  'TMSHOP-453': 'creditCard',
  'TMSHOP-454': 'creditCard',
  'TMSHOP-458': 'creditCard',
  'TMSHOP-461': 'creditCard',
  'TMSHOP-462': 'creditCard',
  'TMSHOP-463': 'creditCard',
  'TMSHOP-538': 'creditCard',
  'TMSHOP-539': 'creditCard',
  'TMSHOP-prod': 'creditCard',
  'TMSHOP-438': 'creditCard',
  'TMSHOP-376': 'financialAid',
  'TMSHOP-387': 'financialAid',
  'TMSHOP-447': 'financialAid',
  'TMSHOP-444': 'financialAid',
  'TMSHOP-531': 'campusCard+creditCard',
};

// Delivery method per spec
const DELIVERY_METHOD_MAP = {
  'TMSHOP-463': 'pickup',
  'TMSHOP-538': 'pickup',
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function buildProductObj(row, prefix) {
  const obj = {};
  const name = row[`${prefix}.name`];
  if (!name || name === '') return null;
  obj.name = String(name);
  if (row[`${prefix}.format`] && row[`${prefix}.format`] !== '') obj.format = row[`${prefix}.format`];
  if (row[`${prefix}.condition`] && row[`${prefix}.condition`] !== '') obj.condition = row[`${prefix}.condition`];
  if (row[`${prefix}.link`] && row[`${prefix}.link`] !== '') obj.link = row[`${prefix}.link`];
  return obj;
}

function buildSearchProductArr(row) {
  if (row['productSearch'] && row['productSearch'] !== '') {
    return [{ name: String(row['productSearch']) }];
  }
  const p1 = buildProductObj(row, 'product1');
  const p2 = buildProductObj(row, 'product2');
  if (p1 || p2) return [p1, p2].filter(Boolean);
  const p = buildProductObj(row, 'product');
  if (p) return [p];
  return null;
}

function buildCourseProductArr(row) {
  const p1 = buildProductObj(row, 'product1');
  const p2 = buildProductObj(row, 'product2');
  if (p1 || p2) return [p1, p2].filter(Boolean);
  const p = buildProductObj(row, 'product');
  if (p) return [p];
  return null;
}

function buildCategoryProductArr(row) {
  if (row['products'] && row['products'] !== '') {
    try {
      const arr = typeof row['products'] === 'string' ? JSON.parse(row['products']) : row['products'];
      if (Array.isArray(arr)) return arr;
    } catch { /* fall through */ }
  }
  if (row['shopBy.category'] && row['product.name']) {
    return [{ category: row['shopBy.category'], name: row['product.name'] }];
  }
  return null;
}

function buildCourseObj(row, prefix) {
  const obj = {};
  const keys = ['campus', 'term', 'division', 'department', 'course', 'section'];
  let hasData = false;
  for (const k of keys) {
    const val = row[`${prefix}.${k}`];
    if (val !== undefined && val !== null && val !== '') {
      obj[k] = String(val);
      hasData = true;
    }
  }
  return hasData ? obj : null;
}

function buildCoursesArr(row) {
  // Try numbered courses first (course1, course2)
  const c1 = buildCourseObj(row, 'course1');
  const c2 = buildCourseObj(row, 'course2');
  if (c1 || c2) return [c1, c2].filter(Boolean);
  // Single course
  const c = buildCourseObj(row, 'course');
  if (c) return [c];
  return null;
}

// Columns to remove from the old data
const REMOVE_PREFIXES = [
  'product.', 'product1.', 'product2.',
  'productSearch', 'search-product.',
  'shopBy.', 'products',
  'course.', 'course1.', 'course2.',
];

function shouldRemove(colName) {
  return REMOVE_PREFIXES.some(p =>
    p.endsWith('.') ? colName.startsWith(p) : colName === p
  );
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(SRC);
  const ws = wb.getWorksheet('TestData');
  if (!ws) { console.error('Sheet "TestData" not found'); process.exit(1); }

  // Read headers (row 1)
  const headerRow = ws.getRow(1);
  const headers = [];
  headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
    headers.push({ col: colNumber, name: cell.value?.toString() || '' });
  });

  // Read all data rows into plain objects
  const rows = [];
  for (let r = 2; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const obj = {};
    for (const h of headers) {
      const val = row.getCell(h.col).value;
      obj[h.name] = val != null ? val : '';
    }
    rows.push(obj);
  }

  // Determine new headers: keep non-removed columns, then append new ones
  const keptHeaders = headers.map(h => h.name).filter(n => !shouldRemove(n));
  const newHeaders = [
    ...keptHeaders,
    'requiresLogin', 'paymentMethod', 'deliveryMethod',
    'courses',
    'products', 'courseProducts', 'categoryProducts',
  ];

  // Build new rows
  const newRows = rows.map(row => {
    const specId = row['specId'];
    const newRow = {};

    // Copy kept columns
    for (const h of keptHeaders) {
      newRow[h] = row[h];
    }

    // ── #1: courses ──
    const courses = buildCoursesArr(row);
    newRow['courses'] = courses ? JSON.stringify(courses) : '';

    // ── #3: paymentMethod ──
    newRow['paymentMethod'] = PAYMENT_METHOD_MAP[specId] || 'creditCard';

    // ── #4: deliveryMethod ──
    newRow['deliveryMethod'] = DELIVERY_METHOD_MAP[specId] || 'ship';

    // ── #5: requiresLogin ──
    newRow['requiresLogin'] = REQUIRES_LOGIN_SPECS.has(specId) ? 'Y' : 'N';

    // ── Product columns ──
    let products = null;
    let courseProducts = null;
    let categoryProducts = null;

    if (specId === 'TMSHOP-prod') {
      const searchProd = row['search-product.name'];
      if (searchProd && searchProd !== '') {
        products = [{ name: String(searchProd) }];
      }
      courseProducts = buildCourseProductArr(row);
      categoryProducts = buildCategoryProductArr(row);
    } else if (SEARCH_PRODUCT_SPECS.has(specId)) {
      products = buildSearchProductArr(row);
    } else if (COURSE_PRODUCT_SPECS.has(specId)) {
      courseProducts = buildCourseProductArr(row);
    } else if (CATEGORY_PRODUCT_SPECS.has(specId)) {
      categoryProducts = buildCategoryProductArr(row);
    }

    newRow['products'] = products ? JSON.stringify(products) : '';
    newRow['courseProducts'] = courseProducts ? JSON.stringify(courseProducts) : '';
    newRow['categoryProducts'] = categoryProducts ? JSON.stringify(categoryProducts) : '';

    return newRow;
  });

  // Write new workbook
  const newWb = new ExcelJS.Workbook();
  const newWs = newWb.addWorksheet('TestData');

  // Header row
  const hdrRow = newWs.addRow(newHeaders);
  hdrRow.font = { bold: true };

  // Auto-width helper
  const colWidths = newHeaders.map(h => h.length);

  // Data rows
  for (const row of newRows) {
    const values = newHeaders.map(h => {
      const v = row[h];
      return v !== undefined && v !== null ? v : '';
    });
    newWs.addRow(values);
    values.forEach((v, i) => {
      const len = String(v).length;
      if (len > colWidths[i]) colWidths[i] = Math.min(len, 80);
    });
  }

  // Set column widths
  newHeaders.forEach((_, i) => {
    newWs.getColumn(i + 1).width = colWidths[i] + 2;
  });

  await newWb.xlsx.writeFile(DEST);
  console.log(`✅ New Excel written to: ${DEST}`);
  console.log(`   Rows: ${newRows.length}`);
  console.log(`   New columns: courses, products, courseProducts, categoryProducts, requiresLogin, paymentMethod, deliveryMethod`);
  const removed = headers.map(h => h.name).filter(shouldRemove);
  console.log(`   Removed columns: ${removed.join(', ')}`);
}

main().catch(err => { console.error(err); process.exit(1); });
