// helpers/sap-utils.ts
import { type Page } from '@playwright/test';

export async function getCurrentDate(): Promise<string> {
  const today = new Date();
  return `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;
}

export async function generatePONumber(): Promise<string> {
  return `Test_PO_${Math.random().toString(36).substring(7)}`;
}

export async function waitForSAPResponse(page: Page, urlPattern: string): Promise<void> {
  await page.waitForResponse(response => response.url().includes(urlPattern) && response.status() === 200);
}