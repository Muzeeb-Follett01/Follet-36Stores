import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';

const OUTPUT_DIR = path.resolve(__dirname, '../output');

// Timestamp generated once per test run (process lifetime)
const RUN_TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);

// Lazily computed and cached on first call so all specs in a run share one file
let cachedFilePath: string | null = null;

function extractStoreName(storeUrl: string): string {
  try {
    const hostname = new URL(storeUrl).hostname; // e.g. "bkstr-0125.myshopify.com" or "ntc.bkstr.com"
    const numericMatch = hostname.match(/bkstr[-.](\d+)/);
    if (numericMatch) return numericMatch[1]; // "0125"
    // Fall back: first subdomain segment (skip "www")
    const first = hostname.split('.')[0];
    return first === 'www' ? hostname.split('.')[1] : first; // "ntc"
  } catch {
    return 'store';
  }
}

function getFilePath(browser: string, storeUrl: string): string {
  if (cachedFilePath) return cachedFilePath;
  const storeName = extractStoreName(storeUrl);
  const browserName = browser.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
  const fileName = `${browserName}_${storeName}_${RUN_TIMESTAMP}.xlsx`;
  cachedFilePath = path.join(OUTPUT_DIR, fileName);
  return cachedFilePath;
}

/**
 * Append a spec result row (spec file name + order number) to the run's Excel file.
 * Creates the file with headers on the first call; appends rows on subsequent calls.
 * Filename format: {browser}_{storeName}_{timestamp}.xlsx  e.g. chromium_0125_2026-03-26_10-30-00.xlsx
 */
export async function writeOrderResult(specFileName: string, orderNumber: string, browser: string, storeUrl: string,payNowOption:string) {
  if(payNowOption=="N"){
    console.log("💳 Pay Now option is No, skipping order result write");
    return ""
  }
  
  const FILE_PATH = getFilePath(browser, storeUrl);
  const FILE_NAME = path.basename(FILE_PATH);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const workbook = new ExcelJS.Workbook();

  if (fs.existsSync(FILE_PATH)) {
    await workbook.xlsx.readFile(FILE_PATH);
  }

  let sheet = workbook.getWorksheet('OrderResults');
  if (!sheet) {
    sheet = workbook.addWorksheet('OrderResults');
    sheet.columns = [
      { header: 'Spec File', key: 'specFile', width: 40 },
      { header: 'Order Number', key: 'orderNumber', width: 25 },
      { header: 'Timestamp', key: 'timestamp', width: 25 },
    ];
    // Style the header row
    sheet.getRow(1).font = { bold: true };
  }

  sheet.addRow({
    specFile: specFileName,
    orderNumber: orderNumber,
    timestamp: new Date().toISOString(),
  });

  await workbook.xlsx.writeFile(FILE_PATH);
  console.log(`📝 Order result saved: ${specFileName} → ${orderNumber} (${FILE_NAME})`);
}
