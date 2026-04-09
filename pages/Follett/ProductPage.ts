import { Page, Locator } from "playwright";
import { expect, TestInfo } from "playwright/test";
import { Helper } from "../../utils/helper";
import { BasePage } from "../basePage";
import testData, { isEnabled } from "../../utils/excelToTestData";

/**
 * Follett Bookstore - Product Search & Product Detail Page Object Model
 *
 * Handles search bar interaction and product detail page (Add to Cart)
 *
 * @class FollettProductPage
 */
export class FollettProductPage extends BasePage {
  // Locators – Search (Desktop)
  readonly searchComboboxDesktop: Locator;
  // Locators – Search (Mobile) — id found via Safari Web Inspector on the hidden input revealed by the search icon
  readonly searchComboboxMobile: Locator;
  readonly productLoadingSpinner: Locator;

  // Locators – Product Detail
  readonly addToCartBtn: Locator;
  readonly addToCartBtnMobile: Locator;
  readonly checkoutBtn: Locator;

  // Locators – Format Tabs (Print / Digital)
  readonly printFormatTab: Locator;
  readonly digitalFormatTab: Locator;

  // Locators – Cart
  readonly cartItemCountBtn: Locator;
  readonly closeCartDrawerBtn: Locator;

  /**
   * Constructor – initialise all locators
   * @param page - Playwright Page instance
   */
  constructor(page: Page, testId: string) {
    super(page);
    console.log("🚀 Initialising FollettProductPage");
    const td = testData[testId] ?? {};
    const checkoutText = td.checkoutText ?? "Check out";
    const searchLabel = td.searchLabel ?? "Search";
    const addToCartText = td.addToCartText ?? "Add to cart";
    const printFormatText = td.printFormatText ?? "Print";
    const digitalFormatText = td.digitalFormatText ?? "Digital";

    this.searchComboboxDesktop = page.getByRole("combobox", {
      name: searchLabel,
    });
    this.searchComboboxMobile = page.locator("#search-mobile-");
    this.productLoadingSpinner = page.locator(".monetate-recs__loader-text");
    this.addToCartBtn = page.getByRole("button", {
      name: new RegExp(addToCartText, "i"),
    });
    this.addToCartBtnMobile = page.locator(
      `[class="button add-to-cart-button button"]`,
    );
    // this.checkoutBtn = page.getByRole("button", { name: "Check out" });
    this.checkoutBtn = page.getByRole("button", { name: checkoutText });
    this.printFormatTab = page.getByRole("button", { name: printFormatText });
    this.digitalFormatTab = page.getByRole("button", {
      name: digitalFormatText,
    });
    this.cartItemCountBtn = page.getByRole("button", {
      name: /Total items in cart: \d+/,
    });
    this.closeCartDrawerBtn = page.locator(
      `#cart-drawer-header button[ref="closeButton"]`,
    );
  }

  /**
   * Search for a product and click the first suggestion
   * @param productName - Product search term (e.g. "BOTTLE/NALG")
   * @param testInfo - Optional TestInfo for screenshots
   */
  async searchAndSelectProduct(
    productName: string,
    testInfo?: TestInfo,
    link: string = "",
  ) {
    console.log(`🔍 Searching for product: ${productName}`);

    await this.delay(5000);
    await this.page.waitForLoadState("domcontentloaded");

    // Mobile flow
    if (this.isMobile) {
      console.log("📱 MOBILE flag is ON — using mobile search");
      await this.page.goto(link);
    } else {
      // Desktop flow
      console.log("🖥️ MOBILE flag is OFF — using desktop search locator");

      await expect(this.searchComboboxDesktop).toBeVisible({ timeout: 20000 });
      await this.searchComboboxDesktop.click();

      await this.delay(2000);

      await expect(this.searchComboboxDesktop).toBeEnabled({ timeout: 20000 });
      await this.searchComboboxDesktop.pressSequentially(productName, {
        delay: 100,
      });
    }

    // Wait for suggestions to appear
    await this.page.waitForLoadState("domcontentloaded");
    await this.delay(5000);

    if (!this.isMobile) {
      console.log("Using Desktop Locators - Search");
      // Desktop suggestion locators
      const firstSuggestionDesktop = this.page
        .locator("#predictive-search-products")
        .getByRole("link", { name: productName })
        .first();

      let fallbackSuggestion: Locator;

      if (/^\d+$/.test(productName)) {
        console.log("productName contains only numbers");
        fallbackSuggestion = this.page
          .locator(".product-title-container")
          // .getBRole("link", { name: productName })
          .first();
      } else {
        fallbackSuggestion = this.page
          .locator(".product-title-container", { hasText: productName })
          // .getByRole("link", { name: productName })
          .first();
      }
      // Try clicking the first suggestion
      const firstVisible = await firstSuggestionDesktop
        .isVisible({ timeout: 3000 })
        .catch(() => false);

      if (firstVisible) {
        await firstSuggestionDesktop.click();
        await this.delay(5000);
        console.log("Clicked first suggestion");
      } else {
        await this.page.keyboard.press("Enter");
        await this.page.waitForLoadState("domcontentloaded");
        const pdpVisible = await this.addToCartBtn
          .isVisible({ timeout: 3000 })
          .catch(() => false);

        if (pdpVisible) {
          console.log("Direct PDP page visible");
        } else {
            await fallbackSuggestion.click();
            console.log("Clicked fallback suggestion");
            await this.page.waitForLoadState("domcontentloaded");
            await this.delay(5000);
        }
      }
    }

    await this.delay(5000);
    await this.page.waitForLoadState("domcontentloaded");

    // Validate landing on correct PDP (soft check – log warning instead of failing)
    if (!/^\d+$/.test(productName)) {
      const headingLocator = this.page.getByRole("heading", {
        name: new RegExp(
          productName.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&"),
          "i",
        ),
      });
      const headingVisible = await headingLocator
        .isVisible({ timeout: 10000 })
        .catch(() => false);
      if (!headingVisible) {
        console.log(
          `⚠️ PDP heading matching "${productName}" not found – continuing (page may use a different title)`,
        );
      }
    }
    // Attach screenshot if provided
    if (testInfo) {
      await Helper.takeScreenshotToFile(this.page, "ProductSelected", testInfo);
    }

    await this.delay(10000);
    return this;
  }

