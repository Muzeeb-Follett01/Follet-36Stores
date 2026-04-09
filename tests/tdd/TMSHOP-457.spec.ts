import { test, expect } from "../../utils/fixtures";
import { FollettLoginPage } from "../../pages/Follett/LoginPage";
import { FollettHomePage } from "../../pages/Follett/HomePage";
import { Helper } from "../../utils/helper";
import testData, { isEnabled } from "../../utils/excelToTestData";

// ── Test Data ─────────────────────────────────────────────────────────────────
const td = testData["TMSHOP-454"];
const storeUrl = td.store.url;
const password = td.store.password;
const requiresLogin = td.store.requiresLogin;
const payNowOption = td.payNowOption;

// ── Test Suite ────────────────────────────────────────────────────────────────
test.describe("TMSHOP-457: E2E004 | FMS Standalone - Taxonomy Static links", () => {
  test.skip(!isEnabled("TMSHOP-457"), "Skipped via Excel execute flag");

  test("E2E004 | FMS Standalone - Taxonomy Static links", async ({
    page,
  }, testInfo) => {
    const loginPage = new FollettLoginPage(page, "TMSHOP-457");
    const homePage = new FollettHomePage(page, "TMSHOP-457");

    // ── Step 1: Navigate to store and handle password gate ──────────────────
    await loginPage.login(storeUrl, password, requiresLogin, testInfo);

    // ── Step 2: Verify all header links ───────────────────────────────────
    console.log("🔗 Step 2: Verifying header links");
    await homePage.verifyAllHeaderLinks(storeUrl, testInfo);
    console.log("✅ Step 2: All header links verified");

    // ── Step 3: Verify all footer links ───────────────────────────────────
    console.log("🔗 Step 3: Verifying footer links");
    await homePage.verifyAllFooterLinks(storeUrl, testInfo);
    console.log("✅ Step 3: All footer links verified");

    // ── Step 5: Verify terms & conditions links ───────────────────────────
    console.log("📜 Step 5: Verifying terms and conditions links");
    await homePage.verifyTermsAndConditionsLinks(testInfo);
    console.log("✅ Step 5: All terms and conditions links verified");

    // ── Step 6: Verify user is on the store homepage ──────────────────────
    console.log("🏠 Step 6: Verifying user is on the homepage");
    await page.goto(storeUrl);
    await page.waitForLoadState("domcontentloaded");
    await homePage.verifyOnHomepage();
    console.log("✅ Step 6: User is on the store homepage");

    // ── Final Screenshot ──────────────────────────────────────────────────
    await Helper.attachScreenshotToReport(
      page,
      "TMSHOP-457_Complete",
      testInfo,
    );
    console.log("✅ TMSHOP-457: All verifications passed");
  });
});
