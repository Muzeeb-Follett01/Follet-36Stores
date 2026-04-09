import { test, expect } from "../../utils/fixtures";
import { FollettLoginPage } from "../../pages/Follett/LoginPage";
import { FollettProductPage } from "../../pages/Follett/ProductPage";
import { FollettCheckoutPage } from "../../pages/Follett/CheckoutPage";
import testData, { isEnabled } from "../../utils/excelToTestData";
import { writeOrderResult } from "../../utils/writeOrderResult";

// ── Test Data ─────────────────────────────────────────────────────────────────
const td = testData["TMSHOP-454"];
const storeUrl = td.store.url;
const password = td.store.password;
const requiresLogin = td.store.requiresLogin;
const email = td.customer.email;
const product = td.products?.[0] ?? td.product;
const delivery = td.delivery;
const payment = td.payment;
const signedInUser = td.sign;
const payNowOption = td.payNowOption;

// ── Test Suite ────────────────────────────────────────────────────────────────
test.describe("TMSHOP-454: E2E015 | FMS Standalone - User Account (Rental)", () => {
  test.skip(!isEnabled("TMSHOP-454"), "Skipped via Excel execute flag");

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
  test("E2E015 | FMS Standalone - User Account (Rental)", async ({
    page,
  }, testInfo) => {
    const loginPage = new FollettLoginPage(page, "TMSHOP-454");
    const productPage = new FollettProductPage(page, "TMSHOP-454");
    const checkoutPage = new FollettCheckoutPage(page, "TMSHOP-454");

    // Pick email config based on browser project
    const browserName = testInfo.project.name.toLowerCase();
    const emailConfig = browserName.includes("edge")
      ? td.customer.email1
      : td.customer.email;

    // ── Step 1: Navigate to NTC store and handle password gate ───────────────
    await loginPage.login(storeUrl, password, requiresLogin, testInfo);

    // ── Step 2: Search for product and select from suggestions ────────────────
    console.log(`🔍 Step 2: Searching for "${product.name}"`);
    await productPage.searchAndSelectProduct(product.name, testInfo);

    // ── Step 3: Select Digital format and Rent condition ──────────────────────
    console.log(
      `🖱️  Step 3: Selecting format: ${product.format} / condition: ${product.condition}`,
    );
    await productPage.selectFormat(product.format, product.condition, testInfo);

    // ── Step 4: Add to cart ────────────────────────────────────────────────────
    console.log("🛒 Step 4: Adding item to cart");
    await productPage.addToCart(testInfo);

    // ── Step 5: Proceed to checkout ────────────────────────────────────────────
    console.log("💳 Step 5: Clicking Check out");
    await productPage.clickCheckout(testInfo);

    // ── Step 6: Fill contact email ─────────────────────────────────────────────
    console.log(`📧 Step 6: Filling email – ${email.address ?? email}`);
    await checkoutPage.fillEmail(emailConfig, signedInUser);

    // ── Step 7: Fill delivery / shipping details ───────────────────────────────
    console.log("📦 Step 7: Filling delivery details");
    await checkoutPage.fillDeliveryDetails(delivery, testInfo);

    // ── Step 8: Fill credit card details ───────────────────────────────────────
    console.log("💳 Step 8: Filling card details");
    await checkoutPage.fillCardDetails(payment, testInfo);

    // // ── Step 9: Click Complete Order ─────────────────────────────────────────
    // console.log("🎯 Step 9: Clicking Complete Order");
    // const orderNumber = await checkoutPage.completeOrder(
    //   testInfo,
    //   td.confirmMessage,
    //   payNowOption,
    // );
    // await writeOrderResult(
    //   "TMSHOP-454",
    //   orderNumber,
    //   testInfo.project.name,
    //   storeUrl,
    //   payNowOption,
    // );
  });
});
