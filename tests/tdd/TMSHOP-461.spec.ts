import { test, expect } from "../../utils/fixtures";
import { FollettLoginPage } from "../../pages/Follett/LoginPage";
import { FollettCourseBuilderPage } from "../../pages/Follett/CourseBuilderPage";
import { FollettProductPage } from "../../pages/Follett/ProductPage";
import { FollettCheckoutPage } from "../../pages/Follett/CheckoutPage";
import testData, { isEnabled } from "../../utils/excelToTestData";
import { writeOrderResult } from "../../utils/writeOrderResult";

// ── Typed references to test data ────────────────────────────────────────────
const td = testData["TMSHOP-461"];
const storeUrl = td.store.url;
const password = td.store.password;
const requiresLogin = td.store.requiresLogin;
const course1 = td.courses[0];
const product1 = td.courseProducts[0];
const email = td.customer.email;
const delivery = td.delivery;
const payment = td.payment;
const signedInUser = td.sign;
const payNowOption = td.payNowOption;

// ── Test Suite ────────────────────────────────────────────────────────────────
test.describe("TMSHOP-461: E2E002 | FVC Standalone - Basic Flow", () => {
  test.skip(!isEnabled("TMSHOP-461"), "Skipped via Excel execute flag");

  /**
   * End-to-end test (TMSHOP-461):
   *  1.  Navigate to ntc.bkstr.com
   *  2.  Click Textbooks
   *  3.  Fill course 1 (Summer 2026 / ADMM / 1120 / Sec 90) → ADD COURSE
   *  4.  Fill course 2 (Summer 2026 / ADMM / 1125 / Sec 90) → ADD COURSE
   *  5.  Find "Medical Office Administration" → Print / Buy Used → Add to cart
   *  6.  Dismiss mini-cart → find "Basics of the U. S. Health Care System" → Digital / Buy → Add to cart
   *  7.  Proceed to Shopify checkout
   *  8.  Fill email, delivery details, card details
   *  9.  Confirm billing = shipping → Complete Order
   *  10. Navigate to yopmail and verify order confirmation email
   */
  test("E2E002 | FVC Standalone - Basic Flow", async ({ page }, testInfo) => {
    const loginPage = new FollettLoginPage(page, "TMSHOP-461");
    const courseBuilder = new FollettCourseBuilderPage(page, "TMSHOP-461");
    const productPage = new FollettProductPage(page, "TMSHOP-461");
    const checkoutPage = new FollettCheckoutPage(page, "TMSHOP-461");

    // Pick email config based on browser project
    const browserName = testInfo.project.name.toLowerCase();
    const emailConfig = browserName.includes("edge")
      ? td.customer.email1
      : td.customer.email;

    // ── Step 1: Navigate to store and handle password gate ───────────────
    await loginPage.login(storeUrl, password, requiresLogin, testInfo);

    // ── Step 2: Click Textbooks ───────────────────────────────────────────
    console.log("📚 Step 2: Clicking Textbooks");
    await courseBuilder.clickTextbooks(testInfo);

    // ── Step 3: Fill course 1 (ADMM 1120) ────────────────────────────────
    console.log(
      `🎓 Step 3: Filling course 1 – ${course1.department} / ${course1.course} / Sec ${course1.section}`,
    );
    await courseBuilder.fillProdCourseDetails(course1, testInfo);
    console.log("✅ Step 3: Course 1 details filled");

    // ── Step 4: ADD COURSE 1 ──────────────────────────────────────────────
    console.log("➕ Step 4: Adding course 1");
    await courseBuilder.clickAddCourse(testInfo);
    console.log(
      `✅ Step 4: Course 1 added – ${course1.department} | ${course1.course} | Sec ${course1.section}`,
    );

    // ── Step 7: Navigate to product 1 and select format/condition ────────────────
    console.log(
      `📖 Step 7: Selecting "${product1.name}" – ${product1.format} / ${product1.condition}`,
    );
    await productPage.selectFormatByProduct(
      product1.name,
      product1.format,
      product1.condition,
      testInfo,
    );

    console.log("🛒 Step 8: Adding product 2 to cart");
    await productPage.addToCart(testInfo);
    console.log(`✅ Step 8: "${product1.name}" added to cart`);

    // ── Step 9: Proceed to checkout ───────────────────────────────────────
    console.log("💳 Step 9: Clicking Check out");
    await productPage.clickCheckout(testInfo);
    console.log("✅ Step 9: Redirected to Shopify checkout");

    // ── Step 10: Fill contact email ───────────────────────────────────────
    console.log(`📧 Step 10: Filling email – ${email.address ?? email}`);
    await checkoutPage.fillEmail(emailConfig, signedInUser);
    console.log("✅ Step 10: Email filled");

    console.log(`📦 Step 11: Filling delivery details`);
    await checkoutPage.fillDeliveryDetails(delivery, testInfo);
    console.log(`✅ Step 11: Delivery details filled`);

    // ── Step 12: Fill card details ────────────────────────────────────────
    console.log("💳 Step 12: Filling card details");
    await checkoutPage.fillCardDetails(payment, testInfo);
    console.log("✅ Step 12: Card details filled");

    // ── Step 12 : Confirm billing = same as shipping ───────────────────────
    // console.log("✅ Step 12: Confirming billing address same as shipping");
    // await checkoutPage.selectBillingAsSameAsShipping();
    // console.log("✅ Step 12: Billing confirmed");

    // ── Step 13: Complete Order ───────────────────────────────────────────
    console.log("🎯 Step 13: Clicking Pay now / Complete Order");
    const orderNumber = await checkoutPage.completeOrder(
      testInfo,
      td.confirmMessage,
      payNowOption,
    );
    await writeOrderResult(
      "TMSHOP-461",
      orderNumber,
      testInfo.project.name,
      storeUrl,
      payNowOption,
    );
  });
});
