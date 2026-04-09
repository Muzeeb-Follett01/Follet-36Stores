Execute Test Case - Automated Test Runner

Parse and execute the test case step-by-step using UnifiedMCP browser/mobile/API automation tools. Complete the entire test scenario without stopping unless encountering fatal errors.

---

# **CRITICAL WORKFLOW RULES - MANDATORY COMPLIANCE**

This section defines ABSOLUTE requirements that MUST be followed in ScriptGenerator mode. Violation of these rules invalidates the entire workflow.

---

## ⚠️ WORKFLOW VALIDATION CHECKPOINTS

Before proceeding to ANY step, verify:

1. ✅ **Test case parsed?** → If NO, cannot proceed to Step 2
2. ✅ **User approved execution?** → If NO, STOP immediately (Step 1 checkpoint)
3. ✅ **Test executed with MCP tools?** → If NO, cannot proceed to Step 7
4. ✅ **Browser closed after execution?** → If NO, MANDATORY before Step 7
5. ✅ **Page objects generated?** → If NO, cannot proceed to Step 7.5
6. ✅ **Test script generated?** → If NO, cannot proceed to Step 8
7. ✅ **Report generated?** → If NO, workflow incomplete

---

## ❌ PROHIBITED ACTIONS - GLOBAL

**These actions are FORBIDDEN at ANY point in ScriptGenerator workflow:**

1. ❌ **NEVER skip MCP tool execution**
   - Do NOT jump directly from Step 2 (Detect Test Type) to Step 7 (Generate Page Objects)
   - Do NOT generate scripts without executing test first
   - Do NOT infer execution results - actual execution is MANDATORY

2. ❌ **NEVER leave browser open after execution**
   - Do NOT proceed to Step 7 without closing browser
   - Do NOT generate report with browser still running
   - Browser cleanup is MANDATORY after Step 6 completes

3. ❌ **NEVER skip script generation (Step 7)**
   - Do NOT proceed to Step 8 without generating Page Objects
   - Do NOT proceed to Step 8 without generating test script
   - Do NOT skip tool activation (mcp_unifiedmcp_generatePlaywrightScript)

4. ❌ **NEVER skip report generation (Step 8)**
   - Do NOT end workflow without generating HTML report
   - Do NOT skip create_file operation for report
   - Do NOT skip hybrid timing + test data merge

5. ❌ **NEVER clear recording before report generation**
   - Recording data is essential for timing metrics
   - Clearing destroys execution evidence
   - Only clear when starting completely new test scenario

---

## ✅ REQUIRED ACTIONS - GLOBAL

**These actions are MANDATORY for all ScriptGenerator executions:**

1. ✅ **ALWAYS execute test using MCP tools (Step 3-6)**
   - For Web: browser_navigate, browser_snapshot, browser_click, browser_type, browser_verify_text_visible
   - For Mobile: mobile_launch_app, mobile_tap_on_coordinates, mobile_take_screenshot
   - For API: testAPI (never curl/PowerShell)

2. ✅ **ALWAYS close browser after execution completes**
   - After Step 6 (Error Handling) completes successfully
   - Before Step 7 (Generate Page Objects) begins
   - Use: `await mcp_unifiedmcp_browser_tabs({ action: "close" })`

3. ✅ **ALWAYS generate Page Objects (Step 7)**
   - Create/extend page object files for all accessed pages
   - Follow naming conventions (Step 7.2.2)
   - Validate with get_errors before presenting

4. ✅ **ALWAYS generate test script (Step 7.5)**
   - Activate API test generation tools if needed
   - Use mcp_unifiedmcp_generatePlaywrightScript for Web tests
   - Use mcp_unifiedmcp_generateAPIPlaywrightTest for API tests
   - Validate compilation with get_errors

5. ✅ **ALWAYS generate HTML report (Step 8)**
   - Call getTestReportData with useRecordedData: true
   - Merge timing data with manual test data log
   - Use create_file with build/GeneratorTemplate.html template
   - Save to tested_scenario_reports/ with timestamp

---

## 🔒 WORKFLOW EXECUTION ORDER

**Steps MUST execute in this exact sequence:**

1. Parse Test Case → 2. User Approval → 3-6. **Execute with MCP Tools** → **Close Browser** → 7. Generate Page Objects → 7.5. Generate Test Script → 8. Generate Report → Done

**Forbidden shortcuts:**
- Parse → Generate Scripts (skips execution)
- Execute → Generate Report (skips scripts)
- Execute → Done (skips scripts + report)

---

EXECUTION WORKFLOW:

Step 1: Parse Test Case

If work item ID provided (format: "workitem <number>"):
  - Check if input starts with "workitem " (literal match, not case-sensitive)
  - Extract ID: parseInt(input.replace('workitem ', ''))
  - Import: `import { getWorkItem } from '../../utils/azure/getWorkItem'`
  - Fetch: `const testCase = await getWorkItem(workItemId)`
  - Log: "📋 Fetched test case from Azure DevOps Work Item #<id>"
  - Continue to step parsing below ↓

If file path provided (.txt/.csv/.xlsx): 
  - Use read_file to load content
  - Continue to step parsing below ↓

If text provided: 
  - Parse steps directly
  - Continue to step parsing below ↓

Extract all test steps, test data, and expected results
Identify the application/module name for page organization

**Display Test Case Analysis in Chat:**

After parsing, present a structured summary to the user:

```
📋 **Test Case Analysis**

**Application:** [Application Name]
**Test Type:** [Web Test / Mobile Test / API Test / Hybrid Test]

**Test Steps Identified:**
1. [First step description]
2. [Second step description]
...

**Test Data:**
- [Key data point 1]
- [Login credentials if applicable]
- [Product/entity names]

**Expected Result:**
- [Expected outcome 1]

---
▶️ Proceeding with test execution...
```

**What to Include:**
- Application/module name (e.g., "DemoWebShop", "Salesforce", "TechStore API")
- Test type (Web/Mobile/API/Hybrid) - detected from URL patterns, API endpoints, or mobile actions
- Numbered list of test steps in plain language
- Key test data extracted (credentials, product names, order IDs, etc.)
- Expected results from test case
- Clear separator before execution begins

**User Approval Required:**

After displaying the test case analysis above:

1. **STOP execution** - Do not proceed to any further steps
2. Ask the user: "**Would you like to proceed with executing this test case?** (Reply 'yes' to continue or 'no' to cancel)"
3. **Wait for user response:**
   - If user responds "yes", "proceed", "continue", "ok", or "go": Continue to Step 2 (Detect Test Type)
   - If user responds "no", "cancel", "stop": Terminate execution gracefully
   - If user requests changes: Address concerns, update analysis if needed, and ask again

**CRITICAL:** Do NOT proceed to Step 2 until user explicitly approves.

Step 2: Detect Test Type

Web Test: URLs, browser actions (navigate, click, type, verify)
Mobile Test: App actions (launch, tap, swipe, device buttons)
API Test: HTTP methods (GET, POST, PUT, DELETE), endpoints

Step 3: Execute Steps Using UnifiedMCP Tools

**CRITICAL - Automatic Test Recording:**

UnifiedMCP automatically records ALL test execution data in the background including:

- Step commands and test data
- **Execution timestamps** (start/end for each step)
- Success/failure status
- Error messages
- MCP tool used

**No manual timing tracking required** - the recording system captures everything automatically.

**⚠️ CRITICAL - RECORDING DATA PROTECTION:**

- **NEVER call `clearRecording` tool** during or after test execution
- **NEVER call `clearRecording` tool** before generating report
- Recording data is essential for accurate timing metrics in reports
- **Clearing recording will result in 0ms timing for all steps**
- Let recording persist for accurate performance analysis throughout entire workflow
- Only clear recording when starting a completely new, unrelated test scenario

**❌ DO NOT USE MANUAL STEP TRACKING:**

- Do NOT create manual `executionSteps` arrays
- Do NOT pass `steps` parameter to getTestReportData
- Manual tracking causes **0ms timing** for all steps
- UnifiedMCP automatic recording provides accurate timing - use it exclusively

For Web Tests:

browser_navigate - Navigate to URL
browser_snapshot - Get page structure (ALWAYS do this before interactions)
browser_click - Click element using ref from snapshot
browser_type - Type text into input
browser_fill_form - Fill multiple form fields
browser_verify_text_visible - Verify text appears
browser_verify_element_visible - Verify element exists
browser_take_screenshot - Capture evidence
browser_wait_for - Wait for text/element
For Mobile Tests:

mobile_list_available_devices - List devices
mobile_launch_app - Launch app
mobile_tap_on_coordinates - Tap screen
mobile_take_screenshot - Capture screenshot
For API Tests:

**CRITICAL: Use testAPI tool for API requests**
testAPI - Send HTTP requests (POST, GET, PUT, PATCH, DELETE)
Verify response status, body, headers
DO NOT use run_in_terminal, curl, or PowerShell for API calls
DO NOT use direct request.post() or request.get() - always use testAPI tool
Note: All API URLs must be registered in api.env - see section 7.1 for environment setup

**Format testData for Report Expansion:**
When calling testAPI, format testData with blank line separator (\\n\\n) between Request and Response:

```
Request: <METHOD> <ENDPOINT>
Headers: { key: value }
Body: { key: value } or Body: none

Response: Status <CODE>
Headers: { key: value }
Body: <RESPONSE>
```

Example: "Request: POST /api/order_status\\nHeaders: { Content-Type: application/json }\\nBody: { order_id: 77 }\\n\\nResponse: Status 200\\nHeaders: { ... }\\nBody: { success: true }"

The blank line triggers automatic side-by-side expansion in reports.

Step 4: Handle Dynamic Elements

Always browser_snapshot before interactions to get current page state
Extract exact ref value from snapshot (e.g., [ref=e14])
Use ref in click/type tools: browser_click({ element: "Login link", ref: "e14" })

Step 5: Validation

Verify expected outcomes after critical steps
Take screenshots for documentation
Log important data (order numbers, IDs)

Step 6: Error Handling

Take screenshot on failures
Re-snapshot to get updated elements
Retry with alternative selectors (up to 2 attempts)
Do not Continue to next step if failing
**For API errors**: Capture response body and status code from testAPI tool output

---

## **MANDATORY: Close Browser After Execution**

**CRITICAL CHECKPOINT - BROWSER CLEANUP**

After Step 6 (Error Handling) completes and before proceeding to Step 6.5 (Extend Page Objects):

1. **Close all browser tabs:**
   ```javascript
   // Close browser to free resources
   await mcp_unifiedmcp_browser_tabs({ action: "close" });
   ```

2. **Verify closure:**
   - No browser windows should remain open
   - All Playwright browser contexts terminated
   - Resources released for script generation phase

3. **Log completion:**
   ```
   ✅ Browser closed after test execution
   ✅ Proceeding to Page Object generation (Step 6.5)
   ```

**⚠️ FORBIDDEN:**
- ❌ Proceeding to Step 6.5 with browser still open
- ❌ Generating scripts while browser is running
- ❌ Leaving browser cleanup until after report generation

**Why This Matters:**
- Prevents resource leaks
- Ensures clean state for subsequent tests
- Separates execution phase from generation phase

---

Step 6.5: Extend Existing Page Objects (Silent Extension)

**Objective**: Add missing locators and methods to existing POMs without modifying existing code. No documentation required.

**6.5.1 - Find and Read Existing Page Objects:**

Search for existing page objects:

- Use file_search: `pages/**/<AppName>*.ts` or `pages/**/*<keyword>*.ts`
- Examples: `pages/**/login*.ts`, `pages/**/checkout*.ts`, `pages/Ecommerce/**/*.ts`

Read each existing POM:

- Use read_file to load complete file
- Extract existing locator names from constructor
- Extract existing method names
- Create simple inventory: `LoginPage: has emailInput, passwordInput, loginButton | methods: login(), navigate()`

**6.5.2 - Identify What's Missing:**

Compare execution needs vs existing POM:

- Which elements were accessed during test execution?
- Which locators already exist in POM? (skip these)
- Which locators are missing? (add these)
- Which methods are missing? (add these)

Create addition list of what needs to be added.

**6.5.3 - Add Missing Locators and Methods:**

**Add to constructor (locators only):**

Use replace_string_in_file to add new locators at END of constructor:

```typescript
// Find: last locator + closing brace pattern
oldString: `    this.existingLastLocator = page.locator(...);
  }

  /**`;

// Replace: add new locators before closing brace
newString: `    this.existingLastLocator = page.locator(...);
    this.orderConfirmation = page.getByText('Order placed successfully');
    this.trackingLink = page.getByRole('link', { name: 'Track Order' });
  }

  /**`;
```

**Add methods (after existing methods):**

Use replace_string_in_file to add new methods before class closing:

```typescript
// Find: last method + closing brace
oldString: `  async existingLastMethod() {
    // ...
    return this;
  }
}`;

// Replace: add new methods
newString: `  async existingLastMethod() {
    // ...
    return this;
  }

  /**
   * Verify order success message
   */
  async verifyOrderSuccess() {
    await expect(this.orderConfirmation).toBeVisible();
    return this;
  }

  /**
   * Click tracking link
   */
  async clickTrackingLink() {
    await this.trackingLink.click();
    return this;
  }
}`;
```

**Rules:**

- Add locators at END of constructor
- Add methods at END of class
- Maintain existing code exactly as-is
- Use role-based selectors (getByRole, getByLabel, getByText)
- No documentation of additions required

**6.5.4 - Validate and Continue:**

Run get_errors on modified files:

```javascript
await get_errors(["pages/Ecommerce/modifiedPage.ts"]);
```

If errors:

- Fix syntax in NEW code only
- Re-run until clean

If clean:

- Log: ✅ "Extended existing page objects as needed"
- Proceed to Step 7 (test generation)

IMPORTANT: After Step 6.5 is complete, proceed to Step 7 for POM generation/updates

---

**WORKFLOW CHECKPOINT - VERIFY EXECUTION COMPLETE**

Before proceeding to Step 7 (Generate Page Object Model):

1. ✅ **Verify test execution completed:**
   - All test steps executed with MCP tools (Steps 3-6)
   - Browser closed after execution
   - Test data tracked during execution
   - Recording data intact (not cleared)

2. ✅ **If ANY item above is FALSE:**
   - STOP immediately
   - Return to incomplete step
   - DO NOT proceed to code generation

3. ✅ **If ALL items verified:**
   - Log: "✅ Test execution phase complete - proceeding to artifact generation"
   - Continue to Step 7 (Generate Page Objects)

**STRICTLY FORBIDDEN IN THIS CHECKPOINT:**
- ❌ Proceeding to Step 7 without completing execution (Steps 3-6)
- ❌ Generating scripts without execution data
- ❌ Skipping browser closure

---

Step 7: Generate Page Object Model (POM) Files and Test Scripts

BEFORE generating test scripts, create/update Page Object Model files and API helpers following the project structure:

7.1 General Code Reuse Principles (CRITICAL - Apply to ALL artifacts):

**Search Strategy:**

- **For Pages**: Use file\*search({ query: "pages/\*\*/<AppName>\_.ts" })
  - Examples: "pages/Salesforce/**/\*.ts", "pages/**/_login_.ts", "pages/\*_/<keyword>_.ts"
- **For API Helpers**: Use file\*search({ query: "utils/api/\*\*/\_.ts" })
  - Check for: apiClient.ts, apiHelper.ts, apiTestUtils.ts, apiConfig.ts, <AppName>ApiHelper.ts

**Analysis Checklist:**

- Read existing files to understand structure and reusable methods
- **Extract all public method signatures**: methodName(params) → returnType
- Check for similar functionality across subdirectories
- Identify available base classes, authentication patterns, and utilities
- Look for app-specific implementations vs generic utilities
- **Validate method names are used EXACTLY as defined** (case-sensitive)

**Universal Reuse Strategy:**

**For Page Objects (✅ Create as needed):**

1. **If exact match exists** → Read file completely, extract all method signatures, use EXACT names in test
2. **If similar exists** → Read file, document available methods, extend or reference patterns
3. **If nothing exists** → Create new following project conventions

**CRITICAL - Method Validation (MANDATORY):**

- Before using any page object, read the entire file using read_file
- Extract ALL public methods: `async methodName(param: type): Promise<return>`
- Document method names, parameters, and return types
- Use ONLY the exact method names found (DO NOT assume or guess)
- Verify parameter count and types match test data requirements

**For API Helpers (⚠️ Only reuse existing):**

1. **If app-specific helper exists** → Import and use it directly
2. **If only generic utilities exist** → Use ApiClient with environment from api.env
3. **If nothing exists** → Use ApiClient with environment from api.env
4. **NEVER create new API helper files**
5. **Always import from** utils/api/index.ts when available

**API Environment Management (MANDATORY for all API tests):**

Before generating test, ensure API URL is registered in api.env:

1. **Parse api.env** to check if URL exists:
   - Read api.env file from workspace root
   - Search for `<ENV_NAME>_BASE_URL=<URL>` pattern
   - Check if base URL (e.g., http://127.0.0.1:5000) is already registered

2. **If URL NOT found in api.env**:
   - Generate environment name: `<APP>_<IDENTIFIER>`
     - Examples: TECHSTORE_LOCAL, SALESFORCE_DEV, ECOMMERCE_STAGING
   - Use replace_string_in_file to append to api.env under "AUTO-GENERATED ENVIRONMENTS" section:
     ```
     # <App Name> <Environment Description>
     <ENV_NAME>_BASE_URL=<BASE_URL>
     <ENV_NAME>_TIMEOUT=30000
     <ENV_NAME>_RETRIES=3
     ```
   - Log: "✅ Created new environment '<ENV_NAME>' in api.env"

3. **Use environment name in test with ApiEnvLoader**:

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

**Environment Naming Convention:**

- Format in api.env: `<APPLICATION>_<ENVIRONMENT>_BASE_URL`
- Format in code: lowercase (e.g., 'techstore_local', 'salesforce_dev')
- Examples:
  - `http://127.0.0.1:5000` → `TECHSTORE_LOCAL_BASE_URL=http://127.0.0.1:5000`
  - `https://staging.example.com` → `EXAMPLE_STAGING_BASE_URL=https://staging.example.com`
  - `https://api.production.com` → `PRODUCTION_API_BASE_URL=https://api.production.com`

**Import Patterns:**

```typescript
// Page Objects
import { TechStoreLoginPage } from "../../pages/Ecommerce/techStoreLoginPage";

// API Helpers (app-specific)
import { TechStoreApiHelper } from "../../utils/api/techStoreApiHelper";

// API Utilities (generic)
import { ApiClient, ApiTestUtils, ApiConfig } from "../../utils/api";
```

**Best Practices:**

- Document which components are reused vs newly created
- Maintain consistency with existing patterns
- Use apiTest fixture if ApiTestUtils provides it
- Leverage existing validation methods and authentication configs

  7.2 Page Objects:

  7.3 API Helpers (for API/Hybrid tests):

**⚠️ IMPORTANT: DO NOT CREATE NEW API HELPERS. This section is for understanding existing utilities only.**

**7.3.1 File Structure & Location:**

Location Patterns:

- Generic utilities: `utils/api/<utilityName>.ts`
- App-specific helpers: `utils/api/<appName>ApiHelper.ts`
- Examples:
  - utils/api/techStoreApiHelper.ts
  - utils/api/salesforceApiHelper.ts
  - utils/api/sapApiHelper.ts

**7.3.2 Naming Conventions:**

- File: camelCase ending with "ApiHelper" (e.g., techStoreApiHelper.ts)
- Class: PascalCase ending with "ApiHelper" (e.g., TechStoreApiHelper, SalesforceApiHelper)
- Methods: camelCase descriptive names (e.g., verifyOrderStatus, createPayoffOrder)

**7.3.3 API Helper Class Template:**

```typescript
import { APIRequestContext, expect } from "@playwright/test";
import { ApiClient } from "./apiClient"; // Use if extending existing client

/**
 * <AppName> API Helper
 *
 * Provides API testing utilities for <Application Name>
 *
 * @class <AppName>ApiHelper
 */
export class <AppName>ApiHelper {
  readonly request: APIRequestContext;
  readonly baseUrl: string;
  // OR: extend ApiClient if available
  // private apiClient: ApiClient;

  /**
   * Constructor
   * @param request - Playwright APIRequestContext instance
   * @param baseUrl - Base URL for API endpoints
   */
  constructor(request: APIRequestContext, baseUrl: string = "https://api.example.com") {
    console.log("🚀 Initializing <AppName> API Helper");
    this.request = request;
    this.baseUrl = baseUrl;
    // OR: this.apiClient = new ApiClient(request, { baseUrl });
  }

  /**
   * Method description
   * @param param1 - Parameter description
   * @returns Response data
   */
  async <methodName>(param1: string): Promise<any> {
    console.log(`📡 Making API call: ${param1}`);

    const response = await this.request.post(`${this.baseUrl}/endpoint`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        key: param1,
      },
    });

    const responseBody = await response.json();
    console.log(`✅ API Response:`, responseBody);

    // Verify response status
    expect(response.status()).toBe(200);

    return responseBody;
  }

  /**
   * Verification method with assertions
   */
  async verify<Something>(param: string) {
    const responseBody = await this.<methodName>(param);

    // Assertions
    expect(responseBody.success).toBe(true);
    expect(responseBody.data).toBeDefined();

    console.log(`✅ Verification successful`);

    return responseBody;
  }
}
```

```typescript
import { Page, Locator, TestInfo, expect } from "@playwright/test";
import { Helper } from "../../utils/helper"; // Adjust path based on location

/**
 * <PageName> Page Object Model
 *
 * Description of page functionality
 *
 * @class <PageName>Page
 */
export class <PageName>Page {
  // OR use: export default class <PageName>Page {
  // Both patterns are used in the project - check existing similar pages

  readonly page: Page;
  private testInfo?: TestInfo;

  // Locators - ALL defined in constructor
  readonly <locatorName>: Locator;
  readonly <anotherLocator>: Locator;

  /**
   * Constructor - Initialize all locators here
   * @param page - Playwright Page instance
   * @param testInfo - Optional TestInfo for screenshots
   */
  constructor(page: Page, testInfo?: TestInfo) {
    console.log("🚀 Initializing <PageName> page object");
    this.page = page;
    this.testInfo = testInfo;

    // Initialize ALL locators in constructor
    this.<locatorName> = page.getByRole('button', { name: 'Submit' });
    this.<anotherLocator> = page.getByLabel('Username');
    // ... all other locators
  }

  /**
   * Method description
   */
  async <methodName>(param: string) {
    await this.<locatorName>.fill(param);
    await this.<anotherLocator>.click();

    if (this.testInfo) {
      await Helper.attachScreenshotToReport(this.page, "<ScreenshotName>", this.testInfo);
    }
    return this; // For method chaining
  }

  /**
   * Verification method
   */
  async verify<Something>() {
    await expect(this.<locatorName>).toBeVisible();
    return this;
  }
}
```

7.4 Create/Update Files:

**For Page Objects ONLY (✅ Create as needed):**

- Use **create_file** for NEW page objects
- Use **replace_string_in_file** to ADD methods to EXISTING pages
- Follow naming conventions from 7.2.2
- Use locator strategy from 7.2.3 for page elements
- Maintain alphabetical order of locators/methods
- Add JSDoc comments for all methods

**For API Helpers (⚠️ NEVER create new ones):**

- **DO NOT use create_file for API helpers**
- **DO NOT use replace_string_in_file for API helpers**
- Only import and use existing API utilities in test script
- If no suitable utility exists, use direct Playwright request API in test

  7.5 Generate Test Script with POM and API Utilities:

**MANDATORY STEP - SCRIPT GENERATION REQUIRED**

This step is NON-NEGOTIABLE. Script generation MUST occur for every ScriptGenerator execution.

**Pre-Generation Checklist:**
1. ✅ Test executed with MCP tools (Steps 3-6 complete)
2. ✅ Browser closed after execution
3. ✅ Page objects created/extended (Step 7.2-7.4 complete)
4. ✅ Method signatures extracted from all page objects
5. ✅ Recording data preserved for report generation

**If ANY item is FALSE, STOP and complete missing step.**

**FORBIDDEN ACTIONS:**
- ❌ Skipping script generation to "save time"
- ❌ Proceeding to Step 8 without generating test file
- ❌ Assuming user doesn't need script (always generate)

---

**MANDATORY PRE-GENERATION VALIDATION:**

BEFORE generating test script, MUST complete:

1. **Read ALL page object files** found in step 7.1 using read_file
2. **Extract method signatures** from each page object:
   - Method name (exact, case-sensitive)
   - Parameter names and types
   - Return type
3. **Document available methods** in a list:
   ```
   LoginPage: login(username?, password?), clickAutoFill(), navigate()
   ProductsPage: addProductToCart(id: number), closeSuccessDialog()
   ```
4. **Verify test steps** can be mapped to actual methods
5. **DO NOT assume** method names based on patterns or conventions

**Tool Activation:**

- If tools are disabled, activate via activate_api_test_generation_tools
- For WEB tests: Use mcp_unifiedmcp_generatePlaywrightScript
- For API tests: Use mcp_unifiedmcp_generateAPIPlaywrightTest
- For HYBRID tests (Web + API): Use mcp_unifiedmcp_generatePlaywrightScript and mcp_unifiedmcp_generatePlaywrightScript
- Start with minimal parameters: { "testName": "Descriptive_Test_Name" }
- If schema errors occur, adjust incrementally based on error messages only
- Treat as black box via MCP protocol - do NOT read source code to determine parameters

**Test Script Requirements:**

After creating page objects (per sections 7.2-7.4), invoke the appropriate tool:

- **Web tests**: mcp_unifiedmcp_generatePlaywrightScript
- **API tests**: mcp_unifiedmcp_generateAPIPlaywrightTest (generates Playwright API test with ApiClient)
- **Hybrid tests (Web + API)**: mcp_unifiedmcp_generatePlaywrightScript

The generated test should:

- Import page objects from pages/<AppName>/ (created in section 7.2)
- Import ONLY EXISTING API helpers from utils/api/ (never create new ones)
- Import existing utilities from utils/api/index.ts if available (section 7.1)
- Instantiate pages: `const <pageName> = new <PageName>Page(page, testInfo);`
- For API calls:
  - ALWAYS use ApiClient with ApiEnvLoader to load environment from api.env
  - Load and register environment in test.beforeEach:

    ```typescript
    import { ApiClient, ApiConfig } from "../../utils/api";
    import { ApiEnvLoader } from "../../utils/api/apiEnvLoader";

    test.beforeEach(async ({ request }) => {
      const envConfig = ApiEnvLoader.loadEnvironment("<env_name>", "./api.env");
      ApiConfig.registerEnvironment(envConfig);
      apiClient = new ApiClient(request, "<env_name>");
    });
    ```

  - If app-specific helper exists: `const apiHelper = new <AppName>ApiHelper(request);`
  - Environment name must be registered in api.env with \_BASE_URL suffix (see section 7.1)
  - Example: `const apiClient = new ApiClient(request, 'techstore_local');`

- Use page methods: `await <pageName>.<methodName>(params);`
- Avoid direct page.locator() calls for web elements (use page objects)
- NEVER use direct request.get()/post() - always use ApiClient with ApiEnvLoader

**Output:**

- Display both page object/API helper files AND test script in chat
- Report clearly if tool activation fails

**POST-GENERATION VALIDATION (MANDATORY):**

After creating test script, MUST:

1. **Run get_errors** on generated test file:
   ```
   await get_errors(['path/to/generated-test.spec.ts'])
   ```
2. **If errors found**, fix them immediately:
   - Read error messages carefully
   - Check method names match page object definitions
   - Verify parameter counts and types
   - Fix using replace_string_in_file
3. **Re-run get_errors** until no errors remain
4. **Only present to user** when test compiles without errors

Step 8: Generate HTML Report Using Hybrid Approach

**MANDATORY STEP - REPORT GENERATION REQUIRED**

This step is the FINAL DELIVERABLE and is NON-NEGOTIABLE.

**Pre-Report Checklist:**
1. ✅ Test executed with MCP tools (Steps 3-6 complete)
2. ✅ Test data tracked during execution (Step 8.1 data available)
3. ✅ Browser closed after execution
4. ✅ Page objects generated (Step 7.2-7.4 complete)
5. ✅ Test script generated (Step 7.5 complete)
6. ✅ Recording data preserved (not cleared)

**If ANY item is FALSE, STOP and complete missing step.**

**FORBIDDEN ACTIONS:**
- ❌ Skipping report generation
- ❌ Ending workflow without HTML report
- ❌ Using useRecordedData: false
- ❌ Clearing recording before report generation

---

**HYBRID APPROACH: Combine Automatic Timing + Manual Test Data**

The hybrid approach preserves accurate timing from UnifiedMCP recording while adding detailed test data for comprehensive, professional reports.

**⚠️ CRITICAL REQUIREMENTS:**

1. **Track test data DURING execution** (Steps 1-6)
2. **Call getTestReportData IMMEDIATELY after execution** with useRecordedData: true
3. **Merge timing + test data** before generating report
4. **NEVER clear recording** before generating report
5. **Use create_file** to generate HTML from template

**8.1 - Track Test Data During Execution (Steps 1-6):**

While executing test steps, maintain a log of key test data for each step:

```javascript
// Build this array as you execute steps
const manualTestData = [];

// Step 1: Navigate
manualTestData.push({
  stepNumber: 1,
  testData: "URL: http://127.0.0.1:5000",
});

// Step 3: Login
manualTestData.push({
  stepNumber: 3,
  testData:
    "Element: Login button\nCredentials: Auto-filled (testuser/password)",
});

// Step 4: Add to cart
manualTestData.push({
  stepNumber: 4,
  testData: "Product: Laptop\nProduct ID: 1\nPrice: $999.99",
});

// Step 8: Fill form
manualTestData.push({
  stepNumber: 8,
  testData:
    "Name: John Doe\nEmail: test@example.com\nAddress: 123 Main Street, NY",
});

// Continue for all important steps...
```

**What to Track:**

- URLs navigated to
- Form field values (name, email, address)
- Product details (name, ID, price)
- Search queries or input text
- Order numbers, confirmation messages
- Verification data and expected results
- Alert messages and error handling

**8.2 - Get Timing Data from Recording:**

**IMMEDIATELY after test execution completes**, call getTestReportData with useRecordedData: true:

```javascript
// ✅ CORRECT: Call after execution with useRecordedData: true
const timingData = await mcp_unifiedmcpser_getTestReportData({
  scenarioName: "E-commerce Complete Order Flow Test",
  applicationName: "TechStore",
  baseUrl: "http://127.0.0.1:5000",
  browser: "Chromium (Playwright)",
  platform: "Windows",
  useRecordedData: true, // ✅ Gets accurate timing from recording
  // ❌ DO NOT add steps: [...] parameter
});
```

**❌ FORBIDDEN:**

- `useRecordedData: false` - Results in 0ms timing
- Passing `steps: [...]` array - Causes 0ms timing
- Calling before test execution - No data = 0ms
- Clearing recording before this call - Destroys timing

**8.3 - Merge Timing + Test Data:**

Combine recorded timing with manual test data:

```javascript
// Merge timing from recording with manual test data
const mergedSteps = timingData.steps.map((step) => {
  // Find matching manual test data by step number
  const manualData = manualTestData.find(
    (m) => m.stepNumber === step.stepNumber,
  );

  return {
    stepNumber: step.stepNumber,
    command: step.command,
    testData: manualData?.testData || step.testData || "-", // Use manual data if available
    timeTaken: step.timeTaken, // From recording (accurate)
    status: step.status,
    errorMessage: step.errorMessage || "",
  };
});
```

**8.4 - Load HTML Template:**

```javascript
// Read template from build folder
const template = await read_file(
  "c:/Users/.../build/GeneratorTemplate.html",
  1,
  -1,
);
```

**8.5 - Generate HTML Report:**

Populate template with merged data and generate step table rows:

```javascript
// Generate step table rows HTML
let stepsHtml = "";
mergedSteps.forEach((step) => {
  const statusClass =
    step.status === "passed" ? "status-passed" : "status-failed";
  const statusBadge = step.status === "passed" ? "✓ Passed" : "✗ Failed";

  stepsHtml += `
    <tr class="${statusClass}">
      <td>${step.stepNumber}</td>
      <td><span class="status-badge ${statusClass}">${statusBadge}</span></td>
      <td>${step.command}</td>
      <td>${step.testData}</td>
      <td>${step.timeTaken}</td>
      <td>${step.errorMessage || "-"}</td>
    </tr>
  `;
});

// Replace template placeholders (including healing time)
const htmlReport = template
  .replace("{{SCENARIO_NAME}}", timingData.metadata.scenarioName)
  .replace("{{TIMESTAMP}}", timingData.metadata.generatedAt)
  .replace("{{APPLICATION_NAME}}", timingData.metadata.applicationName)
  .replace("{{BASE_URL}}", timingData.metadata.baseUrl)
  .replace("{{BROWSER}}", timingData.metadata.browser)
  .replace("{{DEVICE}}", timingData.metadata.platform)
  .replace("{{LOGIN_USERNAME}}", "testuser (auto-filled)")
  .replace("{{LOGIN_PASSWORD}}", "••••••••")
  .replace("{{TOTAL_STEPS}}", timingData.summary.totalSteps)
  .replace("{{PASSED_STEPS}}", timingData.summary.passedSteps)
  .replace("{{FAILED_STEPS}}", timingData.summary.failedSteps)
  .replace("{{MISSED_STEPS}}", timingData.summary.missedSteps || 0)
  .replace("{{TOTAL_TIME}}", timingData.summary.totalTimeTaken)
  .replace("{{PASS_RATE}}", timingData.summary.passRate)
  .replace("{{STEPS_TABLE_ROWS}}", stepsHtml);
```

**8.6 - Save Report:**

Use create_file to save the generated report:

```javascript
// Generate timestamp for filename
const timestamp = new Date()
  .toISOString()
  .replace(/:/g, "-")
  .replace(/\..+/, "")
  .replace("T", "_");

// Save report
await create_file(
  `tested_scenario_reports/${scenarioName}_${timestamp}.html`,
  htmlReport,
);
```

**8.7 - Report Output:**

- **Location**: tested*scenario_reports/[ScenarioName]*[timestamp].html
- **Contents**: Professional HTML report with:
  - ✅ Accurate test execution timing from MCP recording
  - ✅ Complete test data from manual tracking
  - ✅ Execution summary with pass rate
  - ✅ Step-by-step details with all information
  - ✅ Full audit trail for reproducibility

Step 9: Complete Workflow Summary

1. **Execute Test**: Run steps with MCP tools (timing automatically recorded in background)
2. **Track Test Data**: Manually log important test data during execution (URLs, form values, product details, order numbers)
3. **Generate Page Objects**: Create/update page object files per test structure (extend only, never modify)
4. **Generate Test Script**: Create Playwright test using page objects
5. **Validate Compilation**: Run get_errors to ensure clean TypeScript compilation
6. **Get Timing Data**: **IMMEDIATELY** call `mcp_unifiedmcpser_getTestReportData({ useRecordedData: true })`
   - ⚠️ Call this RIGHT AFTER test execution completes
   - ⚠️ DO NOT call this BEFORE executing tests
   - ⚠️ DO NOT pass steps array parameter
   - ⚠️ DO NOT use useRecordedData: false
7. **Merge Data**: Combine timing data from recording with manual test data log
8. **Generate HTML Report**: Use build/GeneratorTemplate.html template with merged data
9. **Save Report**: Use create_file to store report in tested_scenario_reports/ with timestamp
10. **⚠️ NEVER Clear Recording**: Leave recording data intact throughout entire workflow

**Key Success Factors (HYBRID APPROACH):**

- ✅ **Track test data DURING execution** - Log URLs, form values, product details as you go
- ✅ **Get timing AFTER execution** - Call getTestReportData with useRecordedData: true
- ✅ **Merge both datasets** - Combine timing from recording + test data from manual log
- ✅ **Use create_file** - Generate HTML report from template
- ✅ **NEVER clear recording** before report generation
- ✅ **NEVER use useRecordedData: false** - causes 0ms timing
- ✅ **NEVER pass steps array** when using useRecordedData: true
- ✅ **Result**: Professional report with accurate timing + complete test data

Step 10: Critical Success Factors

**Workflow Compliance:**
✓ **NEVER skip MCP tool execution** - Scripts require execution data
✓ **ALWAYS close browser** after Step 6 completes - Use browser_tabs({ action: "close" })
✓ **ALWAYS generate Page Objects** - Step 7 is mandatory
✓ **ALWAYS generate test script** - Step 7.5 tool activation required
✓ **ALWAYS generate HTML report** - Step 8 with hybrid approach required
✓ **NEVER clear recording** - Preserve timing data until report generated

**Test Execution:**
✓ Use role-based selectors (getByRole) instead of CSS selectors when possible
✓ Add explicit waits with timeout: `await expect().toBeVisible({ timeout: 10000 })`
✓ Generate dynamic test data: `const uniqueEmail = `test${Date.now()}@example.com``
✓ For API calls: Always use testAPI tool with ApiClient + ApiEnvLoader, never direct URLs
✓ Ensure api.env is configured for all API tests

**Page Object Management:**
✓ **NEVER modify existing locators or methods** - extend only
✓ Add new locators at END of constructor with descriptive suffixes
✓ Add new methods at END of class
✓ Example: `this.loginButton` (exists) → add `this.loginButtonActual` (new correct one)

**Report Generation (HYBRID APPROACH - PREVENT 0ms TIMING & EMPTY DATA):**
✓ **TRACK TEST DATA during execution** - Log URLs, form values, product details as you execute steps
✓ **MANDATORY: useRecordedData: true** - Get accurate timing from recording
✓ **FORBIDDEN: useRecordedData: false** - Results in 0ms timing
✓ **FORBIDDEN: Passing steps array when useRecordedData: true** - Causes 0ms timing
✓ **FORBIDDEN: Calling getTestReportData BEFORE test execution** - No data = 0ms
✓ **FORBIDDEN: Clearing recording** before generating report - Destroys timing
✓ **MANDATORY: Call IMMEDIATELY after test execution** - Fresh timing data
✓ **MERGE DATA: Combine timing from recording + test data from manual log**
✓ **USE create_file**: Generate HTML from build/GeneratorTemplate.html
✓ **RESULT**: Professional report with accurate timing + complete test data (no 0ms, no empty fields)

**Code Quality:**
✓ Run get_errors on all generated files before presenting
✓ Fix all compilation errors immediately
✓ Use exact method names from page objects (read file completely)
✓ For code generation: Use mcp_unifiedmcp_generateAPIPlaywrightTest for API tests

CRITICAL RULES:

**Execution:**

- Execute ALL steps - don't stop until complete
- Use browser_snapshot before EVERY interaction to get current refs
- Extract exact ref values - don't guess
- **For API calls: Use testAPI tool ONLY - never use curl, PowerShell, or run_in_terminal**
- Verify after critical actions
- Capture screenshots at key steps
- Be resilient - retry failed steps
- Report progress clearly
- **TRACK TEST DATA: Log important data during execution** (URLs, form values, product details, order numbers)

**Page Object Management:**

- **NEVER modify existing page object code** - only extend
- Add new locators at constructor end with suffix: `_Actual`, `_V2`, `_Fixed`
- Add new methods at class end
- Maintain backward compatibility always

**Report Generation (HYBRID APPROACH - ALL 6 PROTECTIONS):**

1. **TRACK test data DURING execution** - Log URLs, form values, product details (fixes empty data)
2. **ALWAYS use `useRecordedData: true`** - ONLY valid option for timing (fixes Issue #1)
3. **NEVER clear recording** before generating report (fixes Issue #2)
4. **Call getTestReportData IMMEDIATELY after execution completes** - not before (fixes Issue #3)
5. **NEVER create manual steps array or manual tracking for timing** (fixes Issue #4)
6. **NEVER pass steps parameter when useRecordedData: true** (fixes Issue #5)
7. **MERGE timing + test data** - Combine recording timing with manual test data log
8. **USE create_file** - Generate HTML from build/GeneratorTemplate.html template

**Result: Hybrid approach = Accurate timing + Complete test data = Professional report**

**Code Quality:**

- Run get_errors on all generated files before presenting
- Fix all compilation errors immediately
- Use exact method names from page objects (read file completely)
- **For code generation: Use mcp_unifiedmcp_generateAPIPlaywrightTest for API tests**

Now execute the test case provided by the user (text/file path).
