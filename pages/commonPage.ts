import { Page } from "playwright";
import { expect, TestInfo } from "playwright/test";
import { Helper } from "../utils/helper";
import { BasePage } from "./basePage";

export class CommonPage extends BasePage{

    constructor(public readonly page: Page){
        super(page);
    }

    async goto(url = '/'){
        await this.page.goto(url);
        return this;
    }

    async login(username, password, testInfo: TestInfo){
        await this.goto();
        await this.page.getByPlaceholder("Username").fill(username);
        await this.page.getByPlaceholder("Password").fill(password);
        await this.page.getByText("Login").click({ force: true });
        await expect(this.page.getByText("Login")).not.toBeVisible();
        Helper.attachScreenshotToReport(this.page, "LoginSuccess", testInfo);
        return this;
    }

    async logout(testInfo: TestInfo){
        await this.page.getByRole("button",{name: "Open Menu"}).click();
        await this.page.getByText("Logout").click();
        await expect(this.page.getByText("Login")).toBeVisible();
        await Helper.attachScreenshotToReport(this.page, "Logout", testInfo);
        return this;
    }
}