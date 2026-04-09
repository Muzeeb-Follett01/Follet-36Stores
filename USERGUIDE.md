# 📘 User Guide — Playwright Automation Accelerator (Follett Bookstore)

> **Framework:** Playwright + TypeScript + UnifiedMCP AI Integration  
> **Version:** 1.0  
> **Last Updated:** March 2026

---

## 📑 Table of Contents

1. [Framework Overview](#1-framework-overview)
2. [Folder Structure](#2-folder-structure)
3. [Installing Packages](#3-installing-packages)
4. [MCP Configuration (UnifiedMCP)](#4-mcp-configuration-unifiedmcp)
5. [AI Agents — Script Generator](#5-ai-agents--script-generator)
6. [AI Agents — Script Executor & Healer](#6-ai-agents--script-executor--healer)
7. [Excel Test Data Management](#7-excel-test-data-management)
8. [Running Tests](#8-running-tests)
9. [Mobile Testing](#9-mobile-testing)
10. [Reports & Notifications](#10-reports--notifications)
11. [CI/CD Integration](#11-cicd-integration)
12. [Configuration Files Reference](#12-configuration-files-reference)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. Framework Overview

This repository is an **AI-powered Playwright automation accelerator** designed for end-to-end testing of the Follett Bookstore application. It combines:

| Capability             | Details                                                      |
| ---------------------- | ------------------------------------------------------------ |
| **Web Automation**     | Playwright + TypeScript, Page Object Model                   |
| **Mobile Testing**     | BrowserStack real devices + Playwright device emulation      |
| **AI Test Generation** | UnifiedMCP — two-agent model (Generator + Executor/Healer)   |

The base URL under test is `https://9975.qa-bkstr.com/` (Follett QA Bookstore).

---

## 2. Folder Structure

```
follett-bs/
│
├── build/
│   └── index.cjs               ← UnifiedMCP server binary (provided by COE)
│
├── follet-test-steps/
│   └── follett-test-steps.txt  ← Manual test steps used as AI input
│
├── pages/                      ← Page Object Model (POM) files
│   ├── basePage.ts             ← Base class (isMobile flag, screenshot helper)
│   ├── commonPage.ts           ← Shared page actions
│   ├── todoPage.ts             ← Sample page
│   └── Follett/
│       ├── LoginPage.ts        ← Store password + login logic
│       ├── ProductPage.ts      ← Search, format selection, add-to-cart
│       ├── CheckoutPage.ts     ← Checkout form, payment, financial aid
│       ├── CourseBuilderPage.ts
│       └── yopmailPage.ts      ← Email verification via Yopmail
│
├── tests/
│   └── tdd/                    ← TDD test scripts (spec files)
│       ├── TMSHOP-376.spec.ts  
│       ├── TMSHOP-387.spec.ts
│       ├── TMSHOP-430.spec.ts
│       ├── TMSHOP-438.spec.ts
│       ├── TMSHOP-444.spec.ts
│       ├── TMSHOP-447.spec.ts
│       ├── TMSHOP-454.spec.ts
│       ├── TMSHOP-462.spec.ts
│       ├── TMSHOP-463.spec.ts
│       ├── TMSHOP-531.spec.ts
│       ├── TMSHOP-538.spec.ts  
│       ├── TMSHOP-539.spec.ts
│       ├── TMSHOP-540.spec.ts
│       ├── TMSHOP-prod.spec.ts
│       ├── follett-complete-order.spec.ts
│       └── browserstack-test.spec.ts
│
├── testdata/
│   └── Follett/
│       ├── follettTestData.xlsx ← Excel test data (single source of truth)
│       └── follettTestData.json ← Original JSON (kept for reference)
│
├── scripts/
│   └── jsonToExcel.js          ← One-time JSON → Excel conversion script
│
├── output/                     ← Order results written per test run
│   └── order-results_<timestamp>.xlsx
│
├── utils/
│   ├── excelToTestData.ts      ← Excel → JSON loader (replaces direct JSON import)
│   ├── writeOrderResult.ts     ← Writes order numbers to output Excel
│   ├── fixtures.ts             ← Playwright custom fixtures
│   ├── helper.ts               ← Screenshot & utility helpers
│   ├── global.setup.ts         ← Pre-test global setup (auth state)
│   ├── global.teardown.ts      ← Post-test teardown
│   ├── screenshotHelper.ts     ← Screenshot attachment utility
│   ├── sap-utils.ts            ← SAP-specific utilities
│   ├── mailosaur-get-code.js   ← Mailosaur email code retrieval
│   ├── api/                    ← Enhanced API testing utilities
│   │   ├── apiClient.ts
│   │   ├── apiConfig.ts
│   │   ├── apiTestDataManager.ts
│   │   ├── apiTestUtils.ts
│   │   ├── apiEnvLoader.ts
│   │   └── index.ts
│   ├── db/
│   │   └── oracle/             ← Oracle DB testing utility
│   └── web/
│       ├── datagenerator.ts    ← Faker.js web data generator
│       └── helper.ts
│
├── notify-results/
│   ├── config.json             ← MS Teams webhook configuration
│   └── test-results.xml        ← JUnit results (auto-generated)
│
├── cucumber-report/            ← BDD HTML/JSON reports (auto-generated)
├── playwright-report/          ← Playwright HTML report (auto-generated)
├── log/                        ← Event logs and performance reports
├── testSteps.txt               ← Quick-reference manual test steps
├── api.env                     ← API environment variables
├── oracle.env                  ← Oracle DB credentials
├── browserstack.yml            ← BrowserStack mobile configuration
├── playwright.config.ts        ← Master Playwright configuration
├── azure-pipelines.yml         ← Azure DevOps CI/CD pipeline
└── package.json                ← Project dependencies and scripts
```

### Key Design Decisions

- **Page Object Model** — All page interactions are encapsulated in `pages/Follett/`. Tests import page classes and never access locators directly.
- **Excel-Driven Test Data** — `testdata/Follett/follettTestData.xlsx` is the single source of truth for all test inputs. Each row represents one spec file and contains all data (store URL, email, products, payment, delivery, etc.). See [Section 7](#7-excel-test-data-management) for full details.
- **Execute Flag** — Each row in the Excel has an `execute` column (`Y`/`N`). Tests with `N` are automatically skipped at runtime — no code changes needed.
- **Order Result Tracking** — After each successful checkout, the order confirmation number and timestamp are saved to a separate `output/order-results_<timestamp>.xlsx` file.
- **Configurable Confirmation Message** — Each row can specify a `confirmMessage` column (e.g. `"Thank you"`, `"Order confirmed"`). The checkout page validates against this value instead of a hardcoded string.
- **`isMobile` Flag** — The `BasePage` class exposes `this.isMobile` which is driven by the `MOBILE=true` environment variable. Page objects use this flag to switch between mobile and desktop locators.

---

## 3. Installing Packages

### Prerequisites

| Requirement                  | Details                                                      |
| ---------------------------- | ------------------------------------------------------------ |
| **Node.js**                  | v16 or higher (latest LTS recommended)                       |
| **VS Code**                  | Latest version                                               |
| **GitHub Copilot Extension** | Required for AI agent features                               |
| **UnifiedMCP files**         | `build/index.cjs`                                            |

### Step 1 — Install Dependencies

Open a terminal in the project root and run:

```bash
npm install --force --legacy-peer-deps
```

> The `--force --legacy-peer-deps` flags resolve peer dependency conflicts between Playwright BDD, Cucumber, and other packages.

### Step 2 — Install Playwright Browsers

```bash
npx playwright install
```

This downloads the Chromium, Firefox, and WebKit browser binaries used by Playwright.

### Step 3 — Verify Installation

```bash
npx playwright --version
```

You should see a version string like `Version 1.58.x`.

### Key NPM Scripts

| Script               | Command                                | Description                     |
| -------------------- | -------------------------------------- | ------------------------------- |
| `test`               | `npx playwright test`                  | Run all tests (TDD mode)        |
| `open:uimode`        | `npx playwright test --ui`             | Open interactive Playwright UI  |
| `open:report`        | `npx playwright show-report`           | Open last HTML report           |
| `bddtest`            | `npx bddgen && npx playwright test`    | Generate + run BDD tests        |
| `test:mobile`        | `set MOBILE=true&&npx playwright test` | Run tests with mobile flag      |
| `sample-test:mobile` | BrowserStack mobile run                | Run on BrowserStack real device |
| `notify:teams`       | `npx test-results-reporter publish`    | Push results to MS Teams        |

---

## 4. MCP Configuration (UnifiedMCP)

UnifiedMCP is the AI engine that powers the two automation agents (Script Generator and Script Executor/Healer). It runs as an MCP server inside VS Code and is accessed through GitHub Copilot Chat.

### Step 1— Configure MCP in VS Code

1. Open VS Code.
2. Press `Shift + Ctrl + P` to open the Command Palette.
3. Search for and select **"MCP: User Configuration"** (or **"MCP: Open User MCP Config"**).
4. This opens your global `mcp.json` configuration file. Add the following block:

```json
{
  "servers": {
    "UnifiedMCP": {
      "type": "stdio",
      "command": "node",
      "args": [
        "C:\\Users\\<YourUsername>\\Downloads\\follett-bs\\build\\index.cjs",
        "--head",
        "--browser",
        "chromium",
      ]
    }
  }
}
```

### Step 2 — Activate the MCP Server

1. After saving `mcp.json`, reload VS Code (or press `Ctrl+Shift+P` → **"Developer: Reload Window"**).
2. Open **GitHub Copilot Chat** (`Ctrl+Alt+I`).
3. Switch the mode dropdown from **"Ask"** to **"Agent"**.
4. You will see the UnifiedMCP tools become available in the chat.

### MCP Configuration Options

| Argument       | Description                                     | Default             |
| -------------- | ----------------------------------------------- | ------------------- |
| `--head`       | Launches browser in headed (visible) mode       | Headless if omitted |
| `--browser`    | Browser engine: `chromium`, `firefox`, `webkit` | `chromium`          |

> **Tip:** Use `--head` during development so you can watch the browser actions in real time. For CI/CD, remove `--head` to run headless.

---

## 5. AI Agents — Script Generator

The **Script Generator** agent converts manual test steps (plain text) into production-ready Playwright TypeScript test scripts.

### When to Use

Use the Script Generator when you have:

- A new test case written as manual steps in a `.txt` file
- A user story or Jira ticket describing a test flow
- An exploratory test session you want to automate

### Input — Test Steps File

The framework uses `.txt` files in the `follet-test-steps/` folder as input. For example, `follett-test-steps.txt` describes the complete Follett bookstore purchase flow:

```
TEST CASE: Follett Bookstore - Product Purchase Flow

1. NAVIGATE TO PASSWORD PAGE
   - Navigate to: https://9975.qa-bkstr.com/password

2. ENTER STORE PASSWORD
   - Click on "Enter using password" button
   - Enter password: "paycro"
   - Click "Submit" button

3. SEARCH FOR PRODUCT
   - Click on the Search combobox
   - Type: "Title #1"

...and so on
```

The `testSteps.txt` in the root also serves as a quick-reference format:

```
Navigate to https://ntc.bkstr.com/
Click on "Shop By"
Click on "Clothing and Accessories"
Select "Solo GLHF Tablet Sling"
Add item to cart/bag
Click on "checkout" button
Fill Credit Card details as Card number: 5555 5555 5555 4444 ...
Click on "Complete Order"
```

### How to Generate a Script

1. Open **GitHub Copilot Chat** in VS Code.
2. Ensure the mode is set to **"Script Generatir"** (not "Ask" or "Agent").
3. Attach your test steps file using the **paperclip icon** or `#file:follet-test-steps/follett-test-steps.txt`.
4. Enter a prompt like: "test and generate"

### What the Agent Produces

The Script Generator agent will:

- **Navigate** to the URL and interact with the page using browser tools
- **Inspect** the live DOM to identify element locators (`data-testid`, roles, labels)
- **Create** page object classes for any new pages encountered
- **Write** the `.spec.ts` test file with proper imports, `test.describe`, and `test` blocks
- **Save** the files directly into the correct folders in your workspace

### Best Practices for Script Generation

| Tip                             | Details                                                              |
| ------------------------------- | -------------------------------------------------------------------- |
| **Be specific in steps**        | Include exact button labels, field names, and expected URLs          |
| **Provide test data**           | List all dynamic values (emails, passwords, card numbers) explicitly |
| **Reference existing patterns** | Ask the agent to follow `TMSHOP-376.spec.ts` as a style reference    |
| **One flow per file**           | Keep each `.spec.ts` focused on a single user journey                |
| **Verify locators**             | After generation, run the test once to confirm locators are stable   |

---

## 6. AI Agents — Script Executor & Healer

The **Script Executor / Script Healer** agent serves two purposes:

1. **Execute** existing Playwright test scripts through the AI agent (useful for debugging flows interactively).
2. **Heal** broken scripts — when a test fails due to UI changes, the agent inspects the live page, identifies the correct locators, and rewrites the affected steps.

### When to Use

| Scenario        | Use the Healer When…                                             |
| --------------- | ---------------------------------------------------------------- |
| Locator broken  | An element's `data-testid` or label changed after a UI update    |
| Flaky test      | A test passes sometimes and fails others (timing/async issue)    |
| New UI flow     | A page added a new mandatory step (e.g., a new popup or modal)   |
| Post-deployment | After a sprint release, quickly validate and fix any regressions |

### How to Execute a Script via Agent

1. Open **GitHub Copilot Chat** and select **Scrip Executor** agent.
2. Reference the spec file you want to run:

The agent will:

- Launch a browser (headed mode if `--head` is configured)
- Execute each step from the spec file
- Report pass/fail status for each step
- Capture screenshots on failure

### How to Heal a Failing Script

When a test has failed (e.g., after a UI update), use the following prompt pattern:

```
#file:tests/tdd/TMSHOP-538.spec.ts
This test is failing at the checkout step.
Navigate to the live page at https://9975.qa-bkstr.com,
inspect the current DOM, identify the correct locators,
and update the test script and page object to fix the failures.
```

The agent will:

1. Open the failing URL in a browser
2. Take an **accessibility snapshot** of the current page
3. Compare the snapshot against the locators in the spec file
4. Identify mismatches (renamed `data-testid`, restructured HTML, etc.)
5. **Rewrite** the affected page object methods with updated locators
6. **Re-run** the test to confirm the fix

### Healing Workflow — Step by Step

```
Step 1: Run the test normally
        npx playwright test tests/tdd/TMSHOP-XXX.spec.ts

Step 2: If it fails, note the error message and failing step

Step 3: Open Copilot Chat in Agent mode and paste the error:
        "The test TMSHOP-XXX is failing with error:
         'locator.click: Error: strict mode violation'
         on the checkout page. Fix the locator."

Step 4: Agent navigates to the page, inspects DOM, fixes the locator

Step 5: Agent saves the updated page object file

Step 6: Re-run the test to verify the fix
```

### Tips for Effective Healing

| Tip                           | Details                                                                  |
| ----------------------------- | ------------------------------------------------------------------------ |
| **Provide the error message** | Always paste the Playwright error output into the chat                   |
| **Share the failing step**    | Tell the agent which step number or action failed                        |
| **Use `--head` mode**         | Having the browser visible helps the agent interact naturally            |
| **Check page objects**        | Healing usually updates `pages/Follett/*.ts`, not the spec file directly |
| **Commit after healing**      | Once fixed, commit the updated page objects to prevent regression        |

---

## 7. Excel Test Data Management

All test data is managed via an **Excel workbook** at `testdata/Follett/follettTestData.xlsx`. This replaces the earlier approach of importing a JSON file directly.

### Excel Layout

The workbook has a single sheet called **"TestData"** with one row per spec file:

| Column | Description | Example |
| --- | --- | --- |
| `specId` | Spec identifier (matches the TMSHOP ticket) | `TMSHOP-430` |
| `execute` | Run flag — `Y` to run, `N` to skip | `Y` |
| `store.url` | Target store URL | `https://9975.qa-bkstr.com/` |
| `store.password` | Store password (if gated) | `paycro` |
| `customer.email` | Test customer email address | `test@yopmail.com` |
| `delivery.*` | Delivery/shipping fields (firstName, lastName, address1, city, zip, phone, etc.) | |
| `payment.*` | Payment fields (cardNumber, expMonth, expYear, cvv, nameOnCard) | |
| `product.*` / `products` | Spec-specific product data (name, format, condition) — arrays stored as JSON strings | |
| `confirmMessage` | Text to validate on the order confirmation page | `Thank you` |
| _(other spec columns)_ | Any additional spec-specific fields (course, studentId, campusCardCode, etc.) | |

**Column naming convention:** Dot-notation is used for nested objects. For example, `delivery.firstName` maps to `{ delivery: { firstName: "..." } }` in code.

### How It Works

1. **`utils/excelToTestData.ts`** reads the Excel at startup using `convert-excel-to-json`.
2. Each row is unflattened from dot-notation columns into a nested object.
3. Common columns (`store.*`, `customer.*`, `delivery.*`, `payment.*`) are included in every spec's data object, so each spec has its own complete copy.
4. The `execute` column populates an internal enabled-specs set, exposed via `isEnabled(specId)`.
5. Array/JSON columns (like `products`) are auto-parsed from JSON strings.

### Spec File Imports

Every spec file imports test data like this:

```typescript
import testData, { isEnabled } from "../../utils/excelToTestData";

const td = testData["TMSHOP-430"];
const STORE_PASSWORD = td.store.password;
const CUSTOMER_EMAIL = td.customer.email;
const DELIVERY_DETAILS = td.delivery;
const CARD_DETAILS = td.payment;
```

All fields come from `td` (the spec's own Excel row), so changing a value in the Excel immediately affects that spec — no code edits required.

### Execute Flag — Skipping Tests

Each spec checks the `execute` column at the top of its `test.describe` block:

```typescript
test.describe("Follett Bookstore - Complete Order Flow", () => {
  test.skip(!isEnabled("TMSHOP-430"), "Skipped via Excel execute flag");
  // ...
});
```

To disable a test, simply change its `execute` cell from `Y` to `N` in the Excel. To re-enable it, change it back to `Y`.

### Confirmation Message

The `confirmMessage` column controls what text is validated on the order confirmation page. If left empty, it defaults to `"Thank you"`. Each spec passes this value to `completeOrder()`:

```typescript
const orderNumber = await checkoutPage.completeOrder(testInfo, td.confirmMessage);
```

### Order Result Output

After each successful checkout, the framework writes a row to a **separate output Excel** at `output/order-results_<timestamp>.xlsx`:

| Spec File | Order Number | Timestamp |
| --- | --- | --- |
| TMSHOP-430 | NPD1TMU0F | 2026-03-20T14:30:00.000Z |
| TMSHOP-376 | ABC2DEF3G | 2026-03-20T14:35:12.000Z |

A new output file is created per test run (timestamped). The input Excel is never modified.

### Editing Test Data

1. Open `testdata/Follett/follettTestData.xlsx` in Excel or any spreadsheet editor.
2. Edit the values you need (email, payment details, product names, etc.).
3. Save and close the file.
4. Run your tests — the updated values are picked up automatically.

> **Important:** Make sure the Excel file is closed before running tests. An open file will cause a file-lock error.

### Regenerating the Excel from JSON

If you need to regenerate the Excel from the original JSON (e.g., after editing the JSON directly):

```bash
node scripts/jsonToExcel.js
```

This reads `testdata/Follett/follettTestData.json` and writes a fresh `follettTestData.xlsx` with all rows and columns.

### Adding a New Test Spec

To add a new spec to the Excel:

1. Add a new row at the bottom of the "TestData" sheet.
2. Set `specId` to the new ticket ID (e.g., `TMSHOP-600`).
3. Set `execute` to `Y`.
4. Fill in all common columns (`store.*`, `customer.*`, `delivery.*`, `payment.*`).
5. Add any spec-specific columns (product names, course details, etc.).
6. Create the corresponding `.spec.ts` file in `tests/tdd/` that reads from `testData["TMSHOP-600"]`.

---

## 8. Running Tests

### TDD Mode (Default)

```bash
# Run all TDD tests
npx playwright test

# Run a specific test file
npx playwright test tests/tdd/TMSHOP-376.spec.ts

# Run with UI mode (interactive, recommended for debugging)
npx playwright test --ui

# Run a specific test by name
npx playwright test --grep "2-Textbook Complete Order Flow"

# List all discovered tests without running them
npx playwright test --list
```

### Controlling Which Tests Run — Excel Execute Flag

The **primary way** to control which tests run is via the `execute` column in the Excel:

| specId | execute | Effect |
| --- | --- | --- |
| TMSHOP-430 | `Y` | Test runs normally |
| TMSHOP-376 | `N` | Test is skipped with message "Skipped via Excel execute flag" |

Change the Excel, save it, and run — no code changes needed.

### Configuring Which Tests to Run (Config-Level)

You can also filter at the config level. In `playwright.config.ts`, the `testMatch` field controls which spec files are discovered:

```typescript
testDir: './tests/tdd/',
testMatch: '**/TMSHOP-376.spec.ts',   // ← Change this to discover a specific spec
```

To discover **all** TDD specs (recommended — then use Excel `execute` flag to control which ones run):

```typescript
testMatch: '**/*.spec.ts',
```

### Parallel Execution

The config defaults to `workers: 1`:

```typescript
workers: process.env.CI ? 1 : isMobile ? 1 : 1,
```

Increase `workers` for faster parallel execution if your machine supports it. Note that order result output uses a shared Excel file, so high parallelism may require additional synchronisation.

---

## 9. Mobile Testing

The framework supports **two modes of mobile testing**, both driven by the `MOBILE=true` environment variable.

### Mode 1 — Playwright Device Emulation (Local)

Playwright's built-in device emulation simulates mobile viewport, touch events, and user agent — all without a real device.

**How to enable:**

```bash
# Windows Command Prompt
set MOBILE=true && npx playwright test

# Or use the npm script
npm run test:mobile
```

**How it works in the config (`playwright.config.ts`):**

```typescript
const isMobile: boolean = (process.env.MOBILE ?? "").trim() === "true";

projects: [
  ...(isMobile
    ? [{ name: "Mobile Safari - iPhone 14", use: { ...devices["iPhone 14"] } }]
    : [
        {
          name: "Google Chrome",
          use: { ...devices["Desktop Chrome"], channel: "chrome" },
        },
      ]),
];
```

When `MOBILE=true`, the `iPhone 14` device profile is loaded, which sets:

- Viewport: 390 × 844
- User Agent: Mobile Safari
- Touch: enabled

**Page object mobile branching:**

Page classes inherit `isMobile` from `BasePage`. Use this flag to switch locators when the mobile layout differs:

```typescript
// Example in a page object
async clickCheckout() {
  if (this.isMobile) {
    await this.page.locator('[data-testid="mobile-checkout-btn"]').click();
  } else {
    await this.page.locator('[data-testid="checkout-btn"]').click();
  }
}
```

### Mode 2 — BrowserStack Real Device Testing

BrowserStack runs your tests on physical mobile devices in the cloud. The current configuration targets **iPhone 14 (iOS 16, Safari)**.

**Configuration file: `browserstack.yml`**

```yaml
userName: <your_bs_username>
accessKey: <your_bs_access_key>

projectName: efollett IOS run
buildName: browserstack build
buildIdentifier: "#${BUILD_NUMBER}"

platforms:
  - deviceName: iPhone 14
    osVersion: 16
    deviceOrientation: portrait
    browserName: safari

parallelsPerPlatform: 1
idleTimeout: 300
framework: playwright
```

**To run on BrowserStack:**

```bash
# Using the npm script (cleans up lock files first)
npm run sample-test:mobile

# Or run directly
set MOBILE=true && node ./scripts/cleanup-browserstack-lock.js && npx browserstack-node-sdk playwright test --config=./playwright.config.ts
```

**`cleanup-browserstack-lock.js`** — This script (`scripts/cleanup-browserstack-lock.js`) removes stale lock files that can prevent parallel BrowserStack sessions from starting. It runs automatically before each BrowserStack execution.

### Mobile-Specific Considerations

| Topic            | Details                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Workers**      | Always `1` when `MOBILE=true` — mobile devices cannot run parallel sessions locally                                |
| **Locators**     | Use `data-testid` attributes — these are stable across desktop and mobile layouts                                  |
| **Waits**        | Mobile devices (especially on BrowserStack) are slower; use `page.waitForLoadState('networkidle')` for reliability |
| **Viewport**     | iPhone 14 emulation uses 390×844; test your pages at this size before automating                                   |
| **Touch events** | Playwright device emulation handles tap vs. click automatically                                                    |
| **Screenshots**  | `screenshot: 'on'` is set globally — every step captures a screenshot, which is useful for mobile debugging        |
| **Video**        | `video: 'on'` records the full session — especially useful for debugging BrowserStack failures                     |
| **HTTPS errors** | `ignoreHTTPSErrors: true` is set to avoid certificate failures on QA environments                                  |

### Adding More BrowserStack Devices

To add Android or other iOS devices, extend the `platforms` array in `browserstack.yml`:

```yaml
platforms:
  - deviceName: iPhone 14
    osVersion: 16
    deviceOrientation: portrait
    browserName: safari
  - deviceName: Samsung Galaxy S23
    osVersion: 13.0
    deviceOrientation: portrait
    browserName: chrome
```

---

## 10. Reports & Notifications

### Playwright HTML Report

Auto-generated after every test run. Contains screenshots, videos, and traces.

```bash
npm run open:report
# or
npx playwright show-report
```

Report is saved to `playwright-report/index.html`.

Configure your MS Teams incoming webhook in `notify-results/config.json` before running this command.

### Individual Test Reports

Each TMSHOP ticket has its own report folder (e.g., `TMSHOP-376-report/index.html`) for historical reference.

---

## 11. CI/CD Integration

### Azure DevOps

The repository includes three pipeline configuration files:

| File                   | Purpose                                                 |
| ---------------------- | ------------------------------------------------------- |
| `azure-pipelines.yml`  | Main pipeline — installs, runs tests, publishes results |
| `azure.yml`            | Additional Azure configuration                          |
| `playwrightdocker.yml` | Docker-based pipeline for containerised execution       |

The main pipeline:

1. Installs Node.js and dependencies
2. Runs `npx playwright test`
3. Publishes the JUnit XML results
4. Archives `playwright-report/` as a build artifact

### Environment Variables in CI

Set these as pipeline variables in Azure DevOps:

| Variable                  | Description                                                   |
| ------------------------- | ------------------------------------------------------------- |
| `CI`                      | Set to `true` — reduces workers to 1 and disables `test.only` |
| `MOBILE`                  | Set to `true` to trigger mobile device profile                |
| `BROWSERSTACK_USERNAME`   | BrowserStack credential                                       |
| `BROWSERSTACK_ACCESS_KEY` | BrowserStack credential                                       |

---

## 12. Configuration Files Reference

### `playwright.config.ts`

| Setting             | Value                        | Description                                       |
| ------------------- | ---------------------------- | ------------------------------------------------- |
| `testDir`           | `./tests/tdd/`               | Root folder for test discovery                    |
| `baseURL`           | `https://9975.qa-bkstr.com/` | Default base URL for all `page.goto('/')` calls   |
| `fullyParallel`     | `false`                      | Sequential test execution (required for shared state) |
| `retries`           | `0`                          | No retries (set higher for flaky CI environments) |
| `workers`           | `1`                          | Single worker (prevents Excel write conflicts)    |
| `screenshot`        | `'on'`                       | Capture screenshot on every test                  |
| `video`             | `'on'`                       | Record video for every test                       |
| `trace`             | `'on-first-retry'`           | Capture trace on retry                            |
| `timeout`           | `600000` (10 min)            | Per-test timeout                                  |
| `ignoreHTTPSErrors` | `true`                       | Ignore SSL errors on QA                           |

### `testdata/Follett/follettTestData.xlsx`

This is the **single source of truth** for all test inputs. Update this file rather than editing individual spec files. See [Section 7](#7-excel-test-data-management) for the full layout and usage guide.

Key columns:

- `specId` — Test identifier (e.g., `TMSHOP-430`)
- `execute` — `Y` to run, `N` to skip
- `store.*` — Store URL and password
- `customer.email` — Test customer email
- `delivery.*` — Shipping address (firstName, lastName, address1, city, zip, phone)
- `payment.*` — Credit card details (cardNumber, expMonth, expYear, cvv, nameOnCard)
- `confirmMessage` — Expected text on the order confirmation page
- _(spec-specific columns for products, courses, student IDs, etc.)_

### `utils/excelToTestData.ts`

Reads the Excel file and converts it to the same nested object structure that specs expect. Exports:

- `default testData` — The full test data object (common + per-spec)
- `isEnabled(specId)` — Returns `true` if the spec's `execute` column is `Y`

### `utils/writeOrderResult.ts`

Writes order confirmation numbers to a timestamped output Excel at `output/order-results_<timestamp>.xlsx`. Called by each spec after a successful checkout.

### `api.env`

Stores API environment variables loaded at startup via `dotenv`. Includes Shopify crawler signature headers for bot-authenticated requests.

### `oracle.env`

Oracle database connection strings and credentials for multiple environments (`TEST_`, `DEV_`, `PROD_`). **Do not commit this file to version control.**

---

## 13. Troubleshooting

### Common Issues

#### Tests not found

```
No tests found
```

**Fix:** Check `testMatch` in `playwright.config.ts`. Ensure it points to the correct spec file pattern. Also verify the Excel file exists at `testdata/Follett/follettTestData.xlsx`.

---

#### All tests skipped

```
15 skipped
```

**Fix:** Open the Excel and check the `execute` column. All rows must be set to `Y` for the tests you want to run.

---

#### Excel file locked / EBUSY error

```
Error: EBUSY: resource busy or locked, open '...follettTestData.xlsx'
```

**Fix:** Close the Excel file in your spreadsheet application before running tests or the `jsonToExcel.js` script.

---

#### Order result not written

If the `output/` folder is empty after a test run, the test likely failed before reaching the checkout completion step. Check the Playwright HTML report for the failure point.

---

#### MCP server not connecting

```
MCP server "UnifiedMCP" failed to start
```

**Fix:**

1. Verify the path to `index.cjs` in `mcp.json` is correct and uses double backslashes on Windows.
2. Restart VS Code and re-open Copilot Chat in Agent mode.

---

#### Browser not launching (BrowserStack)

```
Error: Could not connect to BrowserStack
```

**Fix:** Run `node ./scripts/cleanup-browserstack-lock.js` manually to clear stale session locks, then retry.

---

#### Mobile test using desktop locators

**Fix:** Ensure `MOBILE=true` is set before running and that your page objects check `this.isMobile` when needed.

---

#### `DPI-1047: Cannot locate Oracle Client library`

**Fix:** Install Oracle Instant Client and add it to your system `PATH`:

```
C:\oracle\instantclient
```

---

#### SSL / HTTPS errors on QA site

**Fix:** `ignoreHTTPSErrors: true` is already set in `playwright.config.ts`. If you still see errors, verify the base URL is correct.

---

#### Playwright browser binary not found

```
Error: browserType.launch: Executable doesn't exist
```

**Fix:**

```bash
npx playwright install
```

---

### Getting Help

- Playwright docs: https://playwright.dev/docs/intro
- BrowserStack Playwright guide: https://www.browserstack.com/docs/automate/playwright
- UnifiedMCP / Automation COE: Contact your internal COE team for `index.cjs`
