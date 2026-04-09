import type { Page, Locator } from '@playwright/test';
import {
  humanGoto, humanClick, humanFill, humanType, humanPress, humanScroll, sleep, jitter
} from '../utils/humanize';
 
export class BasePage {
  constructor(protected readonly page: Page) {}
 
  // Expose helpers so derived pages can call directly
  protected sleep = sleep;
  protected jitter = jitter;
 
  async goto(url: string) { return humanGoto(this.page, url); }
  async scroll(opts?: Parameters<typeof humanScroll>[1]) { return humanScroll(this.page, opts); }
 
  // Wrapper makers for Locators (sugar for page objects)
  protected $(selector: string): Locator { return this.page.locator(selector); }
  protected byRole(role: Parameters<Page['getByRole']>[0], options?: Parameters<Page['getByRole']>[1]) {
    return this.page.getByRole(role, options as any);
  }
 
  // Common humanized actions on locators
  async click(locator: Locator) { return humanClick(locator); }
  async fill(locator: Locator, text: string) { return humanFill(locator, text); }
  async type(locator: Locator, text: string) { return humanType(locator, text); }
  async press(locator: Locator, key: string) { return humanPress(locator, key); }
}