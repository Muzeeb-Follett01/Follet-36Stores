import { Page, Locator } from "playwright";
import { expect, TestInfo } from "playwright/test";
import { Helper } from "../../utils/helper";
import { BasePage } from "../basePage";
import testData from "../../utils/excelToTestData";

/**
 * Follett Bookstore – Home Page Object Model
 *
 * Handles header navigation, footer links, email sign-up,
 * and terms & conditions link verification.
 *
 * @class FollettHomePage
 */
export class FollettHomePage extends BasePage {
  // --- Header Navigation Links ---
  readonly newArrivalsLink: Locator;
  readonly menLink: Locator;
  readonly womenLink: Locator;
  readonly headwearLink: Locator;
  readonly giftsLink: Locator;
  readonly textbooksLink: Locator;

  // --- Footer Support Links ---
  readonly trackAnOrderLink: Locator;
  readonly deliveryOptionsLink: Locator;
  readonly paymentsAcceptedLink: Locator;
  readonly returnsLink: Locator;
  readonly helpFaqLink: Locator;
  readonly accessibilityLink: Locator;

  // --- Footer Textbooks Links ---
  readonly findYourTextbooksLink: Locator;
  readonly sellYourTextbooksLink: Locator;
  readonly textbookFaqsLink: Locator;
  readonly priceMatchGuaranteeLink: Locator;
  readonly registerForTextRentalLink: Locator;

  // --- Footer Company Links ---
  readonly viewStoreHoursLink: Locator;
  readonly contactStoreLink: Locator;

  // --- Email Sign-Up ---
  readonly emailSignUpInput: Locator;
  readonly subscribeBtn: Locator;
  readonly subscribedConfirmation: Locator;

  // --- Terms & Conditions (bottom footer) ---
  readonly termsOfUseLink: Locator;
  readonly privacyPolicyLink: Locator;
  readonly doNotSellMyInfoLink: Locator;
  readonly cookiePreferencePolicyLink: Locator;

  // --- Shop By Taxonomy Links ---
  readonly shopByLink: Locator;
  readonly shopByTextbooks: Locator;
  readonly shopByClothingAccessories: Locator;
  readonly shopByGiftsCollectibles: Locator;
  readonly shopByElectronics: Locator;
  readonly shopBySchoolSupplies: Locator;
  readonly shopByDormHome: Locator;
  readonly shopByFeaturedBrands: Locator;
  readonly shopByHealthWellnessBeauty: Locator;
  readonly shopByBooksMusicGames: Locator;
  readonly shopBySaleClearance: Locator;

  // --- Store Logo / Home ---
  readonly storeLogoLink: Locator;

  /**
   * Constructor – initialise all locators
   * @param page - Playwright Page instance
   */
  constructor(page: Page, testId: string) {
    super(page);
    console.log("🚀 Initialising FollettHomePage");
    const td = testData[testId] ?? {};
    // Header links
    const newArrivalsLinkText = td.newArrivalsLinkText ?? "New Arrivals";
    const menLinkText = td.menLinkText ?? "Men";
    const womenLinkText = td.womenLinkText ?? "Women";
    const headwearLinkText = td.headwearLinkText ?? "Headwear";
    const giftsLinkText = td.giftsLinkText ?? "Gifts";
    const homeTextbooksLinkText = td.homeTextbooksLinkText ?? "Textbooks";
    // Footer support links
    const trackAnOrderLinkText = td.trackAnOrderLinkText ?? "Track an Order";
    const deliveryOptionsLinkText =
      td.deliveryOptionsLinkText ?? "Delivery Options";
    const paymentsAcceptedLinkText =
      td.paymentsAcceptedLinkText ?? "Payments Accepted";
    const returnsLinkText = td.returnsLinkText ?? "Returns";
    const helpFaqLinkText = td.helpFaqLinkText ?? "Help/FAQ";
    const accessibilityLinkText = td.accessibilityLinkText ?? "Accessibility";
    // Footer textbooks links
    const findYourTextbooksLinkText =
      td.findYourTextbooksLinkText ?? "Find Your Textbooks";
    const sellYourTextbooksLinkText =
      td.sellYourTextbooksLinkText ?? "Sell Your Textbooks";
    const textbookFaqsLinkText = td.textbookFaqsLinkText ?? "Textbook FAQs";
    const priceMatchGuaranteeLinkText =
      td.priceMatchGuaranteeLinkText ?? "Price Match Guarantee";
    const registerForTextRentalLinkText =
      td.registerForTextRentalLinkText ?? "Register for Text Rental";
    // Footer company links
    const viewStoreHoursLinkText =
      td.viewStoreHoursLinkText ?? "View Store Hours";
    const contactStoreLinkText = td.contactStoreLinkText ?? "Contact Store";
    // Email sign-up
    const emailSignUpLabel = td.emailSignUpLabel ?? "Email address";
    const subscribeBtnText = td.subscribeBtnText ?? "Subscribe";
    const subscribedConfirmationText =
      td.subscribedConfirmationText ?? "Thanks for subscribing";
    // Terms & Conditions
    const termsOfUseLinkText = td.termsOfUseLinkText ?? "Terms of Use";
    const privacyPolicyLinkText = td.privacyPolicyLinkText ?? "Privacy Policy";
    const doNotSellMyInfoLinkText =
      td.doNotSellMyInfoLinkText ?? "Do Not Sell My Info";
    const cookiePreferencePolicyLinkText =
      td.cookiePreferencePolicyLinkText ?? "Cookie Preference Policy";
    // Store logo
    const storeLogoText = td.storeLogoText ?? "Bookstore";
    // Shop By
    const shopByLinkText = td.shopByLinkText ?? "Shop By";
    const shopByCategoriesLabel = td.shopByCategoriesLabel ?? "Categories";
    const shopByTextbooksText = td.shopByTextbooksText ?? "Textbooks";
    const shopByClothingText = td.shopByClothingText ?? "Clothing";
    const shopByGiftsText = td.shopByGiftsText ?? "Gifts";
    const shopByElectronicsText = td.shopByElectronicsText ?? "Electronics";
    const shopBySchoolSuppliesText =
      td.shopBySchoolSuppliesText ?? "School Supplies";
    const shopByDormHomeText = td.shopByDormHomeText ?? "Dorm & Home";
    const shopByFeaturedBrandsText =
      td.shopByFeaturedBrandsText ?? "Featured Brands";
    const shopByHealthText = td.shopByHealthText ?? "Health";
    const shopByBooksMusicGamesText =
      td.shopByBooksMusicGamesText ?? "Books, Music & Games";
    const shopBySaleClearanceText =
      td.shopBySaleClearanceText ?? "Sale & Clearance";

    // Header links
    this.newArrivalsLink = page
      .getByRole("link", { name: newArrivalsLinkText })
      .first();
    this.menLink = page.getByRole("link", { name: menLinkText }).first();
    this.womenLink = page.getByRole("link", { name: womenLinkText }).first();
    this.headwearLink = page
      .getByRole("link", { name: headwearLinkText })
      .first();
    this.giftsLink = page.getByRole("link", { name: giftsLinkText }).first();
    this.textbooksLink = page
      .getByRole("link", { name: homeTextbooksLinkText })
      .first();

    // Footer Support links
    this.trackAnOrderLink = page.getByRole("link", {
      name: trackAnOrderLinkText,
    });
    this.deliveryOptionsLink = page.getByRole("link", {
      name: deliveryOptionsLinkText,
    });
    this.paymentsAcceptedLink = page.getByRole("link", {
      name: paymentsAcceptedLinkText,
    });
    this.returnsLink = page.getByRole("link", { name: returnsLinkText });
    this.helpFaqLink = page.getByRole("link", { name: helpFaqLinkText });
    this.accessibilityLink = page.getByRole("link", {
      name: accessibilityLinkText,
    });

    // Footer Textbooks links
    this.findYourTextbooksLink = page.getByRole("link", {
      name: findYourTextbooksLinkText,
    });
    this.sellYourTextbooksLink = page.getByRole("link", {
      name: sellYourTextbooksLinkText,
    });
    this.textbookFaqsLink = page.getByRole("link", {
      name: textbookFaqsLinkText,
    });
    this.priceMatchGuaranteeLink = page.getByRole("link", {
      name: priceMatchGuaranteeLinkText,
    });
    this.registerForTextRentalLink = page.getByRole("link", {
      name: registerForTextRentalLinkText,
    });

    // Footer Company links
    this.viewStoreHoursLink = page.getByRole("link", {
      name: viewStoreHoursLinkText,
    });
    this.contactStoreLink = page
      .getByRole("link", { name: contactStoreLinkText })
      .first();

    // Email sign-up
    this.emailSignUpInput = page
      .getByRole("textbox", { name: emailSignUpLabel })
      .last();
    this.subscribeBtn = page.getByRole("button", { name: subscribeBtnText });
    this.subscribedConfirmation = page.getByText(subscribedConfirmationText);

    // Terms & Conditions (bottom footer bar)
    this.termsOfUseLink = page
      .locator("a")
      .filter({ hasText: new RegExp("^" + termsOfUseLinkText + "$") })
      .last();
    this.privacyPolicyLink = page
      .locator("a")
      .filter({ hasText: new RegExp("^" + privacyPolicyLinkText + "$") })
      .last();
    this.doNotSellMyInfoLink = page.getByRole("link", {
      name: new RegExp(doNotSellMyInfoLinkText),
    });
    this.cookiePreferencePolicyLink = page
      .locator("a")
      .filter({
        hasText: new RegExp("^" + cookiePreferencePolicyLinkText + "$"),
      })
      .last();

    // Store logo
    this.storeLogoLink = page
      .getByRole("link", { name: storeLogoText })
      .first();

    // Shop By taxonomy links
    this.shopByLink = page.getByRole("link", { name: shopByLinkText });
    this.shopByTextbooks = page
      .getByLabel(shopByCategoriesLabel)
      .getByRole("link", { name: shopByTextbooksText });
    this.shopByClothingAccessories = page
      .getByLabel(shopByCategoriesLabel)
      .getByRole("link", { name: shopByClothingText })
      .first();
    this.shopByGiftsCollectibles = page
      .getByLabel(shopByCategoriesLabel)
      .getByRole("link", { name: shopByGiftsText })
      .first();
    this.shopByElectronics = page
      .getByLabel(shopByCategoriesLabel)
      .getByRole("link", { name: shopByElectronicsText })
      .first();
    this.shopBySchoolSupplies = page
      .getByLabel(shopByCategoriesLabel)
      .getByRole("link", { name: shopBySchoolSuppliesText })
      .first();
    this.shopByDormHome = page
      .getByLabel(shopByCategoriesLabel)
      .getByRole("link", { name: shopByDormHomeText })
      .first();
    this.shopByFeaturedBrands = page
      .getByLabel(shopByCategoriesLabel)
      .getByRole("link", { name: shopByFeaturedBrandsText })
      .first();
    this.shopByHealthWellnessBeauty = page
      .getByLabel(shopByCategoriesLabel)
      .getByRole("link", { name: shopByHealthText })
      .first();
    this.shopByBooksMusicGames = page
      .getByLabel(shopByCategoriesLabel)
      .getByRole("link", { name: shopByBooksMusicGamesText })
      .first();
    this.shopBySaleClearance = page
      .getByLabel(shopByCategoriesLabel)
      .getByRole("link", { name: shopBySaleClearanceText })
      .first();
  }

