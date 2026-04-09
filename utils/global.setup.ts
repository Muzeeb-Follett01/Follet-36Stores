import { test as setup, expect } from '@playwright/test';
import { Helper } from './helper';
import testData from '../testdata/userDetails.json';


setup('login', async ({ page }, testInfo) => {

  await page.goto('/');
  await page.getByPlaceholder("Username").fill(testData.user1.username);
  await page.getByPlaceholder("Password").fill(testData.user2.password);
  await page.getByText("Login").click();

  await expect(page.getByText("Login")).not.toBeVisible();

  Helper.attachScreenshotToReport(page, "LoginSuccess", testInfo);

  //await page.context().storageState({ path: 'auth.json' });
});