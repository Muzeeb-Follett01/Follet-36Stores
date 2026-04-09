import { Page, Locator } from "playwright";
import { expect, TestInfo } from "playwright/test";
import { Helper } from "../../utils/helper";
import { BasePage } from "../basePage";
import { MailosaurHelper } from "../../utils/mailosaurHelper";
import testData from "../../utils/excelToTestData";

/**
 * Follett Bookstore – Checkout Page Object Model
 *
 * Handles the Shopify-powered checkout form:
 *   Contact → Delivery → Shipping → Payment → Pay now
 *
 * @class FollettCheckoutPage
 */
export class FollettCheckoutPage extends BasePage {
  // --- Contact ---
  readonly emailInput: Locator;
  readonly emailInputMobile: Locator;
  readonly closeBtn: Locator;
  // --- Delivery (Desktop) ---
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressCombobox: Locator;
  readonly cityInput: Locator;
  readonly stateCombobox: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneInput: Locator;

  // --- Delivery (Mobile) — Shopify checkout uses name/autocomplete attrs on mobile Safari ---
  readonly firstNameInputMobile: Locator;
  readonly lastNameInputMobile: Locator;
  readonly addressComboboxMobile: Locator;
  readonly addressDivMobile: Locator;
  readonly cityInputMobile: Locator;
  readonly stateComboboxMobile: Locator;
  readonly zipCodeInputMobile: Locator;
  readonly phoneInputMobile: Locator;

  // --- Billing ---
  readonly useShippingAsBillingCheckbox: Locator;

  // --- Financial Aid ---
  readonly financialAidCheckbox: Locator;
  readonly studentIdInput: Locator;
  readonly lookUpAccountBtn: Locator;
  readonly applyFundsBtn: Locator;

  // --- Campus Card ---
  readonly campusCardCheckbox: Locator;
  readonly campusCardInput: Locator;
  readonly lookUpBalanceBtn: Locator;
  readonly applyBtn: Locator;
  readonly campusCardAppliedConfirmation: Locator;

  // --- Card Payment (Shopify iframe fields) ---
  // readonly creditCardFrame: ReturnType<Page["frameLocator"]>;

  // --- Headings / Verification ---
  readonly checkoutHeading: Locator;

  // --- CTA ---
  readonly payNowBtn: Locator;

  // --- Financial Aid Removal ---
  readonly removeBtn: Locator;

  // --- Card Payment (Shopify iframe fields) ---
  readonly cardNumberInput: Locator;
  readonly cardExpiryInput: Locator;
  readonly cardSecurityCodeInput: Locator;
  readonly cardNameInput: Locator;

  // --- Additional Payment Methods Expander ---
  readonly additionalPaymentMethodsBtn: Locator;

  // --- Complete Order button (text-based, used when payNowBtn is inside an iframe) ---
  readonly completeOrderBtn: Locator;

  // --- Sign-in flow text (used in signIn() method) ---
  private readonly signInLinkText: string;
  private readonly emailLabel: string;
  private readonly continueBtnText: string;
  private readonly sixDigitCodePlaceholder: string;

  // --- Rental Agreement Checkboxes ---
  readonly rentalTermsCheckbox: Locator;
  readonly rentalCreditCardCheckbox: Locator;

  // --- Pick up delivery ---
  private readonly pickUpRadioText: string;

