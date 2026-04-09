import { type Page, TestInfo } from '@playwright/test';

export class Helper{

    static async attachScreenshotToReport(page: Page, screenshotName : string, testInfo: TestInfo){
        const screenshot = await page.screenshot();
        await testInfo.attach(screenshotName, { body: screenshot, contentType: 'image/png' });
    }
}
