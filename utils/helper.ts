import { type Page, type Locator, TestInfo } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { storeId as excelStoreId } from "./excelToTestData";

export class Helper {
  /**
   * Attaches a screenshot to the Playwright test report
   *
   * @param page - Playwright Page instance
   * @param screenshotName - Name for the screenshot in the report
   * @param testInfo - Playwright TestInfo for attaching to report
   */
  static async attachScreenshotToReport(
    page: Page,
    screenshotName: string,
    testInfo: TestInfo,
  ) {
    const screenshot = await page.screenshot();
    await testInfo.attach(screenshotName, {
      body: screenshot,
      contentType: "image/png",
    });
  }

  /**
   * Extracts the store ID from a URL containing a bkstr pattern.
   * e.g. "https://bkstr-1025.myshopify.com/" → "1025"
   */
  static extractStoreId(url: string): string {
    try {
      const hostname = new URL(url).hostname;
      const match = hostname.match(/bkstr[-.](\d+)/);
      if (match) return match[1];
      const first = hostname.split(".")[0];
      return first === "www" ? hostname.split(".")[1] : first;
    } catch {
      return "store";
    }
  }

  /**
   * Takes a screenshot and saves it to:
   *   test-results/<storeId>/<testCaseId>/screenshots/<screenshotName>.png
   * Also attaches to the HTML report if testInfo is provided.
   *
   * @param page - Playwright Page instance
   * @param screenshotName - Name for the screenshot file (without extension)
   * @param testInfo - Optional TestInfo to also attach to report
   * @returns Promise<string> - Path to the saved screenshot
   */
  static async takeScreenshotToFile(
    page: Page,
    screenshotName: string,
    testInfo?: TestInfo,
  ): Promise<string> {
    // Use store ID from the Excel file name (e.g. bkstr-0125.xlsx → "0125")
    const storeId = excelStoreId;

    // Derive test case ID strictly from the spec file name (e.g. TMSHOP-462.spec.ts → TMSHOP-462)
    const specFile = testInfo?.file ?? "";
    const fileMatch = path.basename(specFile).match(/(TMSHOP-\d+)/i);
    const testCaseId = fileMatch ? fileMatch[1].toUpperCase() : "unknown";

    const screenshotsDir = path.join(
      process.cwd(),
      "test-results",
      storeId,
      testCaseId,
      "screenshots",
    );

    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    const screenshotPath = path.join(screenshotsDir, `${screenshotName}.png`);

    try {
      await page.screenshot({ path: screenshotPath, fullPage: true });
    } catch (error: any) {
      if (
        error?.message?.includes(
          "Protocol error (Page.captureScreenshot): Unable to capture screenshot",
        )
      ) {
        console.log(
          "⚠️ Unable to capture screenshot, skipping:",
          error.message,
        );
        return screenshotPath;
      } else {
        throw error;
      }
    }

    // Also attach to test report if testInfo is provided
    if (testInfo) {
      const screenshot = fs.readFileSync(screenshotPath);
      await testInfo.attach(screenshotName, {
        body: screenshot,
        contentType: "image/png",
      });
    }

    console.log(
      `📸 Screenshot saved: test-results/${storeId}/${testCaseId}/screenshots/${screenshotName}.png`,
    );
    return screenshotPath;
  }

  /**
   * Fills dynamic fields that can be either textbox or combobox
   * This method detects the field type and fills accordingly
   *
   * Supports read-only combobox fields that require typing to filter options
   * Used for address fields like Country/State that toggle between textbox and combobox
   *
   * @param page - Playwright Page instance for navigation
   * @param textboxLocator - Locator for textbox variant of the field
   * @param comboboxLocator - Locator for combobox variant of the field
   * @param fieldName - Name of the field for logging purposes
   * @param value - Value to fill/select (EXACT match required for combobox)
   *
   * @example
   * await Helper.fillDynamicField(
   *   page,
   *   mailingStateTextbox,
   *   mailingStateCombobox,
   *   "Mailing State",
   *   "California"
   * );
   */
  static async fillDynamicField(
    page: Page,
    textboxLocator: Locator,
    comboboxLocator: Locator,
    fieldName: string,
    value: string,
  ): Promise<void> {
    try {
      // Check if combobox is visible and enabled
      const comboboxVisible = await comboboxLocator
        .isVisible({ timeout: 2000 })
        .catch(() => false);

      if (comboboxVisible) {
        console.log(
          `🔽 ${fieldName} is a combobox, selecting from dropdown...`,
        );
        await comboboxLocator.click({ timeout: 10000 });
        await page.waitForTimeout(1000);

        try {
          // The combobox is read-only, so we need to type to filter options
          // Type the value to filter dropdown options
          console.log(
            `📝 Typing "${value}" to filter and select exact match...`,
          );
          await comboboxLocator.type(value, { delay: 100 });
          await page.waitForTimeout(1500);

          // IMPORTANT: Look for EXACT match only - using text normalization
          const exactMatchOption = page
            .locator(`[role="option"]`)
            .filter({
              hasText: new RegExp(`^${value}$`, "i"),
            })
            .first();

          const exactMatchVisible = await exactMatchOption
            .isVisible({ timeout: 5000 })
            .catch(() => false);

          if (exactMatchVisible) {
            await exactMatchOption.click({ timeout: 5000, force: true });
            console.log(`✅ ${fieldName} selected with EXACT match:`, value);
            return;
          }

          // If exact match not found, throw error and try fallback
          throw new Error(`Exact match not found for "${value}"`);
        } catch (e) {
          console.log(
            `⏱️ Exact match not found, attempting keyboard navigation for ${fieldName}...`,
          );
          try {
            // Clear previous attempt
            await comboboxLocator.clear({ timeout: 2000 }).catch(() => {});
            await page.waitForTimeout(500);

            // Try again with fresh typing
            await comboboxLocator.type(value, { delay: 100 });
            await page.waitForTimeout(1500);

            // Use keyboard to navigate and select
            await page.keyboard.press("ArrowDown");
            await page.waitForTimeout(500);
            await page.keyboard.press("Enter");
            console.log(
              `✅ ${fieldName} selected via keyboard navigation:`,
              value,
            );
          } catch (e2) {
            console.log(
              `❌ Failed to select exact match for ${fieldName}:`,
              value,
            );
            throw new Error(
              `Could not select exact value "${value}" for field "${fieldName}". Available options may differ.`,
            );
          }
        }
      } else {
        // Use textbox
        console.log(`📝 ${fieldName} is a textbox, filling value...`);
        await textboxLocator.fill(value, { timeout: 10000 });
        console.log(`✅ ${fieldName} filled:`, value);
      }
    } catch (error) {
      console.log(
        `⚠️ Error filling ${fieldName}, attempting textbox as fallback:`,
        error,
      );
      try {
        await textboxLocator.fill(value, { timeout: 10000 });
        console.log(`✅ ${fieldName} filled via textbox fallback:`, value);
      } catch (fallbackError) {
        console.log(`❌ Failed to fill ${fieldName}:`, fallbackError);
        throw fallbackError;
      }
    }
  }

  static generateUniqueValue(baseString: string): string {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    return `${randomNum}${baseString}${timestamp}`;
  }

  static generateUniqueEmail(baseEmail: string): string {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    return `test+${timestamp}${randomNum}${baseEmail}`;
  }
}
