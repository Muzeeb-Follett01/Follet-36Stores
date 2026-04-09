import { Page, Locator, FrameLocator } from "playwright";
import { expect, TestInfo } from "playwright/test";
import { BasePage } from "../basePage";
import { Helper } from "../../utils/helper";

/**
 * Yopmail – Disposable Email Inbox Page Object Model
 *
 * Encapsulates yopmail inbox navigation, inbox reading,
 * and email content verification.
 *
 * @class YopmailPage
 */
export class YopmailPage extends BasePage {
  // Locators
  readonly inboxInput: Locator;

  // Frame accessors (computed per-call as page state changes)
  private get inboxFrame(): FrameLocator {
    return this.page.frameLocator("#ifinbox");
  }

  private get emailFrame(): FrameLocator {
    return this.page.frameLocator("#ifmail");
  }

  /**
   * Constructor – initialise all locators
   * @param page - Playwright Page instance
   */
  constructor(page: Page) {
    super(page);
    console.log("🚀 Initialising YopmailPage");

    this.inboxInput = page.locator("input#login");
  }

  /**
   * Navigate to https://yopmail.com/
   */
  async navigateTo() {
    console.log("🌐 Navigating to yopmail.com");
    await this.page.goto("https://yopmail.com/");
    await this.page.waitForLoadState("domcontentloaded");
    return this;
  }

  /**
   * Type the email username (local-part only, without @yopmail.com)
   * into the inbox search input and press Enter.
   *
   * @param emailUsername - e.g. "yeikuhozoiffa-1695"
   * @param testInfo - Optional Playwright TestInfo for screenshots
   */
  async openInbox(emailUsername: string, testInfo?: TestInfo) {
    console.log(`📬 Opening inbox for: ${emailUsername}`);
    await expect(this.inboxInput).toBeVisible({ timeout: 10000 });
    await this.inboxInput.fill(emailUsername);
    await this.inboxInput.press("Enter");
    await this.page.waitForLoadState("domcontentloaded");

    if (testInfo) {
      await Helper.takeScreenshotToFile(
        this.page,
        "Yopmail_Inbox_Opened",
        testInfo,
      );
    }
    return this;
  }

  /**
   * Click the most recent (first) email in the inbox frame.
   *
   * @param testInfo - Optional Playwright TestInfo for screenshots
   */
  async clickLatestEmail(testInfo?: TestInfo) {
    console.log("📧 Clicking latest email in inbox");
    const latestEmail = this.inboxFrame.locator(".lms").first();
    await expect(latestEmail).toBeVisible({ timeout: 20000 });
    await latestEmail.click();
    await this.page.pause(); // Pause to allow email content to load before screenshot
    if (testInfo) {
      await Helper.takeScreenshotToFile(
        this.page,
        "Yopmail_Email_Opened",
        testInfo,
      );
    }
    return this;
  }

  /**
   * Verify that a piece of text matching the supplied pattern
   * is visible inside the opened email body (in the #ifmail iframe).
   *
   * @param pattern - A string or RegExp to match against email body content
   * @param testInfo - Optional Playwright TestInfo for screenshots
   */
  async verifyEmailContent(pattern: string | RegExp, testInfo?: TestInfo) {
    console.log(`🔍 Verifying email content matches: ${pattern}`);
    const target = this.emailFrame.getByText(pattern).first();
    await expect(target).toBeVisible({ timeout: 15000 });

    if (testInfo) {
      await Helper.takeScreenshotToFile(
        this.page,
        "Yopmail_Order_Confirmed",
        testInfo,
      );
    }
    console.log("✅ Email content verified successfully");
    return this;
  }

  /**
   * Navigate to Yopmail, open the inbox for the given email address,
   * click the latest email, and extract the first 6-digit verification
   * code found in the email body.
   *
   * @param email - Full email address (e.g. "yeikuhozoiffa-1695@yopmail.com")
   * @param testInfo - Optional Playwright TestInfo for screenshots
   * @returns The 6-digit verification code as a string
   */
  async getVerificationCode(email: string, testInfo?: TestInfo): Promise<string> {
    const username = email.split('@')[0];
    console.log(`🔑 Retrieving verification code for inbox: ${username}`);

    await this.navigateTo();
    await this.openInbox(username, testInfo);
    await this.clickLatestEmail(testInfo);

    const emailBody = this.emailFrame.locator('body');
    await expect(emailBody).toBeVisible({ timeout: 20000 });
    const text = await emailBody.innerText();

    const match = text.match(/\b(\d{6})\b/);
    if (!match) {
      throw new Error(`No 6-digit verification code found in latest email for ${email}`);
    }

    console.log(`✅ Verification code extracted: ${match[1]}`);
    if (testInfo) {
      await Helper.takeScreenshotToFile(this.page, 'Yopmail_Code_Retrieved', testInfo);
    }
    return match[1];
  }
}