  /**
   * Click a header link and verify navigation
   */
  async clickHeaderLink(
    link: Locator,
    expectedText: string,
    testInfo?: TestInfo,
  ) {
    await this.delay(3000);
    console.log(`🔗 Clicking header link: ${expectedText}`);
    await expect(link).toBeVisible({ timeout: 10000 });
    await link.click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForLoadState("load");
    console.log(`✅ Navigated to: ${this.page.url()}`);
    if (testInfo) {
      await Helper.takeScreenshotToFile(
        this.page,
        `Header_${expectedText.replace(/\s+/g, "_")}`,
        testInfo,
      );
    }
    await this.delay(2000);
    return this;
  }

  /**
   * Click a footer link and verify navigation, then go back
   */
  async clickFooterLinkAndGoBack(
    link: Locator,
    expectedText: string,
    testInfo?: TestInfo,
  ) {
    await this.delay(3000);
    console.log(`🔗 Clicking footer link: ${expectedText}`);
    await expect(link).toBeVisible({ timeout: 10000 });
    await link.click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForLoadState("load");
    console.log(`✅ Footer navigated to: ${this.page.url()}`);
    if (testInfo) {
      await Helper.takeScreenshotToFile(
        this.page,
        `Footer_${expectedText.replace(/\s+/g, "_")}`,
        testInfo,
      );
    }
    await this.delay(2000);
    await this.page.goBack();
    await this.page.waitForLoadState("domcontentloaded");
    await this.delay(2000);
    return this;
  }

  /**
   * Verify all header links navigate correctly
   */
  async verifyAllHeaderLinks(baseUrl: string, testInfo?: TestInfo) {
    await this.delay(3000);
    console.log("🔗 Verifying all header links");

    const headerLinks = [
      { link: this.newArrivalsLink, text: "New Arrivals" },
      { link: this.menLink, text: "Men" },
      { link: this.womenLink, text: "Women" },
      { link: this.headwearLink, text: "Headwear" },
      { link: this.giftsLink, text: "Gifts" },
      { link: this.textbooksLink, text: "Textbooks" },
    ];

    for (const { link, text } of headerLinks) {
      await this.clickHeaderLink(link, text, testInfo);
      await this.page.goto(baseUrl);
      await this.page.waitForLoadState("domcontentloaded");
      await this.delay(3000);
    }
    console.log("✅ All header links verified");
    return this;
  }

  /**
   * Verify all footer links navigate correctly
   */
  async verifyAllFooterLinks(baseUrl: string, testInfo?: TestInfo) {
    await this.delay(3000);
    console.log("🔗 Verifying all footer links");

    const footerLinks = [
      { link: this.trackAnOrderLink, text: "Track an Order" },
      { link: this.deliveryOptionsLink, text: "Delivery Options" },
      { link: this.paymentsAcceptedLink, text: "Payments Accepted" },
      { link: this.returnsLink, text: "Returns" },
      { link: this.helpFaqLink, text: "Help/FAQ" },
      { link: this.findYourTextbooksLink, text: "Find Your Textbooks" },
      { link: this.sellYourTextbooksLink, text: "Sell Your Textbooks" },
      { link: this.textbookFaqsLink, text: "Textbook FAQs" },
      {
        link: this.priceMatchGuaranteeLink,
        text: "In-Store Price Match Guarantee",
      },
      {
        link: this.registerForTextRentalLink,
        text: "Register for Text Rental",
      },
      { link: this.viewStoreHoursLink, text: "Store Hours" },
      { link: this.contactStoreLink, text: "Contact" },
    ];

    for (const { link, text } of footerLinks) {
      await this.clickFooterLinkAndGoBack(link, text, testInfo);
    }
    console.log("✅ All footer links verified");
    return this;
  }

  /**
   * Sign up with email
   * @param email - Email address for sign-up
   */
  async signUpWithEmail(email: string, testInfo?: TestInfo) {
    await this.delay(3000);
    console.log(`📧 Signing up with email: ${email}`);
    await expect(this.emailSignUpInput).toBeVisible({ timeout: 10000 });
    await this.emailSignUpInput.fill(email);
    await this.subscribeBtn.click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.delay(5000);
    await expect(this.subscribedConfirmation).toBeVisible({ timeout: 10000 });
    if (testInfo) {
      await Helper.takeScreenshotToFile(this.page, "EmailSignUp", testInfo);
    }
    console.log("✅ Email sign-up confirmed");
    return this;
  }

  /**
   * Verify terms and conditions links open correctly (they open in new tabs)
   */
  async verifyTermsAndConditionsLinks(testInfo?: TestInfo) {
    console.log("🔗 Verifying terms and conditions links");

    // Terms of Use - opens in new tab
    await expect(this.termsOfUseLink).toBeVisible({ timeout: 10000 });
    const [termsPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      this.termsOfUseLink.click(),
    ]);
    await termsPage.waitForLoadState("domcontentloaded");
    expect(termsPage.url()).toContain("terms-of-use");
    await termsPage.close();

