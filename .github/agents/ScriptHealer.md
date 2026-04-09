Debug and Fix Playwright Test - Automated Test Debugger

Analyze, debug, and fix failing or unstable Playwright tests by executing them step-by-step using UnifiedMCP browser automation tools. Identify root causes and automatically update test code and page objects to make them robust and reliable.

ENHANCED DEBUGGING WORKFLOW:

Step 1: Run Spec File with MCP Tools - Execute Complete Test Scenario

**Objective**: Execute all test steps using MCP tools to understand expected behavior and identify issues during execution.

1.1 Load and Parse Test File:

- Use read_file to load the failing Playwright test spec
- Extract test steps, selectors, assertions
- Identify page objects used (imports at top of file)
- Note test data sources and setup/teardown

  1.2 Identify Test Type:

- Web Test: browser context, page navigation, locators, interactions
- Mobile Test: app actions (launch, tap, swipe, device buttons)
- API Test: HTTP requests, response validations
- Hybrid: mixed browser/API or mobile/API interactions

  1.3 Search for Page Objects Used in Test:

- Identify all page object imports from test file
- Use file_search to locate all page object files: `pages/**/*.ts`
- Document which page objects are used by the test

  1.4 Execute Test Step-by-Step Using MCP Tools:
  **CRITICAL: Execute by replicating test logic, continue through all steps unless application or test data issue**

```javascript
// Capture start timestamp using browser evaluate (before first MCP tool execution)
let healingStartTime = null;
try {
  const startTimeResult = await browser_evaluate({ function: "() => Date.now()" });
  healingStartTime = parseInt(startTimeResult);
  console.log(`🕐 Healing Start Time: ${healingStartTime}`);
} catch (error) {
  console.log("⚠️ Could not capture start time via browser, using system time");
  healingStartTime = Date.now();
}

const healedSteps = []; // Track steps where locator fixes were needed
const manualTestData = []; // Track detailed test data for report
const locatorChanges = []; // Track ALL locator changes for report table
```

For each test step:

- Navigate using browser_navigate or browser_goto
- Capture page state with browser_snapshot
- Click elements using browser_click
- Fill forms using browser_type or browser_fill_form
- Verify elements using browser_verify_element_visible
- Call APIs using testAPI tool
- **Track test data**: Add to manualTestData array with step number and detailed information (URLs, form values, locators used, elements interacted with)
- **Track locator fixes**: If locator adjustment needed, add to healedSteps array AND locatorChanges array with {stepNumber, fileName, lineNumber, oldLocator, newLocator, reason, healStatus: 'healed' or 'failed'}
- Store execution data: step number, command, MCP tool, test data, status
- **Note**: Timing is automatically captured by UnifiedMCP recording system

  1.5 Handle Execution Issues:

- **Continue unless**: Application error, test data missing/invalid, environment issue
- **Stop and document**: Critical application failures, invalid API responses, missing prerequisite data
- **Capture**: Screenshots at each step for reference
- **Track**: Which steps succeeded, which failed, timing for each

  1.6 Track Execution Progress:

- Track which steps succeeded, which failed
- Document locator issues discovered
- Continue execution through all steps

Step 2: Summarize Locator Fixes Made While Running the Scenario

**Objective**: Document all locator adjustments and fixes discovered during execution for later application to page objects.

2.1 During Step-by-Step Execution, Track:

- Any selector adjustments needed (CSS → role-based, specificity issues)
- Locator path changes observed
- Missing waits or timing adjustments
- Element visibility/state issues
- Alternative selectors that worked better
- **Step numbers where fixes were applied** (add to healedSteps array)

  2.2 Create Locator Fix Summary:
  Document for each page object used AND structure data for report table:

```javascript
// Structure locator changes for report table generation
locatorChanges.push({
  stepNumber: 3, // Step where issue occurred
  fileName: "pages/Ecommerce/loginPage.ts",
  lineNumber: "25",
  oldLocator: 'page.getByRole("button", { name: "Submi" })',
  newLocator: 'page.getByRole("button", { name: "Submit" })',
  reason: "Typo in button name - selector could not find element",
  healStatus: "healed", // or "failed" if couldn't be fixed
});

locatorChanges.push({
  stepNumber: 5,
  fileName: "pages/Ecommerce/loginPage.ts",
  lineNumber: "45",
  oldLocator: "await this.emailInput.fill(email)",
  newLocator:
    "await expect(this.emailInput).toBeVisible({ timeout: 5000 }); await this.emailInput.fill(email)",
  reason: "Missing explicit wait - element not ready when accessed",
  healStatus: "healed",
});
```

Example Text Summary (for documentation):

```
LoginPage Locator Fixes:
- Line 25 Constructor: page.getByRole("button", { name: "Submi" })
  → page.getByRole("button", { name: "Submit" })
  Reason: Typo in button name
  Status: ✅ Healed

- Line 45 Method fillEmail(): Added explicit wait before fill
  Original: await this.emailInput.fill(email)
  Fix: await expect(this.emailInput).toBeVisible({ timeout: 5000 }); await this.emailInput.fill(email)
  Reason: Missing explicit wait
  Status: ✅ Healed
```

2.3 Document All Issues Found:

- Selector mismatches (locators that didn't work as expected)
- Timing issues (elements not ready when accessed)
- Method sequencing problems (steps in wrong order)
- State/prerequisites missing before action
- Data issues affecting locator selection

Step 3: Understand Page Objects Used in Spec File

**Objective**: Analyze all page objects to understand current structure before applying fixes.

3.1 Read ALL Page Object Files:

- Use file_search to locate ALL page objects: `pages/**/*.ts`
- Use read_file to read EVERY page object file used by the test
- Extract complete structure:
  - Constructor locators
  - Method signatures (name, parameters, return type)
  - Action methods (click, fill, select)
  - Verification methods (verify, check, assert)
  - Helper methods

    3.2 Create Page Object Method Inventory for Each File:

```
FileName: pages/Ecommerce/loginPage.ts
- Constructor Locators:
  * this.emailInput = page.locator('#email')
  * this.passwordInput = page.locator('#password')
  * this.loginButton = page.getByRole("button", { name: "Login" })

- Methods:
  * fillEmail(email: string): void
  * fillPassword(password: string): void
  * clickLogin(): Promise<void>
  * fillCredentials(email: string, password: string): Promise<void>
  * navigate(): Promise<void>
```

3.3 Validate Current Page Object Structure:

- Check ALL locators are in constructor (not scattered in methods)
- Verify methods use this.locatorName (not direct page.locator)
- Document any typos or issues found
- List any missing methods that test requires

Step 4: Update Page Objects As Per Locator Fix Summarization

**Objective**: Apply all locator fixes and improvements to page object files.

4.1 Apply Constructor Locator Fixes:
Using multi_replace_string_in_file, fix all locator issues:

- Correct typos in selector names
- Replace CSS selectors with role-based selectors
- Improve selector specificity
- Fix visible/accessibility issues

```typescript
// BEFORE (pages/LoginPage.ts, Line 25)
this.submitButton = page.getByRole("button", { name: "Submi" }); // Typo

// AFTER (pages/LoginPage.ts, Line 25)
this.submitButton = page.getByRole("button", { name: "Submit" });
```

4.2 Apply Method Sequence Fixes:

- Add explicit waits before interactions
- Reorder steps if needed
- Ensure proper timing for dynamic content
- Add method chaining support (return this)

```typescript
// BEFORE (pages/OrderPage.ts, Line 72)
async clickPlaceOrder() {
  await this.placeOrderButton.click();
}

// AFTER (pages/OrderPage.ts, Line 72)
async clickPlaceOrder() {
  await expect(this.placeOrderButton).toBeVisible({ timeout: 10000 });
  await this.placeOrderButton.click();
  await this.page.waitForTimeout(1000);
  return this;
}
```

4.3 Add Missing Methods:

- Create any methods referenced by test but missing from page object
- Follow existing page object conventions
- Include proper waits and error handling

  4.4 Validate Fixes with get_errors:

- Run get_errors on all updated page object files
- Fix any compilation errors
- Verify TypeScript syntax is correct
- Ensure all imports are present

  4.5 Re-run Test with Fixed Page Objects:

- Execute test again using MCP tools with updated page objects
- Verify all fixes work functionally
- Capture updated execution timing data
- Document any remaining issues

Step 3: Execute Test Using UnifiedMCP Tools

**CRITICAL: Execute by Replicating Page Object Methods, NOT Direct Browser Calls**

For each test step:

1. Find the page object method (from Step 2.5 mapping)
2. Read its implementation (locators, sequence, waits)
3. Execute EXACT same logic using MCP tools with EXACT same locators
4. Observe execution behavior and timing

Example:
Step 5: API Environment Management (for API/Hybrid tests)

**MANDATORY for all API tests:**

Before executing API calls, ensure API URL is registered in api.env:

1. **Parse api.env** to check if URL exists:
   - Read api.env file from workspace root
   - Search for `<ENV_NAME>_BASE_URL=<URL>` pattern
   - Check if base URL (e.g., http://127.0.0.1:5000) is already registered

2. **If URL NOT found in api.env**:
   - Generate environment name: `<APP>_<IDENTIFIER>`
     - Examples: TECHSTORE_LOCAL, ECOMMERCE_STAGING, SALESFORCE_DEV
   - Use replace_string_in_file to append to api.env:
     ```
     # <App Name> <Environment Description>
     <ENV_NAME>_BASE_URL=<BASE_URL>
     <ENV_NAME>_TIMEOUT=30000
     <ENV_NAME>_RETRIES=3
     ```
   - Log: "✅ Registered environment '<ENV_NAME>' in api.env"

3. **Verify test uses ApiClient with ApiEnvLoader**:

   ```typescript
   import { ApiClient, ApiConfig } from "../../utils/api";
   import { ApiEnvLoader } from "../../utils/api/apiEnvLoader";

   test.beforeEach(async ({ request }) => {
     // Load environment from api.env and register it
     const envConfig = ApiEnvLoader.loadEnvironment("<env_name>", "./api.env");
     ApiConfig.registerEnvironment(envConfig);

     // Initialize ApiClient with environment name (lowercase)
     apiClient = new ApiClient(request, "<env_name>");
   });
   ```

   - Environment name in code: **lowercase with underscores** (e.g., 'techstore_local')
   - Environment name in api.env: **UPPERCASE with underscores** (e.g., 'TECHSTORE_LOCAL')
   - ALWAYS use ApiEnvLoader to load from api.env before using ApiClient
   - NEVER use direct URLs: `request.post('http://...')`

Step 6: MCP Tool Execution Mapping

Map each Playwright command to equivalent MCP tool:

Playwright Command → MCP Tool Mapping:
├─ page.goto(url) → browser_navigate
├─ page.locator().click() → browser_click (after browser_snapshot)
├─ page.getByRole().click() → browser_click (after browser_snapshot)
├─ page.fill(selector, text) → browser_type or browser_fill_form
├─ page.selectOption() → browser_select_option
├─ expect().toBeVisible() → browser_verify_element_visible
├─ expect().toHaveText() → browser_verify_text_visible
├─ page.waitForLoadState() → browser_wait_for
└─ page.screenshot() → browser_take_screenshot

For Mobile Tests:
├─ mobile_list_available_devices - List devices
├─ mobile_launch_app - Launch app
├─ mobile_tap_on_coordinates - Tap screen
└─ mobile_take_screenshot - Capture screenshot

For API Tests:
├─ testAPI - Send HTTP requests (POST, GET, PUT, PATCH, DELETE)
├─ Verify response status, body, headers
├─ DO NOT use run_in_terminal, curl, or PowerShell for API calls
├─ DO NOT use direct request.post() or request.get() - always use testAPI tool
└─ All API URLs must be registered in api.env (see Step 5)

**Execution Process:**

1. Always call browser_snapshot BEFORE any interaction
2. Extract current page structure and element refs
3. Map test selector to actual ref from snapshot
4. Execute action using ref
5. Verify outcome
6. Document any discrepancies and locator fixes discovered

Step 7: Identify Any Issues Encountered During Execution

Common Issues to Check:
├─ Selector Issues
│ ├─ Element not found (wrong selector)
│ ├─ Multiple elements match (ambiguous selector)
│ ├─ Element not visible (timing issue)
│ └─ Dynamic IDs/classes (unstable selector)
├─ Timing Issues
│ ├─ Element not loaded yet
│ ├─ Page transition not complete
│ ├─ Animation/fade delays
│ └─ AJAX/fetch pending
├─ State Issues
│ ├─ Prerequisite step failed
│ ├─ Wrong page/URL
│ ├─ Unexpected modal/dialog
│ └─ Session/auth expired
├─ Data Issues
│ ├─ Hardcoded test data
│ ├─ Static email/username
│ ├─ Fixed order IDs
│ └─ Environment-specific values
├─ Assertion Issues
│ ├─ Wrong expected value
│ ├─ Partial text match needed
│ ├─ Case sensitivity
│ └─ Timeout too short
└─ API Issues
├─ Missing api.env configuration
├─ Direct URL usage instead of ApiClient
├─ Wrong HTTP method or endpoint
├─ Authentication/authorization failures
└─ Response validation errors

Step 5: Debug Each Failing Step

For Each Error:

1. Take screenshot at failure point
2. Call browser_snapshot to see actual page state
3. Compare expected vs actual:
   - Is element present with different attributes?
   - Is text content different?
   - Is element in different location?
   - Is page structure changed?
4. Identify root cause category (selector/timing/state/data)
5. Determine WHERE fix should be applied:
   - Page Object locator issue → Fix in page class constructor
   - Page Object method logic issue → Fix in page class method
   - Test flow/data issue → Fix in test file
   - Missing page object → Create new page object file
6. Determine fix strategy

Step 6: Generate Fix Strategy

Based on Issue Type:

Selector Fixes:
├─ Replace CSS selectors with role-based selectors
├─ Use text content instead of IDs
├─ Add data-testid attributes (document for developer)
├─ Use more specific locators (getByRole + name)
└─ Chain locators for uniqueness

POM Conversion (if test doesn't use Page Object Model):
├─ Analyze test structure and identify logical pages
├─ Create page object files in pages/<AppName>/ directory
├─ Extract selectors to constructor as locators
├─ Convert actions to page methods
├─ Refactor test to use page objects
│ ├─ Fixed order IDs
│ └─ Environment-specific values
├─ Assertion Issues
│ ├─ Wrong expected value
│ ├─ Partial text match needed
│ ├─ Case sensitivity
│ └─ Timeout too short
└─ API Issues
├─ Missing api.env configuration
├─ Direct URL usage instead of ApiClient
├─ Wrong HTTP method or endpoint
├─ Authentication/authorization failures
└─ Response validation errors

Step 8: Validate and Fix Page Objects

**MANDATORY Page Object Validation & Updates:**

8.1 For each page object identified in Step 3 (page object inventory):

- Check ALL locators in constructor for typos
- Verify selectors use best practices (getByRole > CSS selectors)
- Ensure methods use class locators (this.locatorName, not page.locator())
- Add any missing methods discovered during execution
- Apply all locator fixes from Step 2 summary

  8.2 Common Page Object Issues & Fixes:

Issue 1 - Locator with Typo:

```typescript
// BEFORE
this.submitButton = page.getByRole("button", { name: "Submi" }); // Typo

// AFTER
this.submitButton = page.getByRole("button", { name: "Submit" });
```

Issue 2 - CSS Selector (should use role-based):

```typescript
// BEFORE
this.checkoutButton = page.locator("#checkout-btn");

// AFTER
this.checkoutButton = page.getByRole("button", { name: "Checkout" });
```

Issue 3 - Locator Not in Constructor:

```typescript
// BEFORE
export class ProductPage {
  get addToCartButton() {
    return this.page.locator(".add-to-cart");
  }
}

// AFTER
export class ProductPage {
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.getByRole("button", { name: "Add to Cart" });
  }
}
```

Issue 4 - Method Not Using Class Locator:

```typescript
// BEFORE
async fillEmail(email: string) {
  await this.page.locator('#email').fill(email); // Direct page.locator
}

// AFTER
async fillEmail(email: string) {
  await this.emailInput.fill(email); // Use this.emailInput
  return this;
}
```

Issue 5 - Missing Method:

```typescript
// ADD TO page object
async verifyLoginPage() {
  await expect(this.loginHeading).toBeVisible();
  if (this.testInfo) {
    await Helper.attachScreenshotToReport(this.page, "LoginPageVerified", this.testInfo);
  }
  return this;
}
```

Issue 6 - Missing Explicit Wait:

```typescript
// BEFORE
async clickPlaceOrder() {
  await this.placeOrderButton.click();
}

// AFTER
async clickPlaceOrder() {
  await expect(this.placeOrderButton).toBeVisible({ timeout: 10000 });
  await this.placeOrderButton.click();
  await this.page.waitForTimeout(1000);
  return this;
}
```

8.3 API Helpers (for API/Hybrid tests):

**⚠️ IMPORTANT: DO NOT CREATE NEW API HELPERS**

Location Patterns:

- Generic utilities: `utils/api/<utilityName>.ts`
- App-specific helpers: `utils/api/<appName>ApiHelper.ts`

Reuse Strategy:

1. If app-specific helper exists → Import and use it
2. If only generic utilities exist → Use ApiClient with ApiEnvLoader
3. If nothing exists → Use ApiClient with ApiEnvLoader
4. NEVER create new API helper files

Import Pattern:

```typescript
// Page Objects
import { TechStoreLoginPage } from "../../pages/Ecommerce/techStoreLoginPage";

// API Utilities (generic - preferred)
import { ApiClient, ApiTestUtils, ApiConfig } from "../../utils/api";
import { ApiEnvLoader } from "../../utils/api/apiEnvLoader";
```

8.4 Apply All Fixes Using multi_replace_string_in_file:

- Fix all locator typos in constructors
- Update CSS selectors to role-based selectors
- Update methods to use class locators (this.locatorName)
- Add missing methods
- Add explicit waits where needed
- Apply ALL fixes in one operation for efficiency

  8.5 Validate Fixes with get_errors:

- Run get_errors on all updated page object files
- Fix any compilation errors immediately
- Verify TypeScript syntax is correct
- Ensure all imports are present

Step 9: Generate HTML Report Using Test Report Data and Template

**MANDATORY Report Generation Process:**

9.1 Calculate Healing Time and Get Test Report Data:

**CRITICAL: Capture end timestamp and calculate healing time BEFORE calling getTestReportData**

```javascript
// Capture end timestamp using browser evaluate (after all test execution, before report generation)
let healingEndTime = null;
try {
  const endTimeResult = await browser_evaluate({ function: "() => Date.now()" });
  healingEndTime = parseInt(endTimeResult);
  console.log(`🕐 Healing End Time: ${healingEndTime}`);
} catch (error) {
  console.log("⚠️ Could not capture end time via browser, using system time");
  healingEndTime = Date.now();
}

// Calculate total healing time (test execution + fixes + debugging)
const totalHealingTimeMs = healingEndTime - healingStartTime;
const healingTimeFormatted = totalHealingTimeMs > 0 
  ? `${(totalHealingTimeMs / 1000).toFixed(2)}s` 
  : "0s";

console.log(`⏱️ Total Healing Time: ${healingTimeFormatted} (${totalHealingTimeMs}ms)`);
console.log(`🔧 Number of Steps Healed: ${healedSteps.length}`);

// Analysis of healing time breakdown:
// - MCP Tool Execution: Time spent running browser interactions
// - Locator Fixes: Time spent identifying and documenting fixes
// - Page Object Updates: Time spent applying fixes to code
// Total Healing Time = Complete end-to-end debugging and fixing duration

// Get test execution timing data from UnifiedMCP recording system
const healedStepsCount = healedSteps.length;

// ✅ CORRECT: Call AFTER execution with useRecordedData: true
const timingData = await mcp_unifiedmcpser_getTestReportData({
  scenarioName: "[Test Name]",
  applicationName: "[App Name]",
  baseUrl: "[URL]",
  browser: "Chromium (Playwright)",
  platform: "Windows",
  device: "Desktop",
  loginCredentials: { username: "testuser", password: "****" },
  useRecordedData: true, // ✅ MUST BE TRUE - gets accurate timing from recording
  healedSteps: healedStepsCount, // Pass count of healed steps
  // ❌ DO NOT pass steps parameter when useRecordedData: true
  // Passing steps causes 0ms timing - let tool read from recording
});

// Timing data is in timingData.steps with accurate milliseconds from recording
```

Response Format:

```json
{
  "scenarioName": "Test Name",
  "applicationName": "App Name",
  "executionSummary": {
    "totalSteps": 5,
    "passedSteps": 5,
    "failedSteps": 0,
    "healedSteps": 2,
    "totalExecutionTime": 5200,
    "startTime": "2026-01-28T10:30:00Z",
    "endTime": "2026-01-28T10:30:05Z"
  },
  "steps": [
    {
      "stepNumber": 1,
      "command": "Navigate...",
      "mcpTool": "browser_navigate",
      "testData": "URL: ...",
      "timeTaken": 1200,
      "status": "passed"
    }
  ]
}
```

9.2 Load Healer HTML Template from Build Folder:

```javascript
// Read the HealerTemplate.html from build folder
const templatePath = "[workspace]/build/HealerTemplate.html";
const htmlTemplate = await read_file(templatePath, 1, -1);
```

9.3 Merge Timing + Test Data and Generate Complete HTML Report:

**HYBRID APPROACH: Combine recorded timing with manual test data and locator changes**

```javascript
// Step 1: Merge timing data from recording with manual test data
const mergedSteps = timingData.steps.map((step) => {
  const manualData = manualTestData.find(
    (m) => m.stepNumber === step.stepNumber,
  );
  const locatorFix = locatorChanges.find(
    (l) => l.stepNumber === step.stepNumber,
  );

  return {
    stepNumber: step.stepNumber,
    command: step.command,
    testData: manualData?.testData || step.testData || "-",
    timeTaken: step.timeTaken, // Accurate timing from recording
    status: step.status,
    healStatus: locatorFix?.healStatus || null, // 'healed', 'failed', or null
    errorMessage: step.errorMessage || "",
  };
});

// Step 2: Generate steps table HTML with status differentiation
let stepsHtml = "";
mergedSteps.forEach((step) => {
  // Determine status class and badge based on heal status
  let statusClass = "status-passed";
  let statusBadge = "✅ Passed";
  let statusBadgeClass = "status-passed";

  if (step.healStatus === "healed") {
    statusClass = "status-healed"; // Yellow/amber styling
    statusBadge = "🔧 Healed";
    statusBadgeClass = "status-healed";
  } else if (step.status === "failed" && step.healStatus === "failed") {
    statusClass = "status-failed";
    statusBadge = "❌ Failed (Unhealed)";
    statusBadgeClass = "status-failed";
  } else if (step.status === "failed") {
    statusClass = "status-failed";
    statusBadge = "❌ Failed";
    statusBadgeClass = "status-failed";
  } else if (step.status === "missed") {
    statusClass = "status-missed";
    statusBadge = "⚠️ Missed";
    statusBadgeClass = "status-missed";
  }

  const testDataEscaped = step.testData
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const errorEscaped = step.errorMessage
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  stepsHtml += `
    <tr class="${statusClass}">
      <td>${step.stepNumber}</td>
      <td><span class="status-badge ${statusBadgeClass}">${statusBadge}</span></td>
      <td>${step.command}</td>
      <td>${testDataEscaped}</td>
      <td>${step.timeTaken}ms</td>
      <td>${errorEscaped ? `<span class="error-message">${errorEscaped}</span>` : "-"}</td>
    </tr>
  `;
});

// Step 3: Generate locator changes table HTML (show ALL changes)
let locatorChangesHtml = "";
if (locatorChanges.length > 0) {
  locatorChanges.forEach((change, index) => {
    const statusEmoji = change.healStatus === "healed" ? "✅" : "❌";
    const oldLocatorEscaped = change.oldLocator
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const newLocatorEscaped = change.newLocator
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    locatorChangesHtml += `
      <tr>
        <td>${index + 1}</td>
        <td><span class="file-name">${change.fileName}</span></td>
        <td><span class="line-number">Line ${change.lineNumber}</span></td>
        <td><code class="locator-old">${oldLocatorEscaped}</code></td>
        <td><code class="locator-new">${newLocatorEscaped}</code></td>
        <td><span class="change-reason">${statusEmoji} ${change.reason}</span></td>
      </tr>
    `;
  });
} else {
  locatorChangesHtml = `
    <tr>
      <td colspan="6" class="no-changes-message">
        ✅ No locator changes were needed - all selectors worked correctly!
      </td>
    </tr>
  `;
}

// Step 4: Calculate timing breakdown and metrics
const totalSteps = mergedSteps.length;
const passedSteps = mergedSteps.filter(
  (s) => s.status === "passed" && !s.healStatus,
).length;
const healedStepsDisplay = mergedSteps.filter(
  (s) => s.healStatus === "healed",
).length;
const failedSteps = mergedSteps.filter((s) => s.status === "failed").length;
const missedSteps = mergedSteps.filter((s) => s.status === "missed").length;
const passRate = (
  ((passedSteps + healedStepsDisplay) / totalSteps) *
  100
).toFixed(1);

// Use total time from getTestReportData (sum of all step timings)
const totalTimeMs = timingData.summary.totalTimeMs || 0;

// Format timing (convert ms to readable format)
const formatTime = (ms) => {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

// Step 5: Populate ALL template placeholders
const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
const htmlReport = htmlTemplate
  .replace(
    /{{SCENARIO_NAME}}/g,
    timingData.metadata?.scenarioName || "Test Scenario",
  )
  .replace(/{{TIMESTAMP}}/g, timestamp)
  .replace(
    /{{APPLICATION_NAME}}/g,
    timingData.metadata?.applicationName || "Application",
  )
  .replace(/{{BASE_URL}}/g, timingData.metadata?.baseUrl || "-")
  .replace(
    /{{BROWSER}}/g,
    timingData.metadata?.browser || "Chromium (Playwright)",
  )
  .replace(/{{DEVICE}}/g, timingData.metadata?.device || "Desktop")
  .replace(
    /{{LOGIN_USERNAME}}/g,
    timingData.metadata?.loginCredentials?.username || "-",
  )
  .replace(
    /{{LOGIN_PASSWORD}}/g,
    timingData.metadata?.loginCredentials?.password || "****",
  )
  .replace(/{{TOTAL_STEPS}}/g, totalSteps.toString())
  .replace(/{{PASSED_STEPS}}/g, passedSteps.toString())
  .replace(/{{HEALED_STEPS}}/g, healedStepsDisplay.toString())
  .replace(/{{FAILED_STEPS}}/g, failedSteps.toString())
  .replace(/{{MISSED_STEPS}}/g, missedSteps.toString())
  .replace(/{{TOTAL_TIME}}/g, formatTime(totalTimeMs)) // From getTestReportData summary - actual test execution time
  .replace(/{{HEALING_TIME}}/g, healingTimeFormatted) // From browser_evaluate timestamps - total debugging/fixing time
  .replace(/{{PASS_RATE}}/g, passRate)
  .replace(/{{STEPS_TABLE_ROWS}}/g, stepsHtml)
  .replace(/{{LOCATOR_CHANGES_ROWS}}/g, locatorChangesHtml);
```

9.4 Save Generated Report:

```javascript
// Save to tested_scenario_reports folder with timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const reportFileName = `${reportData.scenarioName}_${timestamp}.html`;
const reportPath = `[workspace]/tested_scenario_reports/${reportFileName}`;

// Use create_file to save the generated HTML report
await create_file(reportPath, htmlReport);
```

9.5 Report Output:

- Location: tested*scenario_reports/[ScenarioName]*[timestamp].html
- Contents: Formatted HTML with test execution results
- Includes: Execution summary, step-by-step results, timings, status
- Automation: New report generated each execution with timestamp

Step 10: Complete Workflow Summary

1. **Execute Test**: Run spec file with MCP tools
   - Track manualTestData: URLs, form values, product details, locators used
   - Track locatorChanges: ALL selector adjustments with fileName, lineNumber, old/new locator, reason, healStatus
   - Track healing time: Capture Date.now() at start (via browser_evaluate) and end (before report generation)
   - Timing automatically recorded by UnifiedMCP in background

2. **Document Fixes**: Structure all locator fixes as array objects for table generation
   - Each fix includes: stepNumber, fileName, lineNumber, oldLocator, newLocator, reason, healStatus ('healed' or 'failed')
   - Show ALL changes (successful heals AND failed attempts)

3. **Analyze Page Objects**: Read and understand all page objects used by test
   - Extract method signatures and locators
   - Create method inventory for each page object
   - Validate current structure

4. **Update Page Objects**: Apply fixes to page object files per summarization
   - Fix locator typos in constructors
   - Update CSS selectors to role-based
   - Add explicit waits where needed
   - Run get_errors to validate compilation

5. **Get Timing Data**: Call mcp_unifiedmcpser_getTestReportData with useRecordedData: true
   - ✅ CRITICAL: useRecordedData: true (gets accurate timing from recording)
   - ❌ NEVER pass steps parameter (causes 0ms timing)
   - Include healedSteps count and timing breakdown

6. **Merge Data**: Combine timing from recording + manual test data + locator changes
   - Merge timingData.steps with manualTestData array
   - Add healStatus to steps for visual differentiation
   - Calculate totals: passed, healed, failed-unhealed, missed

7. **Generate HTML Report**: Use build/HealerTemplate.html with complete data
   - Steps table with 3 status classes: passed (green), healed (amber), failed (red)
   - Locator changes table with ALL fixes (healed ✅ and failed ❌)
   - Timing breakdown: Total execution time (from recording) + Healing time (from browser_evaluate timestamps)
   - Healing Time Analysis: Complete duration from first MCP tool call to report generation start
   - Summary cards showing passed/healed/failed counts

8. **Save Report**: Store in tested_scenario_reports with timestamp
   - Professional HTML with visual distinction between healed and failed-unhealed steps
   - Complete timing analysis and locator changes documentation

Step 11: Critical Success Factors

- Clear comments explaining fix

3. Apply replacement
4. Verify syntax is correct

Test File Fix Examples:

```typescript
// BEFORE (incorrect method call)
await loginPage.login("user", "pass");

// AFTER (correct method signature)
await loginPage.fillCredentials("user", "pass");
await loginPage.clickLogin();

// BEFORE (hardcoded data)
const email = "test@example.com";

// AFTER (dynamic data)
const email = `test.${Date.now()}@example.com`;
```

**Priority for Fixes:**

1. Fix page object locators first (in constructor)
2. Fix page object methods second (action/verification methods using this.locatorName)
3. Fix test file method calls third (using corrected page objects)
4. Fix API calls last (ensure ApiClient with ApiEnvLoader is used)
5. Apply ALL replacements using multi_replace_string_in_file
6. Verify syntax and structure are correct

Step 8: Apply Fixes & Validate

1. Use multi_replace_string_in_file to apply ALL fixes efficiently (page objects + test files + API calls)
2. **POST-FIX VALIDATION (MANDATORY):**

   After applying fixes, MUST:

   a. **Run get_errors** on all fixed files:

   ```
   ✓ Execution follows new step order: Execute → Summarize → Understand → Update
   ✓ Use role-based selectors (getByRole) instead of CSS selectors when possible
   ✓ Add explicit waits with timeout: `await expect().toBeVisible({ timeout: 10000 })`
   ✓ Generate dynamic test data: `const uniqueEmail = `test${Date.now()}@example.com``
   ✓ For API calls: Always use testAPI tool with ApiClient + ApiEnvLoader, never direct URLs
   ✓ Ensure api.env is configured for all API tests
   ✓ Run get_errors after applying fixes to validate compilation

   **Healer Reporting (HYBRID APPROACH - CRITICAL):**
   ✓ TRACK during execution: manualTestData, locatorChanges, healingTime (via browser_evaluate)
   ✓ TIMING CAPTURE: Use browser_evaluate to get Date.now() at start and end of process
   ✓ HEALING TIME: Calculate difference between end and start timestamps from browser context
   ✓ STRUCTURE locator changes: {stepNumber, fileName, lineNumber, oldLocator, newLocator, reason, healStatus}
   ✓ MANDATORY: useRecordedData: true in getTestReportData (accurate timing)
   ✓ FORBIDDEN: Passing steps parameter when useRecordedData: true (causes 0ms)
   ✓ MERGE: Combine timingData.steps + manualTestData + locatorChanges
   ✓ VISUAL DISTINCTION: status-passed (green), status-healed (amber), status-failed (red)
   ✓ SHOW ALL: Display all locator changes (healed ✅ and failed ❌)
   ✓ TIMING BREAKDOWN: Total execution time (recording) + Healing time (browser_evaluate)
   ✓ HEALING ANALYSIS: Time includes MCP execution, locator identification, and code fixes
   ✓ USE: build/HealerTemplate.html (not reportTemplate.html)
   ✓ POPULATE: Both tables (steps + locator changes) with complete data
   ✓ SAVE: tested_scenario_reports with timestamp
   ```

ENHANCED WORKFLOW EXECUTION ORDER:

1. **Execute**: Run spec file with MCP tools, perform all steps unless issue with application/test data
   - Load and parse test file
   - Identify test type (web, mobile, API, hybrid)
   - Search for page objects used
   - Execute each test step with MCP tools
   - Document all issues/locator fixes discovered
   - Track which steps passed/failed and any locator adjustments needed

2. **Summarize**: Document all locator fixes made during execution
   - Track selector adjustments (CSS → role-based, specificity)
   - Document alternative selectors that worked
   - Create summary of needed page object updates
   - List all issues encountered (timing, visibility, state, etc.)

3. **Understand**: Analyze all page objects used by test
   - Read ALL page object files
   - Extract method signatures and locators
   - Create method inventory for each page object
   - Validate current structure and identify improvements

4. **Update**: Apply all fixes to page objects per summarization
   - Fix locator typos in constructors
   - Update CSS selectors to role-based
   - Fix methods to use class locators
   - Add missing methods
   - Add explicit waits
   - Run get_errors to validate compilation

5. **Generate Report**: Use getTestReportData + template approach
   - Call mcp_unifiedmcpser_getTestReportData with execution steps
   - Load build/reportTemplate.html
   - Populate template with JSON data
   - Save generated report to tested_scenario_reports

Now debug and fix the Playwright test provided by the user.
