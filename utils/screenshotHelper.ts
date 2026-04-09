// Screenshot helper utility for consistent step-level screenshot handling
import { Helper } from "./helper";

/**
 * Takes a screenshot after each step and saves it to:
 *   test-results/<storeId>/<testCaseId>/screenshots/<stepName>.png
 * Store ID and test case ID are derived automatically from the page URL and testInfo.
 *
 * @param page - Playwright Page instance
 * @param testInfo - Playwright TestInfo
 * @param stepName - Name of the step (CREATE, VERIFY, etc.)
 */
export async function takeStepScreenshot(
  page: any,
  testInfo: any,
  stepName: string,
) {
  console.log(`📸 Taking ${stepName} screenshot...`);

  try {
    if (page && !page.isClosed()) {
      await Helper.takeScreenshotToFile(page, stepName, testInfo);
    } else {
      console.log(`⚠️ Page not available for ${stepName} screenshot`);
    }
  } catch (error: any) {
    console.log(`❌ Error taking ${stepName} screenshot:`, error.message);
  }
}

/**
 * Takes a scenario completion screenshot and saves it to:
 *   test-results/<storeId>/<testCaseId>/screenshots/SCENARIO_<status>.png
 *
 * @param page - Playwright Page instance
 * @param testInfo - Playwright TestInfo
 * @param status - Test status (PASSED, FAILED, etc.)
 */
export async function takeScenarioScreenshot(
  page: any,
  testInfo: any,
  status: string,
) {
  console.log(`📸 Taking scenario ${status} screenshot...`);

  try {
    if (page && !page.isClosed()) {
      await Helper.takeScreenshotToFile(page, `SCENARIO_${status}`, testInfo);
    }
  } catch (error: any) {
    console.log(
      `❌ Error taking scenario ${status} screenshot:`,
      error.message,
    );
  }
}