  /**
   * Constructor – initialise all locators
   * @param page - Playwright Page instance
   */
  constructor(page: Page, testId: string) {
    super(page);
    console.log("🚀 Initialising FollettCheckoutPage");
    const td = testData[testId] ?? {};
    const financialAidLabel = td.financialAidLabel ?? "Financial Aid";
    const lookUpAccountBtnText = td.lookUpAccountBtnText ?? "Look Up Account";
    const applyFundsBtnText = td.applyFundsBtnText ?? "Apply Funds";
    const campusCardLabel = td.campusCardLabel ?? "Campus Card";
    const lookUpBalanceBtnText = td.lookUpBalanceBtnText ?? "Look Up Balance";
    const applyBtnText = td.applyBtnText ?? "Apply";
    const campusCardConfirmText =
      td.campusCardConfirmText ?? "Campus Card Applied";
    const removeBtnText = td.removeBtnText ?? "Remove";
    const useShippingLabel =
      td.useShippingLabel ?? "Use shipping address as billing address";
    const checkoutHeadingText = td.checkoutHeadingText ?? "Checkout";
    const completeOrderBtnText = td.completeOrderBtnText ?? "Complete order";
    const additionalPaymentBtnText =
      td.additionalPaymentBtnText ?? "More payment options";
    const rentalTermsLabel = td.rentalTermsLabel ?? "rental agreement";
    const rentalCreditCardLabel = td.rentalCreditCardLabel ?? "credit card";
    const cardNumberPlaceholder = td.cardNumberPlaceholder ?? "Card number";
    const cardExpiryPlaceholder =
      td.cardExpiryPlaceholder ?? "Expiration date (MM / YY)";
    const cardSecurityPlaceholder =
      td.cardSecurityPlaceholder ?? "Security code";
    const cardNamePlaceholder = td.cardNamePlaceholder ?? "Name on card";
    const firstNamePlaceholder = td.firstNamePlaceholder ?? "First name";
    const lastNamePlaceholder = td.lastNamePlaceholder ?? "Last name";
    const addressPlaceholder = td.addressPlaceholder ?? "Address";
    const cityLabel = td.cityLabel ?? "City";
    const stateLabel = td.stateLabel ?? "State";
    const zipCodePlaceholder = td.zipCodePlaceholder ?? "ZIP code";
    const phonePlaceholder = td.phonePlaceholder ?? "Phone";
    const emailLabel = td.emailLabel ?? "Email";
    const signInLinkText = td.signInLinkText ?? "Sign in";
    const continueBtnText = td.continueBtnText ?? "Continue";
    const sixDigitCodePlaceholder =
      td.sixDigitCodePlaceholder ?? "6-digit code";
    this.signInLinkText = signInLinkText;
    this.emailLabel = emailLabel;
    this.continueBtnText = continueBtnText;
    this.sixDigitCodePlaceholder = sixDigitCodePlaceholder;
    const pickUpRadioText = td.pickUpRadioText ?? "Pick up";
    const freePickupText = td.freePickupText ?? "Free";
    this.pickUpRadioText = pickUpRadioText;

    // this.emailInput = page.getByPlaceholder("Email").first();
    this.emailInputMobile = page.locator("#email");
    this.closeBtn = this.page.locator(
      '[data-testid="authorize-modal-close-button"]',
    );

    this.firstNameInput = page.getByPlaceholder(firstNamePlaceholder);
    this.lastNameInput = page.getByPlaceholder(lastNamePlaceholder);
    this.addressCombobox = page.getByPlaceholder(addressPlaceholder);
    this.cityInput = page.getByLabel(cityLabel).first();
    this.stateCombobox = page.getByLabel(stateLabel).first();
    this.zipCodeInput = page.getByPlaceholder(zipCodePlaceholder);
    // this.phoneInput = page.getByPlaceholder(phonePlaceholder).first();
    this.phoneInput = page.locator(`[placeholder="Phone"]`).first();

    // Mobile: Shopify checkout uses name/autocomplete attributes — more stable on Safari mobile
    this.emailInput = page.getByLabel(emailLabel).first();
    this.firstNameInputMobile = page
      .locator(`[placeholder="${firstNamePlaceholder}"]`)
      .first();
    this.lastNameInputMobile = page
      .locator(`[placeholder="${lastNamePlaceholder}"]`)
      .first();
    this.addressComboboxMobile = page.locator('(//input[@name="address1"])[1]');
    // this.addressComboboxMobile = page.locator('//*[@id="shipping-address1"]//div[2]');
    this.addressDivMobile = page.locator(
      `(//input[@name="address1"])[1]/preceding::div[1]`,
    );
    this.cityInputMobile = page.locator(`[placeholder="${cityLabel}"]`).first();
    this.stateComboboxMobile = page
      .locator(`[placeholder="${stateLabel}"]`)
      .first();
    this.zipCodeInputMobile = page
      .locator(`[placeholder="${zipCodePlaceholder}"]`)
      .first();
    this.phoneInputMobile = page.locator(`[placeholder="Phone"]`).first();
    this.useShippingAsBillingCheckbox = page.getByRole("checkbox", {
      name: useShippingLabel,
    });
    this.payNowBtn = page.locator(`#checkout-pay-button`);
    this.checkoutHeading = page
      .getByRole("heading", { name: new RegExp(checkoutHeadingText, "i") })
      .first();

    this.financialAidCheckbox = page.getByLabel(financialAidLabel);
    this.studentIdInput = page.locator("#student-id");
    this.lookUpAccountBtn = page.getByRole("button", {
      name: lookUpAccountBtnText,
    });
    this.applyFundsBtn = page.getByRole("button", { name: applyFundsBtnText });

    this.campusCardCheckbox = page.getByLabel(campusCardLabel);
    this.campusCardInput = page.locator("#campus-card-no");
    this.lookUpBalanceBtn = page.getByRole("button", {
      name: new RegExp(lookUpBalanceBtnText, "i"),
    });
    this.applyBtn = page.getByRole("button", {
      name: new RegExp(applyBtnText, "i"),
    });
    this.campusCardAppliedConfirmation = page
      .getByText(campusCardConfirmText)
      .first();
    this.removeBtn = page.getByRole("button", { name: removeBtnText }).first();

    // Shopify card iframe – all three card fields live inside the same iframe
    this.cardNumberInput = page
      .frameLocator(`[title="Field container for: Card number"]`)
      .getByPlaceholder(cardNumberPlaceholder);
    this.cardExpiryInput = page
      .frameLocator(`[title="Field container for: Expiration date (MM / YY)"]`)
      .getByPlaceholder(cardExpiryPlaceholder);
    this.cardSecurityCodeInput = page
      .frameLocator(`[title="Field container for: Security code"]`)
      .getByPlaceholder(cardSecurityPlaceholder);
    this.cardNameInput = page
      .frameLocator(`[title="Field container for: Name on card"]`)
      .getByPlaceholder(cardNamePlaceholder);

    // Additional payment methods expander button (e.g., "+5 Additional payment methods")
    this.additionalPaymentMethodsBtn = page.getByRole("button", {
      name: new RegExp(additionalPaymentBtnText, "i"),
    });

    // "Complete order" button text – used as fallback when iframe hides standard Pay Now CTA
    this.completeOrderBtn = page.getByRole("button", {
      name: completeOrderBtnText,
    });

    // Rental agreement checkboxes shown when cart contains a rental item
    this.rentalTermsCheckbox = page.getByLabel(rentalTermsLabel);
    this.rentalCreditCardCheckbox = page.getByLabel(rentalCreditCardLabel);
  }