  /**
   * Click the "Add to cart" button on the product detail page
   * @param testInfo - Optional TestInfo for screenshots
   */
  async addToCart(testInfo?: TestInfo) {
    console.log("🛒 Adding product to cart");

    if (this.isMobile) {
      await expect(this.addToCartBtnMobile).toBeVisible({ timeout: 10000 });
      await this.addToCartBtnMobile.click();
    } else {
      await expect(this.addToCartBtn).toBeVisible({ timeout: 10000 });
      await this.addToCartBtn.click();
    }
    // await expect(this.cartItemCountBtn).toBeVisible({ timeout: 20000 });
    await expect(this.checkoutBtn).toBeVisible({ timeout: 20000 });

    if (testInfo) {
      await Helper.takeScreenshotToFile(this.page, "ItemAddedToCart", testInfo);
    }
    await this.delay(10000); // Randomize delay
    return this;
  }

  /**
   * Click the "Check out" button inside the cart drawer
   * @param testInfo - Optional TestInfo for screenshots
   */
  async clickCheckout(testInfo?: TestInfo) {
    console.log("💳 Clicking Check out");
    await expect(this.checkoutBtn).toBeVisible({ timeout: 10000 });
    await this.checkoutBtn.click();
    await this.page.waitForLoadState("domcontentloaded");
    // // if (testInfo) {
    // //   await Helper.takeScreenshotToFile(
    // //     this.page,
    // //     "CheckoutClicked",
    // //     testInfo,
    // //   );
    // // }
    // return this;
    await this.delay(10000); // Randomize delay
  }

  /**
   * Select the product format tab (Print or Digital)
   * Clicks the accordion tab identified by data-testid="accordion-variant-picker-{format}"
   * @param format - 'print' | 'digital'
   * @param testInfo - Optional TestInfo for screenshots
   */
  async selectFormat(format: string, condition: string, testInfo?: TestInfo) {
    console.log(`📚 Selecting product format: ${format}`);
    // const tab =
    //   format === "print" ? this.printFormatTab : this.digitalFormatTab;
    // await expect(tab).toBeVisible({ timeout: 10000 });
    // await tab.click();
    console.log(`🏷️  Selecting condition: ${condition}`);
    // this.page.locator(`.material-item [data-format="${format}"]`).first().click();
    const conditionLabel = this.page
      .locator(`[data-format-specific="${format}"]`)
      // .locator(".purchase-type ")
      .filter({ hasText: new RegExp(condition, "i") })
      .locator("label")
      .first();
    await expect(conditionLabel).toBeVisible({ timeout: 10000 });
    await conditionLabel.click();
    // await expect(this.addToCartBtn).toBeEnabled({ timeout: 10000 });
    // // if (testInfo) {
    // //   await Helper.takeScreenshotToFile(
    // //     this.page,
    // //     `ConditionSelected_${condition.replace(/\s+/g, "_")}`,
    // //     testInfo,
    // //   );
    // // }
    await this.delay(10000); // Randomized delay
    return this;
  }

  /**
   * Select a product format on the prod store (ntc.bkstr.com) using the
   * accordion variant picker data-testid attribute.
   * @param format - 'print' | 'digital'
   * @param testInfo - Optional TestInfo for screenshots
   */
  async selectProdFormat(format: string, testInfo?: TestInfo) {
    console.log(`📚 Selecting prod format: ${format}`);
    await this.page.waitForLoadState("domcontentloaded");

    const accordion = this.page.locator(
      `[data-testid="accordion-variant-picker-${format}"]`,
    );
    await accordion.waitFor({ state: "attached", timeout: 30000 });
    await accordion.scrollIntoViewIfNeeded();
    await expect(accordion).toBeVisible({ timeout: 20000 });

    const label = accordion.locator("label");
    const isLabelVisible = await label.isVisible().catch(() => false);
    if (!isLabelVisible) {
      await accordion.click();
    }
    await expect(label).toBeVisible({ timeout: 10000 });
    await label.click();
    if (testInfo) {
      await Helper.takeScreenshotToFile(
        this.page,
        `ProdFormatSelected_${format}`,
        testInfo,
      );
    }
    await this.delay(10000); // Short delay
    return this;
  }