    // Privacy Policy - opens in new tab
    await expect(this.privacyPolicyLink).toBeVisible({ timeout: 10000 });
    const [privacyPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      this.privacyPolicyLink.click(),
    ]);
    await privacyPage.waitForLoadState("domcontentloaded");
    expect(privacyPage.url()).toContain("policies");
    await privacyPage.close();

    // Do Not Sell My Info - opens in new tab
    await expect(this.doNotSellMyInfoLink).toBeVisible({ timeout: 10000 });
    const [doNotSellPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      this.doNotSellMyInfoLink.click(),
    ]);
    await doNotSellPage.waitForLoadState("domcontentloaded");
    expect(doNotSellPage.url()).toContain("onetrust");
    await doNotSellPage.close();

    // Cookie Preference Policy - opens OneTrust dialog
    await expect(this.cookiePreferencePolicyLink).toBeVisible({
      timeout: 10000,
    });
    await this.cookiePreferencePolicyLink.click();
    await expect(
      this.page.getByText("Cookie Preference Policy").first(),
    ).toBeVisible({ timeout: 10000 });
    // Close the OneTrust preference center
    const closeBtn = this.page.getByRole("button", {
      name: "Close preference center",
    });
    if (await closeBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await closeBtn.click();
    }

    if (testInfo) {
      await Helper.takeScreenshotToFile(
        this.page,
        "TermsAndConditions",
        testInfo,
      );
    }
    console.log("✅ All terms and conditions links verified");
    return this;
  }

  /**
   * Verify user is on the store homepage
   */
  async verifyOnHomepage() {
    console.log("🏠 Verifying user is on the homepage");
    await expect(this.storeLogoLink).toBeVisible({ timeout: 10000 });
    return this;
  }

  /**
   * Open the "Shop By" dropdown menu
   */
  async clickShopBy() {
    console.log("🔗 Opening Shop By dropdown");
    await this.delay(3000);
    await expect(this.shopByLink).toBeVisible({ timeout: 10000 });
    await this.shopByLink.click();
    await this.delay(1000);
    return this;
  }

  /**
   * Click a Shop By taxonomy link, verify navigation, then return to homepage
   */
  async clickShopByTaxonomyLinkAndGoBack(
    link: Locator,
    expectedText: string,
    baseUrl: string,
    testInfo?: TestInfo,
  ) {
    console.log(`🔗 Clicking Shop By taxonomy link: ${expectedText}`);
    await this.delay(3000);
    await this.clickShopBy();
    await expect(link).toBeVisible({ timeout: 10000 });
    await link.click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForLoadState("load");
    console.log(`✅ ShopBy navigated to: ${this.page.url()}`);
    if (testInfo) {
      await Helper.takeScreenshotToFile(
        this.page,
        `ShopBy_${expectedText.replace(/[\s&,]+/g, "_")}`,
        testInfo,
      );
    }
    await this.delay(2000);
    await this.page.goto(baseUrl);
    await this.page.waitForLoadState("domcontentloaded");
    await this.delay(3000);
    return this;
  }

  /**
   * Verify all Shop By taxonomy category links navigate correctly
   */
  async verifyAllShopByTaxonomyLinks(baseUrl: string, testInfo?: TestInfo) {
    console.log("🔗 Verifying all Shop By taxonomy links");

    const taxonomyLinks = [
      { link: this.shopByTextbooks, text: "Textbooks" },
      { link: this.shopByClothingAccessories, text: "Clothing" },
      { link: this.shopByGiftsCollectibles, text: "Gifts" },
      { link: this.shopByElectronics, text: "Electronics" },
      { link: this.shopBySchoolSupplies, text: "School Supplies" },
      { link: this.shopByDormHome, text: "Dorm" },
      { link: this.shopByFeaturedBrands, text: "Featured Brands" },
      { link: this.shopByHealthWellnessBeauty, text: "Health" },
      { link: this.shopByBooksMusicGames, text: "Books" },
      { link: this.shopBySaleClearance, text: "Sale & Clearance" },
    ];

    for (const { link, text } of taxonomyLinks) {
      await this.clickShopByTaxonomyLinkAndGoBack(
        link,
        text,
        baseUrl,
        testInfo,
      );
    }
    console.log("✅ All Shop By taxonomy links verified");
    return this;
  }
}