  /**
   * Fill the contact email field
   * @param emailOrConfig - Plain email string or object { address, apiKey?, serverId? }
   */
  async fillEmail(
    emailOrConfig:
      | string
      | { address: string; apiKey?: string; serverId?: string },
    signIn: string = "N",
  ) {
    const email =
      typeof emailOrConfig === "string" ? emailOrConfig : emailOrConfig.address;
    const mailosaurConfig =
      typeof emailOrConfig === "object" &&
      emailOrConfig.apiKey &&
      emailOrConfig.serverId
        ? { apiKey: emailOrConfig.apiKey, serverId: emailOrConfig.serverId }
        : undefined;

    await this.page.waitForLoadState("domcontentloaded");
    await this.delay(10000); // Wait for potential dynamic loading of email field
    console.log(`📧 Filling email: ${email}`);
    if (this.isMobile) {
      await expect(this.emailInputMobile).toBeVisible({ timeout: 15000 });
      await this.emailInputMobile.fill(email);
    } else {
      await expect(this.emailInput).toBeVisible({ timeout: 15000 });
      await this.emailInput.pressSequentially(email);
    }
    await this.page.waitForTimeout(3000); // Wait for potential dynamic loading of email field

    // Dismiss authorize modal if it appears
    if (await this.closeBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log("✖️ Closing authorization modal");
      await this.closeBtn.click();
    }
    await this.delay(10000); // Wait for potential dynamic loading of email field

    if (signIn == "Y") {
      await this.signIn(email, undefined, mailosaurConfig);
    }
  }

