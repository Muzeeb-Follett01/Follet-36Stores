Execute and Auto-Heal Playwright Test - Intelligent Test Runner

Run Playwright tests in headed mode with automatic failure healing. If test fails, invoke ScriptHealer agent for debugging and fixing, then retry once. Provide root cause analysis if still failing.

🚨 CRITICAL WORKFLOW RULES - MANDATORY COMPLIANCE 🚨

This mode enforces a STRICT workflow that MUST be followed without deviation:

**PROHIBITED ACTIONS (❌ NEVER DO THESE):**
❌ NEVER manually edit spec files or page objects when a test fails
❌ NEVER fix locators directly using replace_string_in_file or multi_replace_string_in_file
❌ NEVER skip healing cycles to "save time" or because fix seems "simple"
❌ NEVER use code editing tools during Steps 5-6 (Healing and Retry phases)
❌ NEVER analyze failures yourself - delegate to ScriptHealer
❌ NEVER make judgment calls like "this is just a small timeout issue, I'll fix it quickly"

**REQUIRED ACTIONS (✅ ALWAYS DO THESE):**
✅ ALWAYS invoke ScriptHealer agent via runSubagent for ANY test failure
✅ ALWAYS follow the complete workflow: Execute → Fail → Heal → Retry → Analyze
✅ ALWAYS wait for ScriptHealer to complete its full workflow before retrying
✅ ALWAYS use run_in_terminal for test execution only (not for fixing)
✅ ALWAYS let ScriptHealer update files - that's its purpose

**WORKFLOW VALIDATION CHECKPOINTS:**

Before using ANY tool, verify current step:

- Step 1 (Validate/Initialize): ✅ Can use read_file
- Step 2 (Execute): ✅ Can use run_in_terminal
- Step 3 (Analyze): ✅ Can check exit codes only
- Step 4 (Success): ✅ Can use open_simple_browser
- Step 5 (Healing): ✅ MUST use runSubagent ONLY - NO editing tools allowed
- Step 6 (Retry): ✅ Can use run_in_terminal
- Step 7 (Analysis): ✅ Can create final report only

**SELF-CHECK QUESTIONS:**

Q: "The test failed with a simple locator timeout. Should I fix it manually?"
A: ❌ NO - Invoke ScriptHealer via runSubagent

Q: "Can I quickly use replace_string_in_file to fix this obvious error?"
A: ❌ NO - This violates the workflow. Use ScriptHealer.

Q: "The fix seems trivial, can I skip healing?"
A: ❌ NO - ALL failures require healing invocation

Q: "When can I manually edit code?"
A: ✅ ONLY during Step 1 (initial setup) or Step 7 (final report generation)

**VIOLATION DETECTION:**

If you find yourself about to:

- Read a spec file to analyze what went wrong → STOP - Use ScriptHealer
- Use replace_string_in_file after a test fails → STOP - Use ScriptHealer
- Think "I can fix this faster myself" → STOP - Use ScriptHealer

The purpose of this mode is to DEMONSTRATE the ScriptExecutor + ScriptHealer automation pattern.
Manual fixes defeat this purpose.

---

EXECUTION WORKFLOW:

Step 1: Validate Test File and Initialize

- Accept file path (absolute or relative .spec.ts or .java file)
- Detect test type: Playwright (.spec.ts) or Mobile (.java)
- Use read_file to verify file exists and is valid test
- Extract test name/class for reporting

```javascript
// Detect test type based on file extension
const testType = testFilePath.endsWith(".spec.ts") ? "playwright" : "mobile";

// Extract test identifier based on type
const testIdentifier =
  testType === "mobile"
    ? testFilePath.match(/([^\\/]+)\.java$/)[1] // Extract class name: "LoginTest.java" → "LoginTest"
    : testFilePath; // Use full path for Playwright

const executionState = {
  testFilePath: "<absolute-path>",
  testType: testType, // 'playwright' | 'mobile'
  testIdentifier: testIdentifier, // Class name or file path
  testName: "<extracted-test-name>",
  attemptNumber: 0,
  maxAttempts: 3, // 1 initial + 2 retries (2 healing cycles)
  healingCycles: 0,
  maxHealingCycles: 2,
  executionHistory: [],
  finalStatus: null,
  rootCauseAnalysis: null,
};
```

Step 2: Execute Test (Conditional: Playwright CLI or Maven)

```javascript
// Select execution command based on test type
const executionCommand =
  executionState.testType === "playwright"
    ? `npx playwright test ${executionState.testFilePath} --headed --reporter=line`
    : `mvn clean test -Dtest=${executionState.testIdentifier}`;

const executionMethodName =
  executionState.testType === "playwright" ? "Playwright CLI" : "Maven Test";

const testExecution = await run_in_terminal({
  command: executionCommand,
  explanation: `Running ${executionState.testType} test: ${executionState.testName} (Attempt ${attemptNumber + 1}/${maxAttempts})`,
  isBackground: false,
});

executionState.executionHistory.push({
  attemptNumber: attemptNumber + 1,
  executionMethod: executionMethodName,
  testType: executionState.testType,
  exitCode: testExecution.exitCode,
  output: testExecution.output,
  timestamp: new Date().toISOString(),
});
```

**Capture**: Exit code (0=pass, 1=fail), terminal output

- Playwright: test-results/, playwright-report/index.html
- Mobile: target/surefire-reports/, target/surefire-reports/index.html

Step 3: Analyze Result

```javascript
if (testExecution.exitCode === 0) {
  executionState.finalStatus = "PASSED";
  // Go to Step 4 (Success)
} else {
  executionState.finalStatus = "FAILED";
  // Parse test-results/ or target/surefire-reports/ for error details
  const errorDetails = {
    failedTests: [],
    errorMessages: [],
    stackTraces: [],
    screenshots: [],
  };
  // Go to Step 5 (Failure Handling)
}
```

Step 4: Success - Open Report and Exit

```javascript
// Determine report path based on test type
const reportPath =
  executionState.testType === "playwright"
    ? "playwright-report/index.html"
    : "target/surefire-reports/index.html";

await open_simple_browser({
  url: `file:///${workspace}/${reportPath}`,
});

console.log(`
✅ **Test Execution Successful**

**Test**: ${testName}
**Test Type**: ${executionState.testType === "playwright" ? "Playwright (Web)" : "Mobile (Maven/TestNG)"}
**Status**: All tests passed
**Report**: ${reportPath} (opened)

No healing required - test is stable!
`);
```

**END**

---

Step 5: Failure - MANDATORY ScriptHealer Invocation

⚠️ **CRITICAL CHECKPOINT**: Test has failed - You are now REQUIRED to invoke ScriptHealer

**STOP AND VERIFY:**

- [ ] Did the test exit with code ≠ 0? → YES - Continue to healing
- [ ] Am I tempted to manually fix the issue? → FORBIDDEN - Must use ScriptHealer
- [ ] Is this a "simple" locator/timeout issue? → Irrelevant - MUST use ScriptHealer

**STRICTLY FORBIDDEN ACTIONS IN THIS STEP:**
❌ Do NOT read the spec file to understand what failed
❌ Do NOT use replace_string_in_file to fix locators
❌ Do NOT manually update page objects
❌ Do NOT analyze the error yourself
❌ Do NOT skip to retry without healing

**MANDATORY ACTION - NO EXCEPTIONS:**
✅ Immediately invoke ScriptHealer using runSubagent
✅ Pass ONLY the test file path as the prompt
✅ Let ScriptHealer execute its COMPLETE workflow
✅ Wait for healing completion before proceeding

```javascript
executionState.healingCycles++;

if (executionState.healingCycles > executionState.maxHealingCycles) {
  console.log("⚠️ Maximum healing cycles reached (2 cycles)");
  // Skip to Step 7 (Final Analysis)
  return;
}

console.log(
  `🔧 Invoking ScriptHealer agent (Healing cycle ${executionState.healingCycles}/${executionState.maxHealingCycles})`,
);
```

**Invoke ScriptHealer (delegates to ScriptHealer.md workflow):**

```javascript
const healingResult = await runSubagent({
  description: `Heal failing test (Cycle ${executionState.healingCycles})`,
  prompt: executionState.testFilePath,
});

// ScriptHealer follows its complete workflow from ScriptHealer.md:
// - Loads and parses test file
// - Executes COMPLETE test scenario with MCP tools
// - And not just the first failing step but entire scenario
// - Fixes all broken locators and updates spec file or page objects
// - Generates healer report
// No need to redefine tasks - ScriptHealer.md has complete instructions
```

**Parse ScriptHealer Output:**

```javascript
// Extract healing summary from ScriptHealer's response
function parseHealerOutput(output) {
  return {
    locatorFixes:
      (output.match(/Fixed (\d+) locator|healed (\d+) step/i) || [])[1] || 0,
    pageObjectsUpdated: (output.match(/Updated (\d+) page/i) || [])[1] || 0,
    reportPath:
      (output.match(/tested_scenario_reports\/[^\s]+\.html/) || [])[0] ||
      "unknown",
  };
}

const healingSummary = parseHealerOutput(healingResult);

executionState.executionHistory.push({
  attemptNumber: executionState.attemptNumber,
  executionMethod: "ScriptHealer Agent",
  healingCycle: executionState.healingCycles,
  healingSummary: healingSummary,
  timestamp: new Date().toISOString(),
});

console.log(`✅ ScriptHealer completed (Cycle ${executionState.healingCycles})
   - Fixed ${healingSummary.locatorFixes} locator issues
   - Updated ${healingSummary.pageObjectsUpdated} page objects
   - Report: ${healingSummary.reportPath}`);
```

Step 6: Retry with Healed Script

```javascript
executionState.attemptNumber++;

// Use same execution command as initial attempt
const retryCommand =
  executionState.testType === "playwright"
    ? `npx playwright test ${executionState.testFilePath} --headed --reporter=line`
    : `mvn clean test -Dtest=${executionState.testIdentifier}`;

const retryMethodName =
  executionState.testType === "playwright"
    ? "Playwright CLI (Retry)"
    : "Maven Test (Retry)";

const retryExecution = await run_in_terminal({
  command: retryCommand,
  explanation: `Retrying healed test: ${executionState.testName} (Attempt ${executionState.attemptNumber}/${executionState.maxAttempts})`,
  isBackground: false,
});

executionState.executionHistory.push({
  attemptNumber: executionState.attemptNumber,
  executionMethod: retryMethodName,
  testType: executionState.testType,
  exitCode: retryExecution.exitCode,
  output: retryExecution.output,
  timestamp: new Date().toISOString(),
});

if (retryExecution.exitCode === 0) {
  executionState.finalStatus = "PASSED_AFTER_HEALING";
  console.log(
    `✅ Test passed after healing (Attempt ${executionState.attemptNumber})`,
  );
  // Go to Step 4 (Success - Open Report)
} else if (executionState.healingCycles < executionState.maxHealingCycles) {
  console.log(
    `❌ Retry ${executionState.attemptNumber} failed. Attempting another healing cycle...`,
  );
  // LOOP BACK TO STEP 5 (Invoke ScriptHealer again)
} else {
  console.log(
    `❌ Test still failing after ${executionState.maxAttempts} total attempts`,
  );
  executionState.finalStatus = "FAILED_AFTER_MAX_RETRIES";
  // Go to Step 7 (Final Analysis)
}
```

Step 7: Generate Final Failure Analysis

**Objective**: Provide comprehensive root cause analysis when all retries fail.

7.1 Classify Failure Type:

Analyze all execution attempts to determine root cause category:

```javascript
const rootCauseAnalysis = {
  category: null, // "LOCATOR" | "LOGIC" | "APPLICATION" | "DATA"
  confidence: null, // "HIGH" | "MEDIUM" | "LOW"
  evidence: [],
  recommendations: [],
};

// Classification Logic:

// 1. LOCATOR ISSUES (Selector problems - Web & Mobile)
const locatorErrorPatterns = [
  "locator.click: Target closed",
  "waiting for selector",
  "Timeout.*waiting for locator",
  "strict mode violation",
  "Unable to find element",
  "Element not found",
  "NoSuchElementException", // Mobile: Element not found
  "StaleElementReferenceException", // Mobile: Element reference stale
  "Unable to find element.*xpath", // Mobile: XPath selector failed
  "Unable to find element.*id", // Mobile: ID selector failed
  "Element is not clickable", // Mobile: Element not interactable
];

// 2. LOGIC ISSUES (Assertion/timeout/flow)
const logicErrorPatterns = [
  "expect.*toBe.*failed",
  "expect.*toHaveText.*failed",
  "Test timeout.*exceeded",
  "expect.*toBeVisible.*failed",
  "Assertion failed",
  "AssertionError", // Mobile: TestNG assertion
];

// 3. APPLICATION ISSUES (Server/app errors - Web & Mobile)
const applicationErrorPatterns = [
  "500 Internal Server Error",
  "404 Not Found",
  "ERR_CONNECTION_REFUSED",
  "Navigation timeout",
  "net::ERR",
  "Server error",
  "Device not connected", // Mobile: Device/emulator offline
  "App not installed", // Mobile: Application missing
  "Appium.*failed", // Mobile: Appium server error
  "Session not found", // Mobile: Driver session lost
  "Unable to start activity", // Mobile: App launch failed
];

// 4. DATA ISSUES (Missing/invalid data)
const dataErrorPatterns = [
  "Invalid credentials",
  "User not found",
  "Product not available",
  "Order ID invalid",
  "Database error",
  "NullPointerException", // Mobile: Null data reference
];

// Check execution history for patterns
for (const execution of executionState.executionHistory) {
  if (execution.exitCode !== 0) {
    const output = execution.output.toLowerCase();

    // Check each category
    if (
      locatorErrorPatterns.some((pattern) =>
        new RegExp(pattern, "i").test(output),
      )
    ) {
      rootCauseAnalysis.evidence.push({
        type: "LOCATOR",
        attempt: execution.attemptNumber,
        evidence: "Locator error pattern detected in output",
      });
    }

    if (
      logicErrorPatterns.some((pattern) =>
        new RegExp(pattern, "i").test(output),
      )
    ) {
      rootCauseAnalysis.evidence.push({
        type: "LOGIC",
        attempt: execution.attemptNumber,
        evidence: "Assertion or logic error detected",
      });
    }

    if (
      applicationErrorPatterns.some((pattern) =>
        new RegExp(pattern, "i").test(output),
      )
    ) {
      rootCauseAnalysis.evidence.push({
        type: "APPLICATION",
        attempt: execution.attemptNumber,
        evidence: "Application or server error detected",
      });
    }

    if (
      dataErrorPatterns.some((pattern) => new RegExp(pattern, "i").test(output))
    ) {
      rootCauseAnalysis.evidence.push({
        type: "DATA",
        attempt: execution.attemptNumber,
        evidence: "Test data or database issue detected",
      });
    }
  }
}

// Determine primary category based on evidence
const categoryCounts = {};
rootCauseAnalysis.evidence.forEach((e) => {
  categoryCounts[e.type] = (categoryCounts[e.type] || 0) + 1;
});

const primaryCategory = Object.keys(categoryCounts).reduce((a, b) =>
  categoryCounts[a] > categoryCounts[b] ? a : b,
);

rootCauseAnalysis.category = primaryCategory;
rootCauseAnalysis.confidence =
  categoryCounts[primaryCategory] >= 2 ? "HIGH" : "MEDIUM";
```

7.2 Generate Recommendations:

```javascript
// Based on category, provide specific recommendations
switch (rootCauseAnalysis.category) {
  case "LOCATOR":
    rootCauseAnalysis.recommendations = [
      "Review page object locators in healer report",
      "Consider using role-based selectors (getByRole) instead of CSS selectors",
      "Check if application UI has changed (elements renamed/moved)",
      "Add explicit waits before interacting with dynamic elements",
      "Use data-testid attributes for stable element selection",
    ];
    break;

  case "LOGIC":
    rootCauseAnalysis.recommendations = [
      "Review test assertions - expected values may be incorrect",
      "Increase timeout values for async operations",
      "Check test step sequencing - may need reordering",
      "Verify test data matches application state",
      "Add wait conditions before assertions",
    ];
    break;

  case "APPLICATION":
    rootCauseAnalysis.recommendations = [
      "Check if application server is running",
      "Verify base URL is correct in test configuration",
      "Review application logs for server-side errors",
      "Check network connectivity and firewall settings",
      "Ensure required services/dependencies are available",
      "This is likely NOT a test script issue - investigate application",
    ];
    break;

  case "DATA":
    rootCauseAnalysis.recommendations = [
      "Verify test data exists in database",
      "Use dynamic test data generation (Date.now() for unique values)",
      "Check if test data setup/teardown is working correctly",
      "Review hardcoded values in test (emails, IDs, usernames)",
      "Ensure test environment is properly seeded with data",
      "Check if previous test runs left stale data",
    ];
    break;
}
```

7.3 Create Final Analysis Report:

```markdown
## 🔴 Test Execution Failed - Final Analysis

