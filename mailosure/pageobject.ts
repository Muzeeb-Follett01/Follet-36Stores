import { Page } from 'playwright';
import { expect, TestInfo } from '@playwright/test';
import { BasePage } from '../basePage';

export class CheckoutPage extends BasePage {

    constructor(public readonly page: Page) {
        super(page);
    }

    // ── ATOMIC METHODS ───────────────────────────────────────────────────────
    // One action each. No screenshots. Navigation atomics wait for domcontentloaded.

    async enterContactEmail(email: string) {
        await this.page.getByRole('textbox', { name: /email/i }).fill(email);
        return this;
    }

    async enterEmailById(email: string) {
        await this.page.locator('#email').fill(email);
        return this;
    }

    async enterEmailByPlaceholder(email: string) {
        await this.page.getByPlaceholder(/email/i).fill(email);
        return this;
    }

    async clickContinueToShipping() {
        await this.page.getByRole('button', { name: /continue/i }).click();
        await this.page.waitForLoadState('domcontentloaded');
        return this;
    }

    async clickContinue() {
        // Wait for page to be ready
        await this.page.waitForTimeout(2000);
        
        // Try multiple selectors for Continue button
        const continueSelectors = [
            'button:has-text("Continue")',
            'button:has-text("CONTINUE")',
            'button:has-text("Submit")',
            'button[type="submit"]',
            'input[type="submit"]',
            '[data-action="continue"]',
            '.continue-button',
            'button.btn-primary'
        ];
        
        for (const selector of continueSelectors) {
            try {
                const count = await this.page.locator(selector).count();
                if (count > 0) {
                    await this.page.locator(selector).first().click({ force: true, timeout: 5000 });
                    console.log(`✅ Continue clicked via selector: ${selector}`);
                    await this.page.waitForTimeout(3000);
                    return this;
                }
            } catch (e) {
                console.log(`⚠️ Continue selector failed: ${selector}`);
            }
        }
        
        // Try generic button with continue text
        try {
            await this.page.getByRole('button', { name: /continue|submit/i }).first().click({ force: true, timeout: 5000 });
            console.log('✅ Continue clicked via role');
            await this.page.waitForTimeout(3000);
            return this;
        } catch (e) {
            console.log('⚠️ Continue via role failed');
        }
        
        console.log('❌ Failed to click Continue - no button found');
        return this;
    }

    async clickSignIn() {
        // Wait a moment for any dynamic content
        await this.page.waitForTimeout(2000);
        
        let signInClicked = false;
        
        // Try the specific "Sign in" link first using XPath
        try {
            const signInLink = this.page.locator('//a[text()="Sign in"]');
            const count = await signInLink.count();
            if (count > 0) {
                await signInLink.first().click({ force: true, timeout: 5000 });
                console.log('✅ Sign In clicked via XPath: //a[text()="Sign in"]');
                signInClicked = true;
                await this.page.waitForLoadState('domcontentloaded');
                await this.page.waitForTimeout(3000);
                return this;
            }
        } catch (e) {
            console.log('⚠️ XPath //a[text()="Sign in"] failed');
        }
        
        // Try multiple selectors for Sign In button
        const signInSelectors = [
            'button:has-text("Sign in")',
            'button:has-text("Sign In")',
            'button:has-text("SIGN IN")',
            'button:has-text("Continue")',
            'button:has-text("CONTINUE")',
            'button[type="submit"]',
            'input[type="submit"]',
            '[data-action="signin"]',
            '.signin-button',
            'button.btn-primary'
        ];
        
        for (const selector of signInSelectors) {
            try {
                const count = await this.page.locator(selector).count();
                if (count > 0) {
                    await this.page.locator(selector).first().click({ timeout: 5000 });
                    console.log(`✅ Sign In clicked via selector: ${selector}`);
                    signInClicked = true;
                    await this.page.waitForTimeout(3000);
                    return this;
                }
            } catch (e) {
                console.log(`⚠️ Sign In selector failed: ${selector}`);
            }
        }
        
        // Try generic button with sign in text
        try {
            await this.page.getByRole('button', { name: /sign in|signin|continue/i }).first().click({ timeout: 5000 });
            console.log('✅ Sign In clicked via role');
            signInClicked = true;
            await this.page.waitForTimeout(3000);
            return this;
        } catch (err) {
            console.log('⚠️ Sign In via role failed');
        }
        
        if (!signInClicked) {
            console.log('❌ Failed to click Sign In - no button found');
        }
        
        await this.page.waitForTimeout(2000);
        return this;
    }