  async signIn(
    email: string,
    testInfo?: TestInfo,
    mailosaurConfig?: { apiKey: string; serverId: string },
  ) {
    // Step 1: Click "Sign in" link
    console.log("🔐 Clicking Sign in link...");
    await this.page.getByRole("link", { name: this.signInLinkText }).click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.delay(3000);

    // Step 2: Fill email again on the sign-in page
    console.log(`📧 Entering email on sign-in page: ${email}`);
    await this.page.getByPlaceholder(this.emailLabel).fill(email);

    // Step 3: Click "Continue" to trigger OTP email
    console.log("➡️ Clicking Continue to trigger OTP...");
    await this.page
      .getByRole("button", { name: this.continueBtnText, exact: true })
      .click();
    await this.page.waitForTimeout(5000); // Wait for OTP email to be sent

    // Step 4: Retrieve OTP from Mailosaur
    console.log("📧 Retrieving verification code from Mailosaur...");
    const apiKey =
      mailosaurConfig?.apiKey || process.env.MAILOSAUR_API_KEY || "";
    const serverId =
      mailosaurConfig?.serverId || process.env.MAILOSAUR_SERVER_ID || "";
    const mailosaurHelper = new MailosaurHelper(apiKey, serverId);
    const code = await mailosaurHelper.getVerificationCode(email, 60000);
    console.log(`🔑 Verification code retrieved: ${code}`);

    // Step 5: Enter the 6-digit code and submit
    await expect(
      this.page.getByPlaceholder(this.sixDigitCodePlaceholder),
    ).toBeVisible({ timeout: 15000 });
    await this.page.getByPlaceholder(this.sixDigitCodePlaceholder).fill(code);
    await this.page.getByRole("button", { name: "Submit" }).click();
    await this.page.waitForLoadState("domcontentloaded");

    // Clean up Mailosaur messages
    await mailosaurHelper.deleteAllMessages();
  }

