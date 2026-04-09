import { test, expect } from "../../utils/fixtures";
import { FollettLoginPage } from "../../pages/Follett/LoginPage";
import { FollettCourseBuilderPage } from "../../pages/Follett/CourseBuilderPage";
import { FollettProductPage } from "../../pages/Follett/ProductPage";
import { FollettCheckoutPage } from "../../pages/Follett/CheckoutPage";
import { YopmailPage } from "../../pages/Follett/yopmailPage";
import testData, { isEnabled } from "../../utils/excelToTestData";
import { writeOrderResult } from "../../utils/writeOrderResult";

// ── Typed references to test data ────────────────────────────────────────────
const td = testData["TMSHOP-460"];
const storeUrl = td.store.url;
const password = td.store.password;
const courses = td.courses; // one course per textbook (each with its own term)
const products = td.courseProducts; // textbook products array
const requiresLogin = td.store.requiresLogin;
const email = td.customer.email;
const delivery = td.delivery;
const payment = td.payment;
const signedInUser = td.sign;
const payNowOption = td.payNowOption;

// ── Test Suite ────────────────────────────────────────────────────────────────
test.describe("TMSHOP-460: E2E026 | FMS SUPERSITE- Basic Flow", () => {
  test.skip(!isEnabled("TMSHOP-460"), "Skipped via Excel execute flag");

  /**
   * End-to-end test (TMSHOP-460):
   *  1.  Navigate to ntc.bkstr.com & login
   *  2.  Click Textbooks
   *  3.  Fill course 1 → ADD COURSE
   *  4–N. For each textbook in courseProducts: select format/condition → add to cart
   *  N+1. Proceed to Shopify checkout
   *  N+2. Fill email
   *  N+3. Fill delivery details
   *  N+4. Fill card details
   *  N+5. Complete Order
   */
  test("E2E026 | FMS SUPERSITE- Basic Flow", async ({ page }, testInfo) => {
    const loginPage = new FollettLoginPage(page, "TMSHOP-460");
    const courseBuilder = new FollettCourseBuilderPage(page, "TMSHOP-460");
    const productPage = new FollettProductPage(page, "TMSHOP-460");
    const checkoutPage = new FollettCheckoutPage(page, "TMSHOP-460");

    // Pick email config based on browser project
    const browserName = testInfo.project.name.toLowerCase();
    const emailConfig = browserName.includes("edge")
      ? td.customer.email1
      : td.customer.email;

    // ── Step 1: Navigate to NTC store ────────────────────────────────────
    console.log("🌐 Step 1: Navigating to NTC Bookstore");
    // await page.goto(storeUrl);

    // ── Step 1: Navigate & login ───────────────────────────────────────────────
    await loginPage.login(storeUrl, password, requiresLogin, testInfo);

    console.log("✅ Step 1: Store login successful");

    //console.log("✅ Step 1: Store loaded");

    // ── Step 2: Click Textbooks ───────────────────────────────────────────
    console.log("📚 Step 2: Clicking Textbooks");
    await courseBuilder.clickTextbooks(testInfo);

    // ── Steps 3–N: Fill each course & ADD COURSE ─────────────────────────
    // First course uses fillProdCourseDetails (selects term),
    // subsequent courses use fillProdCourseDetailsWithoutTerm (term already set).
    let step = 2;
    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      step++;
      if (i === 0) {
        console.log(
          `🎓 Step ${step}: Filling course ${i + 1} – Term: ${course.term} / ${course.department} / ${course.course} / Sec ${course.section}`,
        );
        await courseBuilder.fillProdCourseDetails(course, testInfo);
      } else {
        console.log(
          `🎓 Step ${step}: Filling course ${i + 1} – ${course.department} / ${course.course} / Sec ${course.section} (same term)`,
        );
        await courseBuilder.fillProdCourseDetailsWithoutTerm(course, testInfo);
      }
      console.log(`✅ Step ${step}: Course ${i + 1} details filled`);

      step++;
      console.log(`➕ Step ${step}: Adding course ${i + 1}`);
      await courseBuilder.clickAddCourse(testInfo);
      console.log(
        `✅ Step ${step}: Course ${i + 1} added – ${course.department} | ${course.course} | Sec ${course.section}`,
      );
    }

    // ── Select each textbook and add to cart ───────────────────────────────
    for (let i = 0; i < products.length; i++) {
      step++;
      const product = products[i];

      console.log(
        `📖 Step ${step}: Selecting "${product.name}" – ${product.format} / ${product.condition}`,
      );
      await productPage.selectFormatByProduct(
        product.name,
        product.format,
        product.condition,
        testInfo,
      );

      // console.log(`🛒 Adding product ${i + 1} to cart`);

      // console.log(`✅ Step ${step}: "${product.name}" added to cart`);
    }
    await productPage.addToCart(testInfo);
    // ── Proceed to checkout ────────────────────────────────────────────────
    step++;
    console.log(`💳 Step ${step}: Clicking Check out`);
    await productPage.clickCheckout(testInfo);
    console.log(`✅ Step ${step}: Redirected to Shopify checkout`);

    // ── Fill contact email ─────────────────────────────────────────────────
    step++;
    console.log(`📧 Step ${step}: Filling email – ${email.address ?? email}`);
    await checkoutPage.fillEmail(emailConfig, signedInUser);
    console.log(`✅ Step ${step}: Email filled`);

    // ── Fill delivery details ──────────────────────────────────────────────
    step++;
    console.log(`📦 Step ${step}: Filling delivery details`);
    await checkoutPage.fillDeliveryDetails(delivery, testInfo);
    console.log(`✅ Step ${step}: Delivery details filled`);

    // ── Fill card details ──────────────────────────────────────────────────
    step++;
    console.log(`💳 Step ${step}: Filling card details`);
    await checkoutPage.fillCardDetails(payment, testInfo);
    console.log(`✅ Step ${step}: Card details filled`);

    // ── Complete Order ─────────────────────────────────────────────────────
    step++;
    console.log(`🎯 Step ${step}: Clicking Pay now / Complete Order`);
    const orderNumber = await checkoutPage.completeOrder(
      testInfo,
      td.confirmMessage,
      payNowOption,
    );
    await writeOrderResult(
      "TMSHOP-460",
      orderNumber,
      testInfo.project.name,
      storeUrl,
      payNowOption,
    );
  });
});
