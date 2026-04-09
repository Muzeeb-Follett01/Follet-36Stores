import { test, expect } from "../../utils/fixtures";
import { FollettLoginPage } from "../../pages/Follett/LoginPage";
import { FollettProductPage } from "../../pages/Follett/ProductPage";
import { FollettCheckoutPage } from "../../pages/Follett/CheckoutPage";
import testData, { isEnabled } from "../../utils/excelToTestData";
import { writeOrderResult } from "../../utils/writeOrderResult";

// ── Test Data ─────────────────────────────────────────────────────────────────
const td = testData["TMSHOP-463"];
const storeUrl = td.store.url;
const password = td.store.password;
const requiresLogin = td.store.requiresLogin;
const email = td.customer.email;
const products = td.categoryProducts; // category browse products array
const payment = td.payment;
const delivery = td.delivery;
const signedInUser = td.sign;
const payNowOption = td.payNowOption;

// ── Test Suite ────────────────────────────────────────────────────────────────
test.describe("TMSHOP-463:  FMS Standalone - Basic Flow, GM items", () => {
  test.skip(!isEnabled("TMSHOP-463"), "Skipped via Excel execute flag");

  /**
   * End-to-end test (TMSHOP-463) that:
   *  1.  Navigates to ntc.bkstr.com (live store – no password gate)
   *  2–N. For each product in categoryProducts: Shop By → category → add to cart
   *  N+1. Proceeds to Shopify checkout
   *  N+2. Fills contact email
   *  N+3. Selects "Pick up" delivery (NTC store auto-selected, Free rate)
   *  N+4. Fills credit card details (common testData.payment)
   *  N+5. Fills delivery / billing details (common testData.delivery)
   *  N+6. Clicks "Pay now" / Complete Order
   *
   * POM methods used:
   *   - FollettProductPage.navigateShopBy(category)
   *   - FollettProductPage.selectProductFromCategory(name)
   *   - FollettProductPage.addToCart()
   *   - FollettProductPage.clickCheckout()
   *   - FollettCheckoutPage.fillEmail(email)
   *   - FollettCheckoutPage.selectPickupOption()
   *   - FollettCheckoutPage.fillCardDetails(payment)      shared testData.payment
   *   - FollettCheckoutPage.fillDeliveryDetails(delivery) shared testData.delivery
   *   - FollettCheckoutPage.completeOrder()
   */
  test("FMS Standalone - Basic Flow, GM items", async ({ page }, testInfo) => {
    const loginPage = new FollettLoginPage(page, "TMSHOP-463");
    const productPage = new FollettProductPage(page, "TMSHOP-463");
    const checkoutPage = new FollettCheckoutPage(page, "TMSHOP-463");

    // Pick email config based on browser project
    const browserName = testInfo.project.name.toLowerCase();
    const emailConfig = browserName.includes("edge")
      ? td.customer.email1
      : td.customer.email;

    // ── Step 1: Navigate to store and handle password gate ────────────────
    let step = 1;
    await loginPage.login(storeUrl, password, requiresLogin, testInfo);

    // ── Steps 2–N+1: Add each product from category browse ────────────────
    for (let i = 0; i < products.length; i++) {
      step++;
      const product = products[i];

      console.log(`🛍️  Step ${step}: Shop By → ${product.category}`);
      await productPage.navigateShopBy(product.category, testInfo);

      console.log(`🛒 Selecting product – ${product.name}`);
      await productPage.selectProductFromCategory(product.name, testInfo);

      console.log("🛒 Adding to cart");
      await productPage.addToCart(testInfo);
      console.log(`✅ Step ${step}: "${product.name}" added to cart`);

      // Return to homepage for next product (skip after last product)
      if (i < products.length - 1) {
        await page.goto(storeUrl);
      }
    }

    // ── Proceed to checkout ────────────────────────────────────────────────
    step++;
    console.log(`💳 Step ${step}: Clicking Check out`);
    await productPage.clickCheckout(testInfo);

    // ── Fill contact email ─────────────────────────────────────────────────
    step++;
    console.log(`📧 Step ${step}: Filling email – ${email.address ?? email}`);
    await checkoutPage.fillEmail(emailConfig, signedInUser);
    console.log(`✅ Step ${step}: Email filled`);

    // ── Select Pickup delivery + verify Free rate ──────────────────────────
    step++;
    console.log(`📦 Step ${step}: Selecting Pick up delivery`);
    await checkoutPage.selectPickupOption(testInfo);
    console.log(
      `✅ Step ${step}: Pick up selected – NTC store (Free) confirmed`,
    );

    // ── Fill credit card details ───────────────────────────────────────────
    step++;
    console.log(`💳 Step ${step}: Filling card details`);
    await checkoutPage.fillCardDetails(payment, testInfo);
    console.log(`✅ Step ${step}: Card details filled`);

    // ── Fill delivery / billing details ────────────────────────────────────
    step++;
    console.log(`🏠 Step ${step}: Filling delivery/billing details`);
    await checkoutPage.fillDeliveryDetails(delivery, testInfo);
    console.log(`✅ Step ${step}: Delivery/billing details filled`);

    // // ── Click Complete Order ────────────────────────────────────────────────
    // step++;
    // console.log(`🎯 Step ${step}: Clicking Complete Order / Pay now`);
    // const orderNumber = await checkoutPage.completeOrder(
    //   testInfo,
    //   td.confirmMessage,
    //   payNowOption,
    // );
    // await writeOrderResult(
    //   "TMSHOP-463",
    //   orderNumber,
    //   testInfo.project.name,
    //   storeUrl,
    //   payNowOption,
    // );
  });
});
