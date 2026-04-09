import { test } from '@playwright/test';
import { NTCBookstorePage } from '../../pages/NTCBookstore/NTCBookstorePage';
import { CheckoutPage } from '../../pages/NTCBookstore/CheckoutPage';
import { MailosaurHelper } from '../../utils/mailosaurHelper';
import * as fs from 'fs';
import * as path from 'path';

// ── TEST DATA ────────────────────────────────────────────────────────────────
// All test values defined here. Never inline strings in method calls.
const testDataPath = path.join(__dirname, '../../testdata/NTCBookstore/testData.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));

// ── TEST SCENARIO ────────────────────────────────────────────────────────────

test('NTC Bookstore - Add product to bag and retrieve verification code', async ({ page }, testInfo) => {
    console.log('▶ Starting: NTC Bookstore Checkout with Mailosaur Verification');

    const bookstorePage = new NTCBookstorePage(page);
    const checkoutPage = new CheckoutPage(page);
    const mailosaurHelper = new MailosaurHelper(
        testData.mailosaur.apiKey,
        testData.mailosaur.serverId
    );

    // Phase: Navigate to NTC Bookstore
    console.log('→ Phase: Navigate to NTC Bookstore Collections');
    console.log('  ↳ Step: Open NTC Bookstore collections page');
    await bookstorePage.open(testData.baseUrl + '/collections/all', testInfo);

    // Phase: Select and add product to bag
    console.log('→ Phase: Add Product to Bag');
    if (testData.product.name && testData.product.name !== 'PRODUCT_NAME') {
        console.log(`  ↳ Step: Select product "${testData.product.name}" and add to bag`);
        await bookstorePage.selectAndAddProductByName(testData.product.name, testInfo);
    } else {
        console.log('  ↳ Step: Select first available product and add to bag');
        await bookstorePage.selectAndAddFirstProduct(testInfo);
    }

    // Phase: Click Checkout button
    console.log('→ Phase: Navigate to Checkout');
    console.log('  ↳ Step: Click Checkout button');
    try {
        await bookstorePage.clickCheckout();
        await bookstorePage.attachScreenshotToReport('After Checkout Click', testInfo);
    } catch (e) {
        console.log('  ↳ Checkout button not found, navigating directly');
        await page.goto('https://ntc.bkstr.com/checkouts/new', { waitUntil: 'domcontentloaded', timeout: 60000 });
    }
    await page.waitForTimeout(3000);

    // Phase: Enter email and click Sign In (First Page)
    console.log('→ Phase: Enter Email and Click Sign In (Page 1)');
    console.log(`  ↳ Step: Enter email address: ${testData.checkoutEmail}`);
    await checkoutPage.enterCheckoutEmail(testData.checkoutEmail, testInfo);
    
    console.log('  ↳ Step: Click Sign In button (if present)');
    try {
        await checkoutPage.clickSignIn();
        await checkoutPage.attachScreenshotToReport('After Sign In Click - Page 1', testInfo);
    } catch (e) {
        console.log('  ↳ Sign In button not found on page 1, continuing...');
        await checkoutPage.attachScreenshotToReport('No Sign In Button - Page 1', testInfo);
    }
    
    // Phase: Enter email again and click Continue (Second Page)
    console.log('→ Phase: Enter Email and Click Continue (Page 2)');
    console.log(`  ↳ Step: Enter email address again: ${testData.checkoutEmail}`);
    await page.waitForTimeout(2000);
    await checkoutPage.enterCheckoutEmail(testData.checkoutEmail, testInfo);
    
    console.log('  ↳ Step: Click Continue button to trigger OTP');
    await checkoutPage.clickContinue();
    await checkoutPage.attachScreenshotToReport('After Continue Click - OTP Triggered', testInfo);
    
    // Wait for OTP email to be sent
    console.log('  ↳ Waiting for OTP email to be sent...');
    await page.waitForTimeout(5000);

    // Phase: Wait for verification email and retrieve code
    console.log('→ Phase: Retrieve Verification Code from Mailosaur');
    console.log(`  ↳ Step: Wait for email to arrive at ${testData.checkoutEmail}`);
    
    try {
        const verificationCode = await mailosaurHelper.getVerificationCode(
            testData.checkoutEmail,
            60000
        );

        console.log('✅ Verification Code Retrieved Successfully');
        console.log('═══════════════════════════════════════════════════');
        console.log(`🔐 VERIFICATION CODE: ${verificationCode}`);
        console.log('═══════════════════════════════════════════════════');

        // Clean up - delete all messages after retrieving code
        console.log('  ↳ Step: Clean up Mailosaur messages');
        await mailosaurHelper.deleteAllMessages();

    } catch (error) {
        console.error('❌ Failed to retrieve verification code from Mailosaur');
        console.error('Error details:', error);
        throw error;
    }

    console.log('✅ Complete: NTC Bookstore Checkout with Mailosaur Verification');
    console.log('⚠️ Note: Payment was not completed as per requirements');
});
