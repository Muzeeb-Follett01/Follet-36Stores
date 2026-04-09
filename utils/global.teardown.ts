import { test as close, expect } from '@playwright/test';
import { Helper } from './helper';

close('logout', async ({ page }, testInfo) => {
  
  await page.goto('/v1/index.html');
  await page.getByRole("button",{name: "Open Menu"}).click();
  await page.getByText("Logout").click();
  await expect(page.getByText("Login")).toBeVisible();
  await Helper.attachScreenshotToReport(page, "Logout", testInfo);

});