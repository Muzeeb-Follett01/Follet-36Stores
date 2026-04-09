import { Page } from "playwright";
import { TestInfo } from "playwright/test";
import { Helper } from "../utils/helper";

export class BasePage{

    /** True when MOBILE=true is passed via CLI env var. Drives if/else locator branches in page objects. */
    protected readonly isMobile: boolean = (process.env.MOBILE ?? '').trim() === 'true';

    constructor(public readonly page: Page){
    }

    async attachScreenshotToReport(screenshotName : string, testInfo: TestInfo){
        Helper.attachScreenshotToReport(this.page, screenshotName, testInfo);
        return this;
    }

    async delay(ms: number) {
        ms=1000;
        await this.page.waitForTimeout(ms);
    }
}