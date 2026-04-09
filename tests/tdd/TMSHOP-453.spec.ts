import { test, expect } from "../../utils/fixtures";
import { FollettLoginPage } from "../../pages/Follett/LoginPage";
import { FollettProductPage } from "../../pages/Follett/ProductPage";
import { FollettCheckoutPage } from "../../pages/Follett/CheckoutPage";
import testData, { isEnabled } from "../../utils/excelToTestData";
import { writeOrderResult } from "../../utils/writeOrderResult";

// ── Test Data ─────────────────────────────────────────────────────────────────
const td = testData["TMSHOP-453"];
const storeUrl = td.store.url;
const password = td.store.password;
const requiresLogin = td.store.requiresLogin;
const products = td.products;
const delivery = td.delivery;
const payment = td.payment;
const signedInUser = td.sign;
const payNowOption = td.payNowOption;

// ── Test Suite ────────────────────────────────────────────────────────────────
test.describe("TMSHOP-453: E2E018 | FMS Standalone - Checkout / Delivery Ship", () => {
  test.skip(!isEnabled("TMSHOP-453"), "Skipped via Excel execute flag");

  /**
   * End-to-end test that:
   *  1.  Navigates to ntc.bkstr.com and enters the store password
   *  2.  Searches for "Medical Office Administration" and selects from suggestions
   *  3.  Selects Digital format and checks the Rent checkbox
   *  4.  Adds item to cart
   *  5.  Proceeds to Shopify checkout
   *  6.  Fills email, delivery details, card details
   *  7.  Selects billing = same as shipping
   *  8.  Clicks Complete Order
   */
  test("E2E018 | FMS Standalone - Checkout / Delivery Ship", async ({
    page,
  }, testInfo) => {
    const loginPage = new FollettLoginPage(page, "TMSHOP-453");
    const productPage = new FollettProductPage(page, "TMSHOP-453");
    const checkoutPage = new FollettCheckoutPage(page, "TMSHOP-453");

    // Pick email config based on browser project
    const browserName = testInfo.project.name.toLowerCase();
    const emailConfig = browserName.includes("edge")
      ? td.customer.email1
      : td.customer.email;

    // ── Step 1: Navigate to NTC store and handle password gate ───────────────
    await loginPage.login(storeUrl, password, requiresLogin, testInfo);

    // ── Steps 2–9: Loop through 4 products ──────────────────────────────
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      const step = 2 + i * 2;

      console.log(`🔍 Step ${step}: Searching for "${p.name}"`);
      await productPage.searchAndSelectProduct(p.name, testInfo);

      if (p.format) {
        console.log(
          `🖱️  Step ${step + 1}: Selecting format: ${p.format} / condition: ${p.condition}`,
        );
        await productPage.selectFormat(p.format, p.condition, testInfo);
      }

      console.log(`🛒 Adding "${p.name}" to cart`);
      await productPage.addToCart(testInfo);
      console.log(`✅ "${p.name}" added to cart`);

      // Navigate back to store for next product (skip after last)
      if (i < products.length - 1) {
        await loginPage.navigate(storeUrl);
      }
    }
    // ── Step 5: Proceed to checkout ────────────────────────────────────────────
    console.log("💳 Step 5: Clicking Check out");
    await productPage.clickCheckout(testInfo);

    // ── Step 6: Fill contact email ─────────────────────────────────────────────
    console.log(`📧 Step 6: Filling email – ${emailConfig.address}`);
    await checkoutPage.fillEmail(emailConfig, signedInUser);

    // ── Step 7: Fill delivery / shipping details ───────────────────────────────
    console.log("📦 Step 7: Filling delivery details");
    await checkoutPage.fillDeliveryDetails(delivery, testInfo);

    // ── Step 8: Fill credit card details ───────────────────────────────────────
    console.log("💳 Step 8: Filling card details");
    await checkoutPage.fillCardDetails(payment, testInfo);

    // ── Step 9: Click Complete Order ─────────────────────────────────────────
    console.log("🎯 Step 9: Clicking Complete Order");
    const orderNumber = await checkoutPage.completeOrder(
      testInfo,
      td.confirmMessage,
      payNowOption,
    );
    await writeOrderResult(
      "TMSHOP-453",
      orderNumber,
      testInfo.project.name,
      storeUrl,
      payNowOption,
    );
  });
});