  /**
   * Navigate via the "Shop By" top-nav link to a category page
   * @param category - Category link text (e.g. "Clothing & Accessories")
   * @param testInfo - Optional TestInfo for screenshots
   */
  async navigateShopBy(category: string, testInfo?: TestInfo) {
    await this.delay(10000); // Short delay before navigation
    console.log(`🏬 Navigating Shop By → ${category}`);
    await this.page.getByRole("link", { name: "Shop By" }).click();
    await this.page.getByRole("link", { name: category, exact: true }).click();
    await this.page.waitForLoadState("domcontentloaded");
    if (testInfo) {
      await Helper.takeScreenshotToFile(
        this.page,
        `ShopBy_${category.replace(/\s+/g, "_")}`,
        testInfo,
      );
    }
    await this.delay(10000); // Randomized delay
    return this;
  }

  /**
   * Select a product from the course results page by name, then select its
   * format and condition. Combines navigation to the product detail page with
   * the existing format/condition selection logic.
   *
   * @param productName - Partial or full product name to match on the results page
   * @param format      - 'print' | 'digital'
   * @param condition   - e.g. 'Buy New', 'Buy Used', 'Rent New'
   * @param testInfo    - Optional TestInfo for screenshots
   */
  async selectFormatByProduct(
    productName: string,
    format: string,
    condition: string,
    testInfo?: TestInfo,
  ) {
    console.log(`📖 Navigating to product: "${productName}"`);
    await this.page.waitForLoadState("domcontentloaded");

    const escapedName = productName.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&");
    const productTab = this.page
      .locator(`.material-item`)
      .filter({ hasText: new RegExp(escapedName, "i") });
    const formatTab = productTab.locator(`[data-format="${format}" i]`).first();
    const formatVisible = await formatTab
      .isVisible({ timeout: 10000 })
      .catch(() => false);
    if (formatVisible) {
      await formatTab.click();
      console.log(`📑 Clicked format tab: ${format}`);
    } else {
      console.log(
        `⚠️ Format tab [data-format="${format}"] not found – product may only have one format, continuing`,
      );
    }
    await this.delay(5000); // Randomized delay

    console.log(`🏷️  Selecting format: ${format} / condition: ${condition}`);
    const conditionLabel = productTab
      .locator(".purchase-type")
      .filter({ hasText: new RegExp(condition, "i") })
      .locator("label")
      .first();
    await expect(conditionLabel).toBeVisible({ timeout: 30000 });
    await conditionLabel.click();
    await this.delay(5000); // Randomized delay
    // await expect(this.addToCartBtn).toBeEnabled({ timeout: 10000 });
    await this.page.waitForLoadState("domcontentloaded");
    await this.delay(10000); // Randomized delay
    return this;
  }

  /**
   * Select a product from a category listing page.
   * Uses JavaScript click to bypass any image overlay intercepting pointer events.
   * @param productName - Partial or full product name to match
   * @param testInfo - Optional TestInfo for screenshots
   */
  async selectProductFromCategory(
    productName: string = "",
    testInfo?: TestInfo,
  ) {
    console.log(`🛍️  Selecting product from category: ${productName}`);
    // const productLink = this.page.getByRole('link', { name: new RegExp(productName, 'i') }).first();

    if (productName == "" || productName == null) {
      console.log(
        "Product name is empty or null, clicking the first product in the listing",
      );
      const firstProduct = this.page
        .locator(".product-title-container")
        .first();
      await expect(firstProduct).toBeVisible({ timeout: 10000 });
      await firstProduct.click();
    } else {
      const productLink = this.page
        .locator(".product-card p")
        .filter({ hasText: productName })
        .first();
      await expect(productLink).toBeVisible({ timeout: 10000 });
      // JS click bypasses image-overlay pointer-events blocking
      await productLink.click();
    }
    await this.page.waitForLoadState("domcontentloaded");
    if (testInfo) {
      await Helper.takeScreenshotToFile(
        this.page,
        `ProductSelected_${productName.replace(/\s+/g, "_")}`,
        testInfo,
      );
    }
    await this.delay(10000); // Randomized delay
    return this;
  }

  async closeCartDrawer(testInfo?: TestInfo) {
    console.log("❌ Closing cart drawer");
    await expect(this.closeCartDrawerBtn).toBeVisible({ timeout: 10000 });
    await this.closeCartDrawerBtn.click();
    await this.page.waitForLoadState("domcontentloaded");
  }
}