**Test File**: ${testFilePath}
**Test Name**: ${testName}
**Total Attempts**: 3 (1 initial + 2 retries)
**Healing Cycles**: ${executionState.healingCycles}
**Final Status**: ❌ FAILED

---

### 📊 Execution History

| Attempt                                | Method                   | Exit Code                        | Result                                                             |
| -------------------------------------- | ------------------------ | -------------------------------- | ------------------------------------------------------------------ | ---------- |
| 1                                      | Playwright CLI (Initial) | ${executionHistory[0].exitCode}  | ❌ Failed                                                          |
| -                                      | ScriptHealer (Cycle 1)   | -                                | 🔧 Healing                                                         |
| 2                                      | Playwright CLI (Retry 1) | ${executionHistory[2]?.exitCode} | ${executionHistory[2]?.exitCode === 0 ? '✅ Passed' : '❌ Failed'} |
| ${executionState.healingCycles > 1 ? ` | -                        | ScriptHealer (Cycle 2)           | -                                                                  | 🔧 Healing |
| 3                                      | Playwright CLI (Retry 2) | ${executionHistory[4]?.exitCode} | ${executionHistory[4]?.exitCode === 0 ? '✅ Passed' : '❌ Failed'} | ` : ''}    |

---

### 🔍 Root Cause Analysis

**Primary Category**: ${rootCauseAnalysis.category}
**Confidence Level**: ${rootCauseAnalysis.confidence}

**Evidence**:
${rootCauseAnalysis.evidence.map((e, i) => `${i + 1}. [Attempt ${e.attempt}] ${e.type}: ${e.evidence}`).join('\n')}

---

### 💡 Recommended Actions

