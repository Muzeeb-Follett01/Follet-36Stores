import { test, expect } from "../../utils/fixtures";
import { FollettLoginPage } from "../../pages/Follett/LoginPage";
import { FollettHomePage } from "../../pages/Follett/HomePage";
import testData, { isEnabled } from "../../utils/excelToTestData";

const td = testData["TMSHOP-455"];
const storeUrl = td.store.url;
const password = td.store.password;
const requiresLogin = td.store.requiresLogin;
const payNowOption = td.payNowOption;

test.describe("TMSHOP-455: E2E005 | FMS Standalone - Header and Footer links", () => {
  test.skip(!isEnabled("TMSHOP-455"), "Skipped via Excel execute flag");

  test("E2E005 | FMS Standalone - Header and Footer links", async ({
    page,
  }, testInfo) => {
    // Step 1: Navigate to store and handle password gate
    const loginPage = new FollettLoginPage(page, "TMSHOP-455");
    await loginPage.login(storeUrl, password, requiresLogin, testInfo);
    // Step 2: Verify homepage loaded
    const homePage = new FollettHomePage(page, "TMSHOP-455");
    await homePage.verifyOnHomepage();

    // Step 3: Verify all 10 Shop By taxonomy links
    await homePage.verifyAllShopByTaxonomyLinks(storeUrl, testInfo);

    // Step 4: Verify all 6 header navigation links
    await homePage.verifyAllHeaderLinks(storeUrl, testInfo);

    // Step 5: Verify back on homepage
    await homePage.verifyOnHomepage();
  });
});
