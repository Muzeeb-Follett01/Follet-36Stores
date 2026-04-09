import { Page, Locator } from "playwright";
import { expect, TestInfo } from "playwright/test";
import { Helper } from "../../utils/helper";
import { BasePage } from "../basePage";
import testData from "../../utils/excelToTestData";

/**
 * Follett Bookstore - Login / Password Entry Page Object Model
 *
 * Handles the store password protection screen at https://9975.qa-bkstr.com/password
 *
 * @class FollettLoginPage
 */
export class FollettLoginPage extends BasePage {
  // Locators
  readonly enterUsingPasswordBtn: Locator;
  readonly passwordInput: Locator;
  readonly submitBtn: Locator;

  /**
   * Constructor – initialise all locators
   * @param page - Playwright Page instance
   */
  constructor(page: Page, testId: string) {
    super(page);
    console.log("🚀 Initialising FollettLoginPage");
    const td = testData[testId] ?? {};
    const enterUsingPasswordBtnText =
      td.enterUsingPasswordBtnText ?? "Enter using password";
    const passwordInputLabel = td.passwordInputLabel ?? "Enter password";
    const submitBtnText = td.submitBtnText ?? "Submit";

    this.enterUsingPasswordBtn = page.getByRole("button", {
      name: enterUsingPasswordBtnText,
    });
    this.passwordInput = page.getByRole("textbox", {
      name: passwordInputLabel,
    });
    this.submitBtn = page.getByRole("button", { name: submitBtnText });
  }

  /**
   * Navigate to the Follett QA store
   * @param url - Base URL (defaults to QA store)
   */
  async navigate(url: string) {
    console.log(`🌐 Navigating to ${url}`);
    await this.page.goto(url);
    await this.delay(5000);
    await this.page.waitForLoadState("domcontentloaded", { timeout: 10000 });
    await this.delay(10000); // Short delay
    return this;
  }

  /**
   * Open the password modal by clicking "Enter using password"
   */
  async clickEnterUsingPassword() {
    console.log("🖱️  Clicking Enter using password");
    await this.enterUsingPasswordBtn.click();
    await expect(this.passwordInput).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState("domcontentloaded");
    await this.delay(2000); // Short delay
    return this;
  }

  /**
   * Enter store password and submit
   * @param password - Store access password
   * @param testInfo - Optional Playwright TestInfo for screenshots
   */
  async enterPasswordAndSubmit(password: string, testInfo?: TestInfo) {
    console.log("🔑 Entering store password");
    await this.passwordInput.pressSequentially(password);
    await this.delay(2000); // Short delay after typing
    await this.submitBtn.click();
    await this.page.waitForLoadState("domcontentloaded");
    if (testInfo) {
      await Helper.takeScreenshotToFile(
        this.page,
        "PasswordSubmitted",
        testInfo,
      );
    }
    await this.delay(2000); // Short delay
    return this;
  }

  /**
   * Full login flow: navigate → open modal → enter password
   * @param password - Store password
   * @param storeUrl - Base URL
   * @param testInfo - Optional TestInfo
   */
  async login(
    storeUrl: string,
    password: string,
    requiresLogin: string,
    testInfo?: TestInfo,
  ) {
    await this.navigate(storeUrl);
    if (requiresLogin === "Y") {
      await this.clickEnterUsingPassword();
      await this.enterPasswordAndSubmit(password, testInfo);
      console.log("✅ Store login successful");
    }
    await this.page.waitForLoadState("domcontentloaded");
    await this.delay(10000); // Randomize delay
    return this;
  }
}
