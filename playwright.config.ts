import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig, cucumberReporter } from "playwright-bdd";
import path from "path";
import dotenv from "dotenv";

// Load Shopify crawler signature and other API env vars
dotenv.config({ path: path.join(__dirname, "api.env"), quiet: true });

export const STORAGE_STATE = path.join(__dirname, "playwright/.auth/user.json");

/** True when MOBILE=true env var is set — mirrors the same flag used in BasePage */
const isMobile: boolean = (process.env.MOBILE ?? "").trim() === "true";
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenvcls
 */
// require('dotenv').config();

// const testDir = defineBddConfig({
//   paths: ['./tests/features/SAP/sap-sales-order.feature'],
//   require: ['./stepdef/SAP/*.ts']
// })

const testDir = defineBddConfig({
  paths: ["./tests/features/**/*.feature"],
  require: ["./stepdef/**/**/*.ts"],
});

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  /* Un-comment below line if following TDD pattern and comment the line below that*/
  testDir: "./tests/tdd/",
  // testMatch: '**/TMSHOP-376.spec.ts',
  // testDir,
  /* Playwright raw output (videos/screenshots before fixture moves them) goes here.
     Our structured output lands in test-results/<storeId>/<testCaseId>/ via fixtures.ts */
  outputDir: ".playwright-tmp/",
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 0 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : isMobile ? 1 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    cucumberReporter("html", {
      outputFile: "cucumber-report/cucumber-html-report.html",
      externalAttachments: true,
    }),
    cucumberReporter("json", {
      outputFile: "cucumber-report/cucumber-report.json",
    }),
    ["junit", { outputFile: "./notify-results/test-results.xml" }],
    ["./utils/per-test-html-reporter.ts"],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "https://bkstr-0125.myshopify.com/",
    //baseURL: 'https://www.saucedemo.com',
    //  baseURL: 'https://login.salesforce.com',
    //baseURL: 'https://in-blr-s30.corp.capgemini.com:8001/sap/bc/ui2/flp',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    launchOptions: {
      // 1
      args: [
        "--start-maximized",
        "--disable-blink-features=AutomationControlled",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
      ],
    },
    // 2},
    screenshot: "on",
    video: "on",
    ignoreHTTPSErrors: true, // Ignore HTTPS certificate errors
    // Shopify Web Bot Auth — authorises this automation as a verified crawler.
    // // Signature expires ~2026-06-02. Rotate via the Shopify partner dashboard.
    // extraHTTPHeaders: {
    //   'Signature-Input': process.env.SHOPIFY_SIGNATURE_INPUT ?? '',
    //   'Signature': process.env.SHOPIFY_SIGNATURE ?? '',
    //   'Signature-Agent': process.env.SHOPIFY_SIGNATURE_AGENT ?? '',
    // },
  },
  timeout: 660000,
  /* Configure projects for major browsers */
  projects: [
    {
      name: "setup",
      testMatch: /global\.setup\.ts/,
      //teardown: 'close',
    },
    //{
    //name: 'close',
    //testMatch: /global\.teardown\.ts/,
    // //},
    //   {
    //   name: 'Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' }
    // },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], channel: "chromium" },
    },
    // Active project is selected by the MOBILE env var (same flag used in BasePage.isMobile)
    // ...(isMobile
    //   ? [
    //       {
    //         name: 'Mobile Safari - iPhone 14',
    //         use: { ...devices['iPhone 14'] },
    //       },
    //     ]
    //   : [
    //       {
    //         name: 'Google Chrome',
    //         use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    //       },
    //     ]),
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