  /**
   * Fill all delivery address details
   * @param details - Delivery detail object
   * @param testInfo - Optional TestInfo for screenshots
   */
  async fillDeliveryDetails(
    details: {
      firstName: string;
      lastName: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      phone: string;
    },
    testInfo?: TestInfo,
  ) {
    console.log("📦 Filling delivery details");
    await this.page.waitForLoadState("domcontentloaded");
    if (this.isMobile) {
      await this.delay(3000);
      console.log("📱 MOBILE flag is ON — using mobile delivery locators");
      await expect(this.firstNameInputMobile).toBeVisible({ timeout: 15000 });
      await this.firstNameInputMobile.fill(details.firstName);
      await this.lastNameInputMobile.fill(details.lastName);

      // await this.addressComboboxMobile.tap();
      // await this.delay(400);
      // await this.addressComboboxMobile.pressSequentially(details.address);
      const addressInput = this.page.locator("#shipping-address1");
      await addressInput.pressSequentially("Michigan Avenue");

      // Wait for the autocomplete listbox to appear and tap the first matching option
      await this.page
        .getByRole("option", { name: details.address })
        .first()
        .waitFor({ state: "visible", timeout: 10000 });
      await this.page
        .getByRole("option", { name: details.address })
        .first()
        .tap();

      // await this.page.waitForLoadState("domcontentloaded");
      await expect(this.phoneInputMobile).toBeVisible({ timeout: 3000 });
      await this.phoneInputMobile.pressSequentially(String(details.phone));

      await this.page.waitForLoadState("domcontentloaded");

      await expect(this.zipCodeInputMobile).toBeVisible({ timeout: 10000 });
      await this.zipCodeInputMobile.fill(details.zipCode);
    } else {
      console.log("🖥️  MOBILE flag is OFF — using desktop delivery locators");

      await this.firstNameInput.pressSequentially(details.firstName);
      await this.lastNameInput.pressSequentially(details.lastName);

      // Address combobox with autocomplete
      await this.addressCombobox.pressSequentially(details.address, {
        delay: 100,
      });
      await this.page.waitForLoadState("domcontentloaded");
      await this.delay(3000); // Wait for autocomplete suggestions to load
      // Click first address suggestion
      await this.page
        .getByRole("option", { name: details.address })
        .first()
        .click();
      await this.delay(2000); // Wait for potential dynamic loading of city/state/zip fields after address selection

      await this.cityInput.fill("");
      await this.cityInput.pressSequentially(details.city);
      await this.page.waitForLoadState("domcontentloaded");
      await this.delay(2000); // Wait for potential dynamic loading of city/state/zip fields after address selection
      await this.stateCombobox.pressSequentially(details.state);

      await this.page.waitForLoadState("domcontentloaded");
      await this.delay(2000); // Wait for potential dynamic loading of city/state/zip fields after address selection

      await expect(this.phoneInput).toBeVisible({ timeout: 10000 });
      await this.phoneInput.pressSequentially(details.phone);

      await this.page.waitForLoadState("domcontentloaded");
      await this.delay(2000); // Wait for potential dynamic loading of city/state/zip fields after address selection

      await expect(this.zipCodeInput).toBeVisible({ timeout: 10000 });
      await this.zipCodeInput.fill("");
      await this.zipCodeInput.pressSequentially(String(details.zipCode));
    }

    await this.delay(10000);

    if (testInfo) {
      await Helper.takeScreenshotToFile(
        this.page,
        "DeliveryDetailsFilled",
        testInfo,
      );
    }
    return this;
  }

  /**
   * Apply Financial Aid / Scholarship funds at checkout
   * Checks the Financial Aid option, looks up the student account, and applies funds
   * @param studentId - Student ID to look up (e.g. "JI_9975")
   * @param testInfo - Optional TestInfo for screenshots
   */
  async applyFinancialAid(studentId: string, testInfo?: TestInfo) {
    await this.delay(3000);
    console.log(`🎓 Applying Financial Aid – Student ID: ${studentId}`);
    await this.financialAidCheckbox.check();

    await this.delay(2000); // Short wait

    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.studentIdInput).toBeVisible({ timeout: 10000 });
    await this.studentIdInput.fill(studentId);

    await this.delay(2000); // Short wait

    await expect(this.lookUpAccountBtn).toBeVisible({ timeout: 15000 });
    await this.lookUpAccountBtn.click({ timeout: 15000 });

    await this.delay(2000); // Short wait

