import { test as base } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { CommonPage } from "../pages/commonPage";
import { storeId } from "./excelToTestData";

// Declare the types of your fixtures.
type MyFixtures = {
  commonPage: CommonPage;
  saveVideo: void;
};

export const test = base.extend<MyFixtures>({
  commonPage: async ({ page }, use) => {
    const commonPage = new CommonPage(page);
    await use(commonPage);
  },

  /**
   * Auto-fixture: after each test, saves the Playwright video to:
   *   test-results/<storeId>/<testCaseId>/videos/<testCaseId>.webm
   */
  saveVideo: [
    async ({ page }, use, testInfo) => {
      // Capture the video object BEFORE the test runs (page must be open)
      const video = page.video();

      await use();

      // Derive test case ID from the spec file name (e.g. TMSHOP-462.spec.ts → TMSHOP-462)
      const specFile = testInfo.file ?? "";
      const fileMatch = path.basename(specFile).match(/(TMSHOP-\d+)/i);
      const testCaseId = fileMatch ? fileMatch[1].toUpperCase() : "unknown";

      if (video) {
        try {
          const videosDir = path.join(
            process.cwd(),
            "test-results",
            storeId,
            testCaseId,
            "videos",
          );
          if (!fs.existsSync(videosDir)) {
            fs.mkdirSync(videosDir, { recursive: true });
          }
          const destPath = path.join(videosDir, `${testCaseId}.webm`);
          // Close page first so Playwright finalises the video recording
          await page.close().catch(() => {});
          await video.saveAs(destPath);
          console.log(
            `🎥 Video saved: test-results/${storeId}/${testCaseId}/videos/${testCaseId}.webm`,
          );
        } catch (e: any) {
          console.log("⚠️ Could not save video:", e.message);
        }
      }
    },
    { auto: true, scope: "test" },
  ],
});

export { request } from "@playwright/test";

export { expect } from "@playwright/test";