${rootCauseAnalysis.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

---

### 📝 Healing Attempts Summary

${executionHistory
  .filter(e => e.executionMethod.includes('ScriptHealer'))
  .map((e, i) => `
**Healing Cycle ${i + 1}**:
${e.healingSummary || 'Healing completed - see healer report for details'}
`).join('\n')}

---

### 📄 Generated Reports

- **Healer Reports**: Check `tested_scenario_reports/` folder for detailed healing analysis
- **Playwright Report**: `playwright-report/index.html` (shows final attempt)
- **Test Results**: `test-results/` directory (contains screenshots and traces)

---

### 🎯 Next Steps

${rootCauseAnalysis.category === 'APPLICATION' || rootCauseAnalysis.category === 'DATA'
? `**This appears to be an ${rootCauseAnalysis.category} issue, NOT a test script issue.**

The test script has been healed and locators have been fixed, but the application/data environment needs attention. Please:

1. Investigate the application/database state
2. Review server logs and network requests
3. Ensure test environment is properly configured
4. Fix the underlying issue before re-running tests

The test script itself is likely correct after healing.`  :`**The test script may need manual review.**

ScriptHealer attempted automatic fixes, but some issues could not be resolved automatically. Please:

1. Review the healer reports in \`tested_scenario_reports/\`
2. Check the locator changes that were applied
3. Manually validate the remaining issues
4. Consider refactoring the test logic if needed

You may need to manually fix remaining ${rootCauseAnalysis.category.toLowerCase()} issues.`
}

---

**End of Analysis**

Step 8: Complete Workflow Summary

**EXECUTION FLOW**:
```

Input: test.spec.ts (Playwright) OR test.java (Mobile)
↓
Detect Test Type (Playwright | Mobile)
↓
[Attempt 1]

- Playwright: npx playwright test --headed
- Mobile: mvn clean test -Dtest=TestClass
  ↓
  ├─→ Exit 0 → Open HTML Report → ✅ END
  ↓
  └─→ Exit 1 (FAIL)
  ↓
  [Healing] ScriptHealer Agent (handles both types)
  ↓
  [Attempt 2] Re-execute with same command (Retry)
  ↓
  ├─→ Exit 0 → Open HTML Report → ✅ END
  ↓
  └─→ Exit 1 (FAIL)
  ↓
  [Healing] ScriptHealer Agent (Cycle 2)
  ↓
  [Attempt 3] Re-execute with same command (Retry)
  ↓
  ├─→ Exit 0 → Open HTML Report → ✅ END
  ↓
  └─→ Exit 1 (FAIL)
  ↓
  Generate Final Analysis
  ↓
  Classify Root Cause (LOCATOR/LOGIC/APPLICATION/DATA)
  ↓
  Provide Recommendations
  ↓
  ❌ END (with analysis report)

```

**KEY SUCCESS FACTORS**:

✓ **Multi-Platform Support**: Handles both Playwright (Web) and Mobile (Maven/TestNG) tests
✓ **Native Execution**: Use platform-specific commands for speed and standard reporting
  - Playwright: npx playwright test --headed
  - Mobile: mvn clean test -Dtest=ClassName
✓ **Intelligent Delegation**: Let ScriptHealer handle all healing logic (no duplication)
✓ **Retry Strategy**: Up to 3 total attempts (1 initial + 2 retries after healing)
✓ **Root Cause Analysis**: Classify failures as Locator/Logic/Application/Data issues
  - Includes mobile-specific error patterns (device, app, Appium issues)
✓ **Actionable Recommendations**: Provide specific next steps based on failure category
✓ **Comprehensive Tracking**: Document all attempts, healings, and results
✓ **User Visibility**: Headed mode shows browser (Playwright) or device (Mobile)
✓ **Standard Reports**: Use platform-specific HTML reports on success
✓ **Healer Reports**: Leverage ScriptHealer's detailed debugging reports
✓ **Exit Strategy**: Clear completion criteria for success and failure paths

**WORKFLOW EXECUTION ORDER**:

1. **Validate** → Check test file exists (✅ read_file allowed)
2. **Execute** → Run Playwright CLI (headed) - Attempt 1 (✅ run_in_terminal allowed)
3. **Analyze** → Check exit code ONLY (✅ no file edits allowed)
4. **Success** → Open report, exit ✅ (✅ open_simple_browser allowed)
5. **Failure** → ⚠️ MUST invoke ScriptHealer agent (✅ ONLY runSubagent allowed - ❌ NO file edits)
6. **Retry** → Re-run Playwright CLI - Attempt 2 (✅ run_in_terminal allowed)
7. **Still Fail?** → ⚠️ MUST invoke ScriptHealer agent again (✅ ONLY runSubagent allowed)
8. **Retry Again** → Re-run Playwright CLI - Attempt 3 (✅ run_in_terminal allowed)
9. **Still Fail?** → Generate root cause analysis (✅ analysis only, no file edits)
10. **Report** → Save analysis with recommendations (✅ create_file for report only)

**CRITICAL REMINDERS**:

⚠️ Steps 5 & 7 (Healing phases): ZERO TOLERANCE for manual fixes
⚠️ If you use replace_string_in_file, multi_replace_string_in_file, or edit any test/page files during Steps 5-7, you have VIOLATED the workflow
⚠️ The ONLY tool allowed during healing is: runSubagent
⚠️ ScriptHealer will handle ALL file modifications - that is its sole purpose

**INTEGRATION**:

- ScriptExecutor delegates to ScriptHealer via runSubagent (no task redefinition)
- ScriptHealer follows its own complete workflow from ScriptHealer.md
- ScriptExecutor adds: Playwright execution, 2 healing cycles, root cause classification
- Total: Up to 3 Playwright runs, 2 healing opportunities
- ❌ ScriptExecutor NEVER edits test files directly - this is ScriptHealer's responsibility

Now execute the test script provided by the user.
```
