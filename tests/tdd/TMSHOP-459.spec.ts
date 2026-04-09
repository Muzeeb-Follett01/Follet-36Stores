import { test, expect } from "../../utils/fixtures";
import { FollettLoginPage } from "../../pages/Follett/LoginPage";
import { FollettCourseBuilderPage } from "../../pages/Follett/CourseBuilderPage";
import { FollettProductPage } from "../../pages/Follett/ProductPage";
import { FollettCheckoutPage } from "../../pages/Follett/CheckoutPage";
import testData, { isEnabled } from "../../utils/excelToTestData";
import { writeOrderResult } from "../../utils/writeOrderResult";

// ── Test Data ─────────────────────────────────────────────────────────────────
const td = testData["TMSHOP-459"];
const storeUrl = td.store.url;
const password = td.store.password;
const requiresLogin = td.store.requiresLogin;
const email = td.customer.email;
const products = (Array.isArray(td.products) ? td.products : []).filter((p: any) => p.name); // search-based products
const courses = (Array.isArray(td.courses) ? td.courses : []); // course entries for textbook flow
const courseProducts = (Array.isArray(td.courseProducts) ? td.courseProducts : []); // textbook products (paired with courses)
const categoryProducts = (Array.isArray(td.categoryProducts) ? td.categoryProducts : []).filter((p: any) => p.name || p.category); // Shop-By category products
const delivery = td.delivery;
const payment = td.payment;
const studentId = td.studentId;
const signedInUser = td.sign;
const payNowOption = td.payNowOption;

// ── Test Suite ────────────────────────────────────────────────────────────────
test.describe("TMSHOP-459: E2E001 | FMS Standalone - Basic Flow, Course Material", () => {
  test.skip(!isEnabled("TMSHOP-459"), "Skipped via Excel execute flag");

  test("E2E001 | FMS Standalone - Basic Flow, Course Material", async ({
    page,
  }, testInfo) => {
    const loginPage = new FollettLoginPage(page, "TMSHOP-459");
    const courseBuilder = new FollettCourseBuilderPage(page, "TMSHOP-459");
    const productPage = new FollettProductPage(page, "TMSHOP-459");
    const checkoutPage = new FollettCheckoutPage(page, "TMSHOP-459");

    // Pick email config based on browser project
    const browserName = testInfo.project.name.toLowerCase();
    const emailConfig = browserName.includes("edge")
      ? td.customer.email1
      : td.customer.email;

    let step = 1;

    // ── Step 1: Navigate to store and handle password gate ───────────────
    await loginPage.login(storeUrl, password, requiresLogin, testInfo);

    // ── Regular products: search-based flow ──────────────────────────────
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      step++;

      console.log(`🔍 Step ${step}: Searching for "${p.name}"`);
      await productPage.searchAndSelectProduct(p.name, testInfo);

      if (p.format) {
        console.log(
          `🖱️  Selecting format: ${p.format} / condition: ${p.condition}`,
        );
        await productPage.selectFormat(p.format, p.condition, testInfo);
      }

      console.log(`🛒 Adding "${p.name}" to cart`);
      await productPage.addToCart(testInfo);
      console.log(`✅ Step ${step}: "${p.name}" added to cart`);

      // Navigate back to store for next item (skip after last)
      if (i < products.length - 1 || categoryProducts.length > 0) {
        await loginPage.navigate(storeUrl);
      }
    }

    // ── Textbooks: course-builder flow ───────────────────────────────────
    if (courses.length > 0) {
      step++;
      console.log(`📚 Step ${step}: Clicking Textbooks`);
      await courseBuilder.clickTextbooks(testInfo);

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
          await courseBuilder.fillProdCourseDetailsWithoutTerm(
            course,
            testInfo,
          );
        }
        console.log(`✅ Step ${step}: Course ${i + 1} details filled`);

        step++;
        console.log(`➕ Step ${step}: Adding course ${i + 1}`);
        await courseBuilder.clickAddCourse(testInfo);
        console.log(`✅ Step ${step}: Course ${i + 1} added`);
      }

      for (let i = 0; i < courseProducts.length; i++) {
        step++;
        const product = courseProducts[i];
        console.log(
          `📖 Step ${step}: Selecting textbook "${product.name}" – ${product.format} / ${product.condition}`,
        );
        await productPage.selectFormatByProduct(
          product.name,
          product.format,
          product.condition,
          testInfo,
        );
      }

      if (courseProducts.length > 0) {
        step++;
        console.log(`🛒 Step ${step}: Adding textbook(s) to cart`);
        await productPage.addToCart(testInfo);
        console.log(`✅ Step ${step}: Textbook(s) added to cart`);
        // Return to store home for subsequent sections
        if (products.length > 0 || categoryProducts.length > 0) {
          await loginPage.navigate(storeUrl);
        }
      }
    }

    // ── Category products: Shop By browse flow ────────────────────────────
    for (let i = 0; i < categoryProducts.length; i++) {
      const product = categoryProducts[i];
      step++;

      console.log(`🛍️  Step ${step}: Shop By → ${product.category}`);
      await productPage.navigateShopBy(product.category, testInfo);

      console.log(`🛒 Selecting product – ${product.name}`);
      await productPage.selectProductFromCategory(product.name, testInfo);

      console.log(`🛒 Adding "${product.name}" to cart`);
      await productPage.addToCart(testInfo);
      console.log(`✅ Step ${step}: "${product.name}" added to cart`);

      // Return to store home for next product (skip after last)
      if (i < categoryProducts.length - 1) {
        await page.goto(storeUrl);
      }
    }

    // ── Proceed to checkout ──────────────────────────────────────────────
    step++;
    console.log(`💳 Step ${step}: Clicking Check out`);
    await productPage.clickCheckout(testInfo);

    // ── Fill contact email ───────────────────────────────────────────────
    step++;
    console.log(`📧 Step ${step}: Filling email – ${email.address ?? email}`);
    await checkoutPage.fillEmail(emailConfig, signedInUser);

    // ── Fill delivery / shipping details ─────────────────────────────────
    step++;
    console.log(`📦 Step ${step}: Filling delivery details`);
    await checkoutPage.fillDeliveryDetails(delivery, testInfo);

    // ── Fill credit card details ─────────────────────────────────────────
    step++;
    console.log(`💳 Step ${step}: Filling card details`);
    await checkoutPage.fillCardDetails(payment, testInfo);

    // ── Click Complete Order ─────────────────────────────────────────────
    step++;
    console.log(`🎯 Step ${step}: Clicking Complete Order`);
    const orderNumber = await checkoutPage.completeOrder(
      testInfo,
      td.confirmMessage,
      payNowOption,
    );
    await writeOrderResult(
      "TMSHOP-459",
      orderNumber,
      testInfo.project.name,
      storeUrl,
      payNowOption,
    );
  });
});