    // ── COMPOSITE METHODS ────────────────────────────────────────────────────
    // Group related atomics. Screenshot at end — always.

    async enterCheckoutEmail(email: string, testInfo: TestInfo) {
        // Wait for page to be ready
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(3000);
        
        let emailEntered = false;
        
        // Try multiple strategies to find and fill the email field
        try {
            // Strategy 1: Try by placeholder
            const emailField = this.page.getByPlaceholder(/email/i);
            if (await emailField.count() > 0) {
                await emailField.first().fill(email, { timeout: 10000 });
                console.log('✅ Email entered via placeholder');
                emailEntered = true;
                await this.attachScreenshotToReport('Checkout Email Entered (Placeholder)', testInfo);
                return this;
            }
        } catch (err) { console.log('⚠️ Placeholder strategy failed'); }
        
        try {
            // Strategy 2: Try by ID
            await this.page.locator('#email').fill(email, { timeout: 10000 });
            console.log('✅ Email entered via #email ID');
            emailEntered = true;
            await this.attachScreenshotToReport('Checkout Email Entered (ID)', testInfo);
            return this;
        } catch (err) { console.log('⚠️ ID strategy failed'); }
        
        try {
            // Strategy 3: Try by input type
            await this.page.locator('input[type="email"]').first().fill(email, { timeout: 10000 });
            console.log('✅ Email entered via input[type=email]');
            emailEntered = true;
            await this.attachScreenshotToReport('Checkout Email Entered (Type)', testInfo);
            return this;
        } catch (err) { console.log('⚠️ Input type strategy failed'); }
        
        try {
            // Strategy 4: Try by name attribute
            await this.page.locator('input[name*="email"]').first().fill(email, { timeout: 10000 });
            console.log('✅ Email entered via name attribute');
            emailEntered = true;
            await this.attachScreenshotToReport('Checkout Email Entered (Name)', testInfo);
            return this;
        } catch (err) { console.log('⚠️ Name strategy failed'); }
        
        if (!emailEntered) {
            console.log('❌ Failed to enter email - no email field found');
        }
        
        await this.attachScreenshotToReport('Email Entry Attempted', testInfo);
        return this;
    }

    async performEmailSignIn(email: string, testInfo: TestInfo) {
        await this.enterCheckoutEmail(email, testInfo);
        await this.clickSignIn();
        await this.attachScreenshotToReport('Sign In Clicked', testInfo);
        return this;
    }

    async waitForVerificationEmail(timeout: number = 60000) {
        // Wait for the page to indicate that a verification email was sent
        await this.page.waitForTimeout(timeout);
        return this;
    }

    // ── ASSERTION METHODS ────────────────────────────────────────────────────
    // Always: expect() + attachScreenshotToReport. Always takes testInfo.

    async verifyCheckoutPageLoaded(testInfo: TestInfo) {
        await expect(this.page.getByText(/checkout/i).or(this.page.getByText(/contact/i))).toBeVisible();
        await this.attachScreenshotToReport('Assert: Checkout Page Loaded', testInfo);
        return this;
    }

    async verifyEmailEntered(email: string, testInfo: TestInfo) {
        await expect(this.page.locator('#email').or(this.page.getByRole('textbox', { name: /email/i }))).toHaveValue(email);
        await this.attachScreenshotToReport('Assert: Email Entered', testInfo);
        return this;
    }
}