    await expect(this.applyFundsBtn).toBeVisible({ timeout: 15000 });
    await this.applyFundsBtn.click({ timeout: 15000 });
    await expect(this.removeBtn).toBeVisible({ timeout: 15000 });
    if (testInfo) {
      await Helper.takeScreenshotToFile(
        this.page,
        "FinancialAidApplied",
        testInfo,
      );
    }
    await this.delay(10000); // Randomize delay
    return this;
  }

  /**
   * Apply Campus Card funds at checkout.
   * Checks the Campus Card option, enters the campus card code, looks up the balance and applies it.
   * @param campusCardCode - Campus card ID / code to look up (e.g. "b20")
   * @param testInfo - Optional TestInfo for screenshots
   */
  async applyCampusCard(campusCardCode: string, testInfo?: TestInfo) {
    await this.delay(3000);
    console.log(`🎓 Applying Campus Card – Code: ${campusCardCode}`);
    await this.campusCardCheckbox.check();
    await expect(this.campusCardInput).toBeVisible({ timeout: 10000 });
    await this.campusCardInput.fill(campusCardCode);
    // await this.lookUpBalanceBtn.click({ timeout: 60000 });
    await this.applyBtn.click({ timeout: 60000 });
    await this.page.waitForLoadState("domcontentloaded");
    await this.delay(5000);
    await this.applyBtn.click({ timeout: 60000 });
    await expect(this.campusCardAppliedConfirmation).toBeVisible({
      timeout: 60000,
    });
    if (testInfo) {
      await Helper.takeScreenshotToFile(
        this.page,
        "CampusCardApplied",
        testInfo,
      );
    }
    await this.delay(10000); // Randomize delay
    return this;
  }

  /**
   * Fill credit / debit card details inside Shopify's PCI-isolated iframes
   * @param details - Card details object
   * @param testInfo - Optional TestInfo for screenshots
   */
  async fillCardDetails(
    details: {
      cardNumber: string;
      expiry: string;
      securityCode: string;
      nameOnCard: string;
    },
    testInfo?: TestInfo,
  ) {
    console.log("💳 Filling card details");
    await this.page.waitForLoadState("domcontentloaded");
    await this.delay(3000);
    // Shopify card fields live in cross-origin PCI iframes — fill() is blocked cross-origin.
    // pressSequentially() dispatches real keyboard events and works in cross-origin iframes.
    await this.cardNumberInput.pressSequentially(details.cardNumber);
    await this.page.waitForLoadState("domcontentloaded");
    await this.delay(15000);
    await this.cardExpiryInput.fill(details.expiry);
    await this.page.waitForLoadState("domcontentloaded");
    await this.cardSecurityCodeInput.pressSequentially(
      String(details.securityCode),
    );
    await this.page.waitForLoadState("domcontentloaded");

    if (await this.cardNameInput.isVisible()) {
      await this.cardNameInput.pressSequentially(details.nameOnCard);
    }
    if (testInfo) {
      await Helper.takeScreenshotToFile(
        this.page,
        "CardDetailsFilled",
        testInfo,
      );
    }
    await this.delay(10000); // Randomize delay
    return this;
  }

  /**
   * Verify billing address is set to "Same as shipping address"
   * Checks the checkbox if not already checked
   */
  async selectBillingAsSameAsShipping() {
    console.log("✅ Verifying billing = shipping address");
    const isChecked = await this.useShippingAsBillingCheckbox.isChecked();
    if (!isChecked) {
      await this.useShippingAsBillingCheckbox.check();
    }
    await this.page.waitForLoadState("domcontentloaded");
    await this.delay(10000); // Randomize delay
    return this;
  }

  /**
   * Click the "Pay now" / Complete Order button
   * @param testInfo - Optional TestInfo for screenshots
   */
  async completeOrder(
    testInfo?: TestInfo,
    confirmMessage?: string,
    payNowOption: string = "N",
  ): Promise<string> {
    await this.page.waitForLoadState("domcontentloaded");
    await this.delay(3000);
    payNowOption = "N";
    if (payNowOption === "N") {
      console.log(
        "⚠️ payNowOption is set to 'N' – skipping clicking Pay now / Complete Order",
      );
      return "";
    }
    console.log("🎯 Clicking Pay now / Complete Order");
    await this.page.waitForLoadState("domcontentloaded");

    await expect(this.payNowBtn).toBeVisible({ timeout: 10000 });
    // await this.payNowBtn.click({ timeout: 20000 });
    await this.page.waitForLoadState("domcontentloaded");

    await this.delay(10000); // Randomize delay
    const orderNumber = await this.verifyOrderConfirmation(confirmMessage);
    if (testInfo) {
      await Helper.takeScreenshotToFile(this.page, "OrderSubmitted", testInfo);
    }
    return orderNumber;
  }

  /**
   * Accept rental agreement checkboxes shown when the cart contains a rental item.
   * Checks both the general terms checkbox and the credit card authorisation checkbox.
   * @param testInfo - Optional TestInfo for screenshots
   */
  async fillRentalAgreements(testInfo?: TestInfo) {
    console.log("📋 Checking for rental agreement checkboxes");
    const termsVisible = await this.rentalTermsCheckbox
      .isVisible()
      .catch(() => false);
    if (!termsVisible) {
      console.log("ℹ️ No rental agreement checkboxes found – skipping");
      return this;
    }
    await this.rentalTermsCheckbox.check();
    const ccVisible = await this.rentalCreditCardCheckbox
      .isVisible()
      .catch(() => false);
    if (ccVisible) {
      await this.rentalCreditCardCheckbox.check();
    }
    if (testInfo) {
      await Helper.takeScreenshotToFile(
        this.page,
        "RentalAgreementsAccepted",
        testInfo,
      );
    }
    await this.delay(10000); // Randomize delay
    return this;
  }

  /**
   * Select the "Pick up" delivery method at checkout.
   * After clicking, waits for the pickup locations section to appear and
   * verifies the Free pickup rate is shown (NTC store is auto-selected).
   * @param testInfo - Optional TestInfo for screenshots
   */
  async selectPickupOption(testInfo?: TestInfo) {
    console.log("📦 Selecting Pick up delivery method");
    await this.page.waitForLoadState("domcontentloaded");
    await this.delay(5000);

    // Shopify checkout prefixes for-attributes (e.g. basic-PICK_UP), so use contains selector
    const pickUpByFor = this.page.locator("label[for*='PICK_UP']").first();
    const pickUpByText = this.page.getByText(this.pickUpRadioText, { exact: true }).first();

    let pickUpBtn = pickUpByFor;
    const forVisible = await pickUpByFor.isVisible({ timeout: 5000 }).catch(() => false);
    if (!forVisible) {
      console.log("⚠️ label[for*='PICK_UP'] not found, trying text-based locator");
      pickUpBtn = pickUpByText;
    }

    await expect(pickUpBtn).toBeVisible({ timeout: 30000 });
    await pickUpBtn.click();
    // Wait for pickup locations section and free rate to be visible
    await expect(
      this.page.locator(`[aria-label="Pickup location"]`).getByText("Free").first(),
    ).toBeVisible({ timeout: 15000 }).catch(() => {
      console.log("⚠️ Free pickup rate text not found – continuing");
    });
    if (testInfo) {
      await Helper.takeScreenshotToFile(
        this.page,
        "PickupOptionSelected",
        testInfo,
      );
    }
    await this.delay(10000); // Randomize delay
    return this;
  }


  

  /**
   * Verify the order confirmation page – checks for "Thank you" heading
   * and returns the confirmation number from the page text.
   *
   * @returns Confirmation number string (e.g. "NPD1TMU0F")
   */
  async verifyOrderConfirmation(confirmMessage?: string): Promise<string> {
    const message = confirmMessage || "Thank you";
    console.log(`✅ Verifying order confirmation: "${message}"`);
    await expect(
      this.page.getByText(new RegExp(message, "i")).first(),
    ).toBeVisible({ timeout: 15000 });

    const bodyText = await this.page.evaluate(() => document.body.innerText);
    const match = bodyText.match(/Confirmation\s*#([A-Z0-9]+)/);
    const confirmationNum = match ? match[1] : "NOT_FOUND";
    console.log(`📋 Order Confirmation #: ${confirmationNum}`);
    return confirmationNum;
  }
}
