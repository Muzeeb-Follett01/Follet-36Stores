# 🎭 Automation Accelerator - Playwright - AI-Powered

## 🌟 Features

1. **Web Automation** (Built-in Playwright capabilities)
2. **🌐 Enhanced API Testing Utilities** - Advanced API testing with validation and data generation
3. **Visual Comparison** (Built-in Playwright capabilities)
4. **TDD/BDD Support** - Test-driven and behavior-driven development
5. **Sample Test Scripts** - Ready-to-use examples for Web, API, DB testing
6. **🎲 Enhanced Web Data Generation Utilities** - Comprehensive test data generation 
7. **📧 MSTeams Notification** - Automated test result notifications
8. **🚀 Azure Pipelines Integration** - CI/CD pipeline support
9. **🗄️ Enhanced Oracle Database Testing Integration** - Database validation and testing
10. **🎭 UnifiedMCP Integration** - AI-Powered Test Generation
11. **📊 Excel-Driven Test Data Management** - No-code test data control with execute flags and order tracking

## 🤖 AI-Powered Test Generation with UnifiedMCP

The Automation Accelerator now includes **UnifiedMCP** integration for intelligent test generation and automation assistance.

### **What You Can Do:**
- 🎭 **Interactive Web Automation**: Navigate websites, fill forms, click elements with natural language
- 🌐 **Smart API Testing**: Send requests, validate responses, generate comprehensive test suites
- 📝 **Auto Test Generation**: Convert your manual actions into Playwright test scripts
- 🔄 **Combined Workflows**: Mix web interactions with API calls for end-to-end scenarios


## 📋 Prerequisites

### **Core Requirements:**
1. **Node.js** (latest version recommended)
2. **Visual Studio Code** (latest version recommended)

### **For Enhanced API Testing (Included):**
- @faker-js/faker - Test data generation (already installed)
- ajv - JSON schema validation (already installed)  
- jsonpath - JSON path queries (already installed)

### **For Oracle Database Testing (Optional):**
- Oracle Instant Client (FREE - no license required for client libraries)
- Access to Oracle Database (development/test instance)
- Database credentials (username, password, connection string)

### **For UnifiedMCP Integration (Optional):**
- **VS Code** with GitHub Copilot extension
- **UnifiedMCP files** (provided by Automation COE):
  - `index.cjs` file
  - License key for your machine
- **GitHub Copilot subscription** with MCP enabled

## ⚙️ Setup

### **Prerequisites for Accelerator:**
1. **Node.js** (version 16 or higher) - Already installed for Playwright
2. **VS Code** with GitHub Copilot extension
## Prerequisites for UnifiedMCP
3. **UnifiedMCP files** (provided by Automation COE):
   - `index.cjs` file
   - License key for your machine
4. **GitHub Copilot subscription** with MCP enabled

### **Step 1: Basic Installation**

1. **Open the Framework folder in VS Code IDE**
2. **Open Terminal** using the "Terminal" menu in VS Code
3. **Install Dependencies:**
   ```bash
   npm install --force --legacy-peer-deps
   ```
   This installs all required dependencies for the framework to work properly.

4. **Configure Project (Optional):** 
   - Modify `package.json` "name" and "description" as per your requirements

### **Step 2: UnifiedMCP Setup (Optional)**

#### Step 1: Receive Required Files
You will receive:
- `index.cjs` file (place in your workspace root)
- License key (unique to your machine)

#### Step 2: Configure MCP in VS Code
1. Press `SHIFT+CTRL+P` in VS Code
2. Search and select "MCP: User Configuration"
3. Add this configuration (replace paths with your actual paths):

```json
{
  "servers": {
    "UnifiedMCP": {
      "type": "stdio", 
      "command": "node",
      "args": [
        "C:\\Users\\YourUsername\\repo\\Automation-Accelerator-Playwright\\index.cjs",
        "--head",
        "--browser", "chromium", 
        "--licensekey", "YOUR_LICENSE_KEY_HERE"
      ]
    }
  }
}
```

#### Step 3: Start Using AI Automation
1. Open GitHub Copilot Chat in VS Code
2. Set mode to "Agent"
3. Start with natural language prompts!

## Folder structure:

```
Framework
└───.features-gen/              # Auto-generated BDD feature files
└───.git/                       # Git repository files
└───.vscode/                    # VS Code configuration
└───node_modules/               # Default folder for dependency files
└───notify-results/             # Contains Config and result files for MSTeams notification
└───pages/                      # Folder to store Page object files for Application pages
└───playwright-report/          # Default folder for HTML report and screenshots
└───test-results/               # Default folder internally used by Playwright
└───testdata/                   # Folder to store test data files
│   └───Follett/
│       └───follettTestData.xlsx  # Excel test data (single source of truth)
│       └───follettTestData.json  # Original JSON (kept for reference)
└───tests/                      # Folder to store test script files
│   └───chatbot/                # AI chatbot testing examples
│   └───features/               # BDD feature files (Gherkin)
│   └───tdd/                    # Test-driven development scripts
└───tests-examples/             # Playwright sample scripts
└───stepdef/                    # BDD step definitions
└───utils/                      # Contains utilities and helper files
│   └───api/                    # Enhanced API testing utilities
│   └───db/                     # Database testing utilities
│   │   └───oracle/             # Oracle database testing utility
│   └───web/                    # Web automation utilities and data generators
│   excelToTestData.ts          # Excel → JSON loader (reads follettTestData.xlsx)
│   writeOrderResult.ts         # Writes order numbers to output Excel
│   api.env                     # API testing environment configuration
│   azure-pipelines.yml         # Azure DevOps pipeline configuration
│   azure.yml                   # Azure configuration
│   cucumber-report/            # Cucumber HTML reports
│   index.cjs                   # UnifiedMCP integration file
│   oracle.env                  # Oracle database configuration
│   package.json                # Project dependency configuration
│   playwright.config.ts        # Playwright configuration
│   playwrightdocker.yml        # Docker configuration for Playwright
│   README.md                   # Project documentation
└───output/                     # Order results written per test run
│   └───order-results_<timestamp>.xlsx
└───scripts/
│   └───jsonToExcel.js          # One-time JSON → Excel conversion script

```

## 🚀 How to Run

### **Option 1: Playwright UI Mode (Recommended)**
```bash
npm run open:uimode
```
This opens the Playwright UI in a browser window where you can select and run tests interactively.

### **Option 2: Command Line Execution**

**TDD (Test Driven Development):**
```bash
# Configuration: In playwright.config.ts, ensure testDir: './tests/tdd/' is uncommented
npx playwright test
```

**BDD (Behavior Driven Development):** 
```bash
# Configuration: In playwright.config.ts, comment out testDir: './tests/tdd/' and uncomment testDir
npx bddgen && npx playwright test
```

**Specific Test Suites:**
```bash
# Run API tests only
npx playwright test tests/tdd/api.spec.ts

# Run web data generator tests
npx playwright test tests/tdd/web-data-generator.spec.ts

# Run Oracle database tests
npx playwright test --grep "oracle|database"
```

### **Option 3: AI-Generated Tests (UnifiedMCP)**
1. Use natural language prompts in GitHub Copilot Chat
2. Generate tests automatically with UnifiedMCP
3. Run generated tests using standard Playwright commands:
```bash
npm run open:uimode
# or
npx playwright test
```
    
## 📊 Checking Reports

### **Playwright HTML Report**
```bash
npm run open:report
```
Opens the comprehensive Playwright HTML report in your browser with test results, screenshots, and traces.

### **Cucumber BDD Report** 
Open `cucumber-report/report.html` in your browser to view BDD test results in Cucumber format.

### **Execution Dashboard (Cucumber Dashboard)**

Open the Execution Dashboard to browse and compare Cucumber reports across run.

- **File:** `Execution dashboard/cucumber_dashboard.html`
- **Purpose:** Browse, compare, and analyze multiple Cucumber HTML reports (aggregate view and side-by-side comparison).
- **How to open:** Double-click the `cucumber_dashboard.html` file to open it in your default browser, or serve the folder and open via a local web server. Example using `http-server`:

```bash
npx http-server "Execution dashboard" -o
```

The dashboard reads report files (for example from `cucumber-report/`) and provides visual comparison and navigation between runs.

### **Current Test Status**
All tests pass consistently with comprehensive coverage:
- **API Tests**: 14/14 passing ✅  
- **Web Data Generator Tests**: 23/23 passing ✅
- **Total Coverage**: 100% test pass rate (37/37 tests)

---

## � Usage Details for Features

- **API Tests**: 14/14 passing ✅
- **Web Data Generator Tests**: 23/23 passing ✅
- **Total Coverage**: 100% test pass rate (37/37 tests)

```bash
# Run API tests
npx playwright test tests/tdd/api.spec.ts

# Run web data generator tests  
npx playwright test tests/tdd/web-data-generator.spec.ts

# Run both test suites
npx playwright test tests/tdd/api.spec.ts tests/tdd/web-data-generator.spec.ts
```

### **Usage Examples:**

#### 🌐 **UnifiedMCP - Web Automation Examples:**

**Simple Navigation & Screenshot:**
```
Prompt: "Use UnifiedMCP tools and navigate to https://example.com and take a screenshot"
```

**Form Filling Workflow:**
```
Prompt: "Use UnifiedMCP tools and:
1. Go to https://demo-site.com/contact
2. Fill name field with 'Test User'
3. Fill email field with 'test@example.com'
4. Click Submit button
5. Take screenshot of confirmation"
```

**E-commerce Testing:**
```
Prompt: "Use UnifiedMCP tools and:
1. Navigate to online store
2. Search for 'laptop'
3. Add first result to cart
4. Proceed to checkout
5. Fill customer details
6. Generate Playwright test script from these actions"
```

#### 🔗 **UnifiedMCP - API Testing Examples:**

**Simple API Test:**
```
Prompt: "Use #testAPI and send GET request to https://jsonplaceholder.typicode.com/users/1"
```

**Authentication Flow:**
```
Prompt: "Use #testAPI and send POST request to https://api.example.com/auth/login with body: {'username': 'testuser', 'password': 'password123'} and headers: {'Content-Type': 'application/json'}"
```

**API Test Suite Generation:**
```
Prompt: "After testing the API, use #generateAPIPlaywrightTest to create comprehensive test suite"
```

#### 🔄 **UnifiedMCP - Combined Web + API Scenarios:**

**Order Verification Workflow:**
```
Prompt: "Use UnifiedMCP tools and:
1. Navigate to e-commerce site
2. Complete purchase workflow
3. Note the order number
4. Use #testAPI to verify order status via backend API
5. Generate end-to-end Playwright test script"
```

**User Registration + API Validation:**
```
Prompt: "Use UnifiedMCP tools and:
1. Fill user registration form on website
2. Submit registration
3. Use #testAPI to verify user creation in database
4. Generate comprehensive test for regression suite"
```

### **Test Script Generation:**

#### Auto-Generate from Actions:
```
Prompt: "#generatePlaywrightScript to create test script from previous actions"
```

#### Generate API Test Suites:
```
Prompt: "#generateAPIPlaywrightTest for comprehensive API testing"
Prompt: "#generateAPIPlaywrightNegative for negative scenario testing"
Prompt: "#generateAPIPlaywrightEdgeCase for edge case validation"
```

### **Integration with Existing Framework:**

The generated test scripts will:
- ✅ Follow your existing folder structure (`tests/tdd/` or `tests/features/`)
- ✅ Use your configured page objects in `pages/` folder
- ✅ Integrate with your test data in `testdata/` folder
- ✅ Work with existing CI/CD pipeline configuration
- ✅ Generate reports compatible with current reporting setup

### **Best Practices:**

#### For Web Automation:
- Always take snapshots first to understand page structure
- Use specific element descriptions for reliable interactions

---

## 🌐 Enhanced API Testing Utilities

The framework includes **comprehensive API testing utilities** built on top of Playwright's API testing capabilities, providing enhanced features for modern API test automation.

### **🎯 Key Features:**

#### **Enhanced HTTP Client:**
- Built-in request/response validation
- Automatic retry logic with configurable policies
- Response time monitoring and assertions
- Support for multiple authentication methods (Bearer, Basic, API Key)
- File upload/download capabilities
- Concurrent request execution

#### **Intelligent Test Data Management:**
- **Faker.js Integration** - Generate realistic test data
- **Template System** - Create reusable data templates
- **Boundary Value Testing** - Auto-generate edge case data
- **Negative Testing** - Generate invalid data for validation testing
- **Data Validation** - Built-in schema validation

#### **Advanced Response Validation:**
- **Multiple Assertion Methods** - Status, headers, content, response time
- **JSON Schema Validation** - Ensure response structure compliance
- **Custom Validators** - Create business-logic specific validations
- **Response Comparison** - Compare multiple responses for consistency
- **Pattern Matching** - Regex and string pattern validation

#### **Performance & Load Testing:**
- Built-in response time monitoring
- Concurrent request execution
- Load testing capabilities
- Performance report generation

### **🚀 Quick Start:**

#### **Basic Usage:**
```typescript
import { test, expect, ApiClient, ApiTestUtils } from '../utils/api';

test('Enhanced API test', async ({ request }) => {
  const apiClient = new ApiClient(request, 'testing');
  const response = await apiClient.get('/users/1');
  
  // Enhanced assertions
  ApiTestUtils.assertSuccess(response);
  ApiTestUtils.assertStatus(response, 200);
  ApiTestUtils.assertResponseTime(response, 2000);
  
  // Validate response structure
  expect(response.data).toHaveProperty('id', 1);
});
```

#### **Test Data Generation:**
```typescript
test('API test with generated data', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const dataManager = ApiTestDataManager.getInstance();
  
  // Generate realistic user data
  const userData = dataManager.createUser({
    firstName: 'John',
    lastName: 'Doe'
  });
  
  // Or use Faker for custom data
  const customData = dataManager.generateWithFaker([
    { field: 'name', type: 'faker', fakerMethod: 'person.firstName' },
    { field: 'email', type: 'faker', fakerMethod: 'internet.email' },
    { field: 'age', type: 'static', value: 25 }
  ]);
  
  const response = await apiClient.post('/users', userData);
  ApiTestUtils.assertStatus(response, 201);
});
```

#### **Advanced Validation:**
```typescript
test('Advanced response validation', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const response = await apiClient.get('/users/1');
  
  // Multiple validation methods
  const validation = apiClient.validateResponse(response, {
    status: 200,
    statusRange: [200, 299],
    headers: { 'content-type': /application\/json/ },
    contains: 'expected content',
    responseTime: 3000,
    customValidator: (res) => res.data.id > 0
  });
  
  expect(validation.isValid).toBe(true);
  
  // JSON Schema validation
  ApiTestUtils.assertJsonSchema(response.data, {
    type: 'object',
    required: ['id', 'name', 'email'],
    properties: {
      id: { type: 'number' },
      name: { type: 'string' },
      email: { type: 'string', format: 'email' }
    }
  });
});
```

#### **Performance Testing:**
```typescript
test('Performance and load testing', async ({ request }) => {
  const apiClient = new ApiClient(request);
  
  // Concurrent requests
  const requests = [
    { endpoint: '/users/1', method: 'GET' },
    { endpoint: '/users/2', method: 'GET' },
    { endpoint: '/users/3', method: 'GET' }
  ];
  
  const responses = await apiClient.executeParallel(requests);
  
  // Validate all responses
  responses.forEach((response, index) => {
    ApiTestUtils.assertSuccess(response, `Request ${index + 1} failed`);
    ApiTestUtils.assertResponseTime(response, 2000);
  });
  
  // Generate performance report
  const report = ApiTestUtils.generateTestReport(responses, 'Performance Test');
  console.log(`Average Response Time: ${report.summary.averageResponseTime}ms`);
});
```

#### **CRUD Testing with Utilities:**
```typescript
test('Complete CRUD workflow', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const dataManager = ApiTestDataManager.getInstance();
  
  // Generate test data
  const userData = dataManager.createUser();
  
  // CREATE
  const createResponse = await apiClient.post('/users', userData);
  ApiTestUtils.assertStatus(createResponse, 201);
  const userId = createResponse.data.id;
  
  // READ
  const readResponse = await apiClient.get(`/users/${userId}`);
  ApiTestUtils.assertSuccess(readResponse);
  
  // UPDATE
  const updateData = { ...userData, name: 'Updated Name' };
  const updateResponse = await apiClient.put(`/users/${userId}`, updateData);
  ApiTestUtils.assertStatus(updateResponse, 200);
  
  // DELETE
  const deleteResponse = await apiClient.delete(`/users/${userId}`);
  ApiTestUtils.assertStatus(deleteResponse, 204);
});
```

#### **Negative Testing:**
```typescript
test('Negative testing with invalid data', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const dataManager = ApiTestDataManager.getInstance();
  
  // Generate invalid data sets
  const invalidDataSets = dataManager.generateInvalidData('user', ['name', 'email']);
  
  // Test with invalid data
  for (const invalidData of invalidDataSets.slice(0, 3)) {
    const response = await apiClient.post('/users', invalidData.data);
    
    // Expect validation errors
    expect([400, 422]).toContain(response.status);
    console.log(`Testing ${invalidData.description}: Status ${response.status}`);
  }
});
```

### **🔧 Configuration:**

#### **Environment Configuration:**
```typescript
// Configure environments programmatically
ApiConfig.addEnvironment('testing', {
  name: 'testing',
  baseUrl: 'https://reqres.in/api',
  timeout: 30000,
  retries: 3,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});
```

#### **Authentication Support:**
```typescript
// Bearer Token
ApiConfig.addEnvironment('secure', {
  name: 'secure',
  baseUrl: 'https://api.example.com',
  auth: {
    type: 'bearer',
    token: 'your-bearer-token'
  }
});

// API Key
ApiConfig.addEnvironment('apikey', {
  name: 'apikey',
  baseUrl: 'https://api.example.com',
  auth: {
    type: 'apikey',
    apiKey: 'your-api-key',
    apiKeyHeader: 'X-API-Key'
  }
});
```

### **📁 File Structure:**
```
utils/api/
├── apiConfig.ts           # Configuration management
├── apiClient.ts           # Enhanced HTTP client
├── apiTestDataManager.ts  # Test data generation
├── apiTestUtils.ts        # Utilities and fixtures
├── apiEnvLoader.ts        # Environment loader
└── index.ts              # Main exports

testdata/api/
├── templates.json         # Data templates
└── scenarios.json         # Test scenarios
```

### **🎯 Best Practices:**

1. **Use Enhanced Assertions** - Leverage `ApiTestUtils` for comprehensive validation
2. **Generate Test Data** - Use `ApiTestDataManager` for realistic, varied test data  
3. **Environment Configuration** - Set up different environments for testing stages
4. **Response Validation** - Use multiple validation methods for thorough testing
5. **Performance Monitoring** - Always include response time assertions
6. **Negative Testing** - Test with invalid data to ensure proper error handling
7. **Concurrent Testing** - Use parallel execution for performance validation

---

## � API Testing Showcase: Enhanced Utilities vs Built-in Features

### **Why Enhanced API Utilities?**

While **Playwright provides excellent built-in API testing capabilities**, our enhanced utilities add powerful features for **enterprise-grade API testing**, **data-driven scenarios**, and **comprehensive validation**.

### **🔍 Feature Comparison:**

| Feature | Playwright Built-in | Enhanced Utilities | Benefits |
|---------|-------------------|-------------------|----------|
| **HTTP Requests** | ✅ Basic requests | ✅ **Enhanced client with validation** | Built-in retry, response validation, error handling |
| **Test Data** | ❌ Manual creation | ✅ **Faker.js integration** | Realistic, varied test data generation |
| **Response Validation** | ✅ Basic assertions | ✅ **Multi-layered validation** | Schema, custom validators, pattern matching |
| **Performance Testing** | ❌ Manual timing | ✅ **Built-in monitoring** | Response time tracking, load testing |
| **Authentication** | ✅ Manual setup | ✅ **Multiple auth methods** | Bearer, Basic, API Key support |
| **Concurrent Requests** | ✅ Manual Promise handling | ✅ **Built-in parallel execution** | Simplified concurrent testing |
| **Error Handling** | ❌ Manual try/catch | ✅ **Automatic retry logic** | Configurable retry policies |
| **Data Templates** | ❌ Not available | ✅ **Template system** | Reusable data patterns |
| **Negative Testing** | ❌ Manual creation | ✅ **Auto-generate invalid data** | Comprehensive edge case testing |

### **📊 Side-by-Side Examples:**

#### **Basic API Request:**

**Playwright Built-in:**
```typescript
test('basic API test', async ({ request }) => {
  const response = await request.get('https://reqres.in/api/users/2');
  expect(response.status()).toBe(200);
  
  const data = await response.json();
  expect(data.data.id).toBe(2);
});
```

**Enhanced Utilities:**
```typescript
test('enhanced API test', async ({ request }) => {
  const apiClient = new ApiClient(request, 'testing');
  const response = await apiClient.get('/users/2');
  
  // Multiple assertions in one call
  ApiTestUtils.assertSuccess(response);
  ApiTestUtils.assertResponseTime(response, 2000);
  ApiTestUtils.assertJsonSchema(response.data, userSchema);
  
  // Automatic logging and validation
  expect(response.data.data.id).toBe(2);
});
```

#### **Test Data Generation:**

**Playwright Built-in:**
```typescript
test('create user', async ({ request }) => {
  // Manual data creation
  const userData = {
    name: 'John Doe',
    job: 'Software Engineer'
  };
  
  const response = await request.post('https://reqres.in/api/users', {
    data: userData
  });
  expect(response.status()).toBe(201);
});
```

**Enhanced Utilities:**
```typescript
test('create user with generated data', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const dataManager = ApiTestDataManager.getInstance();
  
  // Auto-generate realistic data
  const userData = dataManager.createUser();
  // Or use Faker: dataManager.generateWithFaker([...])
  
  const response = await apiClient.post('/users', userData);
  ApiTestUtils.assertStatus(response, 201);
  
  // Automatic validation and logging
  console.log(`Created user: ${userData.name} (${userData.email})`);
});
```

#### **Performance Testing:**

**Playwright Built-in:**
```typescript
test('performance test', async ({ request }) => {
  const startTime = Date.now();
  const response = await request.get('https://reqres.in/api/users/1');
  const responseTime = Date.now() - startTime;
  
  expect(response.status()).toBe(200);
  expect(responseTime).toBeLessThan(2000);
  
  // Manual concurrent handling
  const promises = [1, 2, 3].map(id => 
    request.get(`https://reqres.in/api/users/${id}`)
  );
  const responses = await Promise.all(promises);
});
```

**Enhanced Utilities:**
```typescript
test('enhanced performance test', async ({ request }) => {
  const apiClient = new ApiClient(request);
  
  // Built-in response time tracking
  const response = await apiClient.get('/users/1');
  ApiTestUtils.assertResponseTime(response, 2000);
  
  // Simplified concurrent execution
  const requests = [
    { endpoint: '/users/1', method: 'GET' },
    { endpoint: '/users/2', method: 'GET' },
    { endpoint: '/users/3', method: 'GET' }
  ];
  
  const responses = await apiClient.executeParallel(requests);
  
  // Auto-generate performance report
  const report = ApiTestUtils.generateTestReport(responses, 'Load Test');
  console.log(`Avg Response Time: ${report.summary.averageResponseTime}ms`);
});
```

#### **Error Handling & Retry Logic:**

**Playwright Built-in:**
```typescript
test('API with retry', async ({ request }) => {
  let attempts = 0;
  let response;
  
  // Manual retry logic
  while (attempts < 3) {
    try {
      response = await request.get('https://reqres.in/api/users/1');
      if (response.status() === 200) break;
    } catch (error) {
      attempts++;
      if (attempts === 3) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  expect(response.status()).toBe(200);
});
```

**Enhanced Utilities:**
```typescript
test('API with enhanced error handling', async ({ request }) => {
  const apiClient = new ApiClient(request, 'testing');
  
  // Built-in retry logic with exponential backoff
  const response = await apiClient.get('/users/1');
  
  // Automatic error handling and logging
  ApiTestUtils.assertSuccess(response);
  
  // Handles 401, 403, 404, 500 errors gracefully
  // Configurable retry policies per environment
});
```

#### **Authentication:**

**Playwright Built-in:**
```typescript
test('authenticated API', async ({ request }) => {
  const response = await request.get('https://api.example.com/protected', {
    headers: {
      'Authorization': 'Bearer your-token-here',
      'Content-Type': 'application/json'
    }
  });
  
  expect(response.status()).toBe(200);
});
```

**Enhanced Utilities:**
```typescript
test('enhanced authentication', async ({ request }) => {
  // Configure once, use everywhere
  const apiClient = new ApiClient(request, 'secure'); // Pre-configured environment
  
  // Authentication handled automatically
  const response = await apiClient.get('/protected');
  ApiTestUtils.assertSuccess(response);
  
  // Supports Bearer, Basic, API Key, Custom headers
});
```

### **🎯 Real-World Benefits:**

#### **1. Reduced Test Maintenance:**
- **Built-in**: 50+ lines for comprehensive API test
- **Enhanced**: 10-15 lines with same coverage

#### **2. Improved Test Data Quality:**
- **Built-in**: Static, repetitive test data
- **Enhanced**: Dynamic, realistic data with Faker.js

#### **3. Better Error Handling:**
- **Built-in**: Manual try/catch, custom retry logic
- **Enhanced**: Automatic retries, graceful error handling

#### **4. Enhanced Reporting:**
- **Built-in**: Basic pass/fail results
- **Enhanced**: Performance metrics, detailed logging, test reports

#### **5. Enterprise Features:**
- Environment management
- Authentication handling
- Schema validation
- Load testing capabilities
- Negative testing automation

### **🚀 Migration Path:**

**Step 1:** Import enhanced utilities:
```typescript
import { ApiClient, ApiTestUtils, ApiTestDataManager } from '../utils/api';
```

**Step 2:** Replace Playwright requests:
```typescript
// Before: const response = await request.get(url);
// After:  const response = await apiClient.get(endpoint);
```

**Step 3:** Enhance assertions:
```typescript
// Before: expect(response.status()).toBe(200);
// After:  ApiTestUtils.assertSuccess(response);
```

**Step 4:** Add advanced features as needed (data generation, performance testing, etc.)

---

## 🎲 Enhanced Web Data Generation Utilities

The framework includes **comprehensive web data generation utilities** built on top of Faker.js, providing realistic, varied, and boundary-tested data for web automation scenarios.

### **🎯 Key Features:**

#### **Form-Specific Data Generation:**
- **Registration Forms** - Complete user profiles with validation-ready data
- **Login Forms** - Secure passwords and realistic usernames  
- **Contact Forms** - Business inquiries with realistic content
- **E-commerce Forms** - Checkout, shipping, and payment data

#### **E-commerce Domain Data:**
- **Customer Profiles** - Realistic customer data with loyalty points and preferences
- **Product Catalogs** - Complete product information with SKUs, ratings, and inventory
- **Order Management** - Complex orders with multiple items, taxes, and shipping
- **Payment Processing** - Valid payment data with proper card formats

#### **Boundary & Edge Case Testing:**
- **String Boundaries** - Empty, minimum, maximum, and exceeding length limits
- **Numeric Boundaries** - Zero, negative, decimal, and overflow values
- **Date Boundaries** - Past, future, invalid dates, and edge cases
- **Invalid Data Sets** - XSS, SQL injection, and malformed input testing

#### **Locale-Specific Data:**
- **Multi-Language Support** - Generate data for different locales (US, UK, DE, FR, JP, ES)
- **Regional Formats** - Date, phone, address, and currency formats
- **Cultural Considerations** - Name conventions and address structures
- **Currency Handling** - Proper decimal places and symbols

### **🚀 Quick Start:**

#### **Basic Registration Form Data:**
```typescript
import { webDataGenerator } from '../utils/web/datagenerator';

test('user registration with generated data', async ({ page }) => {
  const userData = webDataGenerator.generateRegistrationForm();
  
  await page.goto('/register');
  await page.fill('#firstName', userData.firstName);
  await page.fill('#lastName', userData.lastName);
  await page.fill('#email', userData.email);
  await page.fill('#phone', userData.phone);
  await page.fill('#username', userData.username);
  await page.fill('#password', userData.password);
  
  console.log('Registration Data:', {
    name: `${userData.firstName} ${userData.lastName}`,
    email: userData.email,
    location: `${userData.city}, ${userData.state}`
  });
});
```

#### **E-commerce Testing:**
```typescript
test('complete e-commerce workflow', async ({ page }) => {
  const ecommerceData = webDataGenerator.generateEcommerceData();
  
  // Customer interaction
  await page.goto('/login');
  await page.fill('#email', ecommerceData.customer.email);
  
  // Product interaction
  await page.goto(`/product/${ecommerceData.product.productId}`);
  await page.click('#add-to-cart');
  
  // Checkout with payment
  await page.goto('/checkout');
  await page.fill('#cardNumber', ecommerceData.payment.cardNumber);
  await page.fill('#cardHolder', ecommerceData.payment.cardHolder);
  
  console.log('E-commerce Data:', {
    customer: `${ecommerceData.customer.firstName} ${ecommerceData.customer.lastName}`,
    product: ecommerceData.product.name,
    orderValue: `$${ecommerceData.order.total}`
  });
});
```

#### **Boundary Testing:**
```typescript
test('form validation with boundary data', async ({ page }) => {
  const boundaryData = webDataGenerator.generateBoundaryTestData();
  
  await page.goto('/contact');
  
  // Test empty field validation
  await page.fill('#name', boundaryData.strings.empty);
  await page.click('#submit');
  await expect(page.locator('.error-message')).toBeVisible();
  
  // Test maximum length validation
  await page.fill('#name', boundaryData.strings.maxLength);
  await page.click('#submit');
  await expect(page.locator('.error-message')).not.toBeVisible();
  
  console.log('Boundary Testing:', {
    emptyLength: boundaryData.strings.empty.length,
    maxLength: boundaryData.strings.maxLength.length
  });
});
```

#### **Locale-Specific Testing:**
```typescript
test('multi-locale user registration', async ({ page }) => {
  const localeData = webDataGenerator.generateMultiLocaleData();
  
  for (const locale of localeData) {
    await page.goto(`/register?lang=${locale.language}`);
    
    await page.fill('#firstName', locale.user.firstName);
    await page.fill('#lastName', locale.user.lastName);
    await page.fill('#email', locale.user.email);
    
    console.log(`${locale.locale} Data:`, {
      currency: locale.currency,
      dateFormat: locale.dateFormat,
      userName: `${locale.user.firstName} ${locale.user.lastName}`
    });
  }
});
```

### **🎯 Best Practices:**

1. **Use Realistic Data** - Generate data that matches production patterns
2. **Test Boundaries** - Always include edge cases and invalid data testing
3. **Consider Locales** - Test with different regional formats and languages
4. **Validate Security** - Include XSS and injection testing in your data sets
5. **Performance Testing** - Use bulk data generation for load testing scenarios
6. **Maintain Uniqueness** - Ensure generated data doesn't create conflicts

### **📁 File Structure:**
```
utils/web/
├── datagenerator.ts          # Enhanced data generator
└── helper.ts                 # Additional web utilities

tests/tdd/
└── web-data-generator.spec.ts # Comprehensive test examples
```

---

## 📊 Excel-Driven Test Data Management

All Follett test data is managed via an **Excel workbook** at `testdata/Follett/follettTestData.xlsx`, providing a no-code way to control test inputs and execution.

### **🎯 Key Features:**

- **Single Source of Truth** — One Excel file holds all test data for every spec
- **Execute Flag** — Enable/disable tests by setting `Y` or `N` in Excel (no code changes)
- **Per-Row Data** — Each row is one test spec with its own email, products, payment, delivery, etc.
- **Configurable Confirmation** — Each row can set a custom `confirmMessage` for order validation
- **Order Result Tracking** — Order numbers are saved to a separate timestamped output Excel after each run

### **Excel Layout:**

The workbook has a single sheet called **"TestData"** — one row per spec:

| Column | Description | Example |
|--------|-------------|--------|
| `specId` | Spec identifier | `TMSHOP-430` |
| `execute` | Run flag — `Y` to run, `N` to skip | `Y` |
| `store.url` | Target store URL | `https://9975.qa-bkstr.com/` |
| `store.password` | Store password (if gated) | `paycro` |
| `customer.email` | Test customer email | `test@yopmail.com` |
| `delivery.*` | Shipping fields (firstName, lastName, address1, city, zip, phone) | |
| `payment.*` | Payment fields (cardNumber, expMonth, expYear, cvv, nameOnCard) | |
| `product.*` / `products` | Spec-specific product data (arrays stored as JSON strings) | |
| `confirmMessage` | Text validated on order confirmation page | `Thank you` |

Columns use **dot-notation** for nested objects: `delivery.firstName` → `{ delivery: { firstName: "..." } }`.

### **How It Works:**

```
follettTestData.xlsx
        │
        ▼
utils/excelToTestData.ts  ──reads Excel──►  testData object
        │
        ▼
Spec files import testData["TMSHOP-xxx"]
        │
        ▼
After checkout ── writeOrderResult() ──► output/order-results_<timestamp>.xlsx
```

1. **`utils/excelToTestData.ts`** reads the Excel at startup using `convert-excel-to-json`
2. Each row is unflattened from dot-notation into a nested object
3. The `execute` column populates an enabled-specs set, exposed via `isEnabled(specId)`
4. Each spec reads ALL its data from `td = testData["TMSHOP-xxx"]` — changing Excel values is picked up automatically
5. After checkout, `writeOrderResult()` saves the order number to a separate output Excel

### **Usage in Spec Files:**

```typescript
import testData, { isEnabled } from "../../utils/excelToTestData";
import { writeOrderResult } from "../../utils/writeOrderResult";

const td = testData["TMSHOP-430"];
const STORE_PASSWORD = td.store.password;
const CUSTOMER_EMAIL = td.customer.email;
const DELIVERY = td.delivery;
const PAYMENT = td.payment;

test.describe("Follett Bookstore - Complete Order Flow", () => {
  test.skip(!isEnabled("TMSHOP-430"), "Skipped via Excel execute flag");

  test("Complete order flow", async ({ page }, testInfo) => {
    // ... test steps ...
    const orderNumber = await checkoutPage.completeOrder(testInfo, td.confirmMessage);
    await writeOrderResult("TMSHOP-430", orderNumber);
  });
});
```

### **Controlling Test Execution:**

To skip a test, change its `execute` cell from `Y` to `N` in the Excel. To re-enable, set it back to `Y`. No code changes needed.

### **Order Result Output:**

After each run, order numbers are written to `output/order-results_<timestamp>.xlsx`:

| Spec File | Order Number | Timestamp |
|-----------|-------------|----------|
| TMSHOP-430 | NPD1TMU0F | 2026-03-20T14:30:00.000Z |
| TMSHOP-376 | ABC2DEF3G | 2026-03-20T14:35:12.000Z |

The input Excel is never modified.

### **Regenerating Excel from JSON:**

```bash
node scripts/jsonToExcel.js
```

Reads `follettTestData.json` and writes a fresh `follettTestData.xlsx`.

### **Adding a New Test:**

1. Add a new row in the "TestData" sheet with a unique `specId`
2. Set `execute` to `Y` and fill all required columns
3. Create the matching `.spec.ts` file in `tests/tdd/`

### **📁 File Structure:**
```
testdata/Follett/
├── follettTestData.xlsx       # Input Excel (single source of truth)
└── follettTestData.json       # Original JSON (reference)

utils/
├── excelToTestData.ts         # Excel → JSON loader
└── writeOrderResult.ts        # Order result writer

scripts/
└── jsonToExcel.js             # JSON → Excel converter

output/
└── order-results_<timestamp>.xlsx  # Per-run order results
```

> **Important:** Close the Excel file before running tests — an open file causes a file-lock error.

---

## 🗄️ Oracle Database Testing Utility

The framework includes a **comprehensive Oracle database testing utility** for scenarios requiring database validation, web + database integration testing, and data-driven test automation.

### **🎯 What You Can Test:**

#### **Database-Only Scenarios:**
- Data validation and integrity checks
- Stored procedure testing
- Transaction testing with rollback
- Database schema validation
- Performance testing with large datasets

#### **Web + Database Integration:**
- User registration → Database record validation
- E-commerce purchase → Inventory/order updates
- Form submissions → Data persistence verification
- Login flows → Session/audit table updates
- File uploads → Database + file system validation

### **📋 Prerequisites for Oracle Testing:**

#### **1. Oracle Instant Client (FREE)**
- Download from [Oracle Downloads](https://www.oracle.com/database/technologies/instant-client/downloads.html)
- **No license required** - Oracle Instant Client is completely free
- Installation guide: Extract and add to system PATH

#### **2. Database Access**
- Oracle Database instance (development, test, or production)
- Database credentials: username, password, connection string
- Network access to the database server

#### **3. Database Permissions**
User account should have:
- `SELECT`, `INSERT`, `UPDATE`, `DELETE` permissions on test tables
- `CREATE TABLE` permission (optional, for dynamic test data)
- `EXECUTE` permission on stored procedures (if testing procedures)

### **⚙️ Quick Setup:**

#### **Step 1: Install Oracle Instant Client**
```bash
# Windows: Download and extract to C:\oracle\instantclient
# Add C:\oracle\instantclient to PATH environment variable

# Linux/Mac: Download appropriate package
# Set LD_LIBRARY_PATH (Linux) or DYLD_LIBRARY_PATH (Mac)
```

#### **Step 2: Configure Database Connection**
Edit the generated `oracle.env` file:
```bash
# Testing Environment
TEST_ORACLE_USER=your_test_username
TEST_ORACLE_PASSWORD=your_test_password
TEST_ORACLE_CONNECT_STRING=testdb:1521/testpdb

# Development Environment  
DEV_ORACLE_USER=your_dev_username
DEV_ORACLE_PASSWORD=your_dev_password
DEV_ORACLE_CONNECT_STRING=localhost:1521/xepdb1

# Pool Settings (Optional)
TEST_ORACLE_POOL_MIN=2
TEST_ORACLE_POOL_MAX=8
```

### **🚀 Usage in Playwright Scripts:**

#### **Basic Database Testing:**
```typescript
import { test, expect, Oracle } from './utils/db/oracle';

test.beforeAll(async () => {
  // Setup Oracle connection (loads from oracle.env automatically)
  await Oracle.setupFromEnv('testing');
});

test.afterAll(async () => {
  // Cleanup connections
  await Oracle.ConnectionManager.closeAll();
});

test('user data validation', async ({ oracleDb }) => {
  // Setup test data
  await oracleDb.setupData([{
    tableName: 'users',
    data: [
      { id: 1, name: 'John Doe', email: 'john@test.com', status: 'active' },
      { id: 2, name: 'Jane Smith', email: 'jane@test.com', status: 'inactive' }
    ],
    cleanupAfter: true // Automatic cleanup after test
  }]);

  // Query and validate data
  const activeUsers = await oracleDb.query(
    'SELECT * FROM users WHERE status = :status',
    ['active']
  );

  expect(activeUsers).toHaveLength(1);
  expect(activeUsers[0].name).toBe('John Doe');

  // Assert database state
  await oracleDb.assertRowCount('users', 2);
  await oracleDb.assertRecordExists('users', { id: 1, status: 'active' });
});
```

#### **Web + Database Integration Testing:**
```typescript
test('user registration flow', async ({ page, oracleDb }) => {
  // Setup initial database state
  const initialUserCount = await oracleDb.getRowCount('users');

  // Perform web actions
  await page.goto('/register');
  await page.fill('#firstName', 'New User');
  await page.fill('#email', 'newuser@test.com');
  await page.fill('#password', 'securepass123');
  await page.click('#submitBtn');

  // Verify web response
  await expect(page.locator('.success-message')).toBeVisible();
  await expect(page.locator('.success-message')).toHaveText('Registration successful!');

  // Verify database was updated
  await oracleDb.assertRowCount('users', initialUserCount + 1);
  await oracleDb.assertRecordExists('users', {
    first_name: 'New User',
    email: 'newuser@test.com'
  });

  // Verify password was hashed (not stored in plain text)
  const user = await oracleDb.query(
    'SELECT password FROM users WHERE email = :email',
    ['newuser@test.com']
  );
  expect(user[0].password).not.toBe('securepass123'); // Should be hashed
  expect(user[0].password).toContain('$2b$'); // bcrypt hash format
});
```

#### **Transaction Testing:**
```typescript
test('financial transfer transaction', async ({ oracleDb }) => {
  // Setup test accounts
  await oracleDb.setupData([{
    tableName: 'accounts',
    data: [
      { id: 1, account_number: 'ACC001', balance: 1000.00 },
      { id: 2, account_number: 'ACC002', balance: 500.00 }
    ],
    cleanupAfter: true
  }]);

  // Execute transaction (multiple operations as one unit)
  await oracleDb.executeTransaction([
    { 
      sql: 'UPDATE accounts SET balance = balance - :amount WHERE id = :fromAccount',
      bindParams: [200.00, 1]
    },
    { 
      sql: 'UPDATE accounts SET balance = balance + :amount WHERE id = :toAccount',
      bindParams: [200.00, 2]
    },
    {
      sql: 'INSERT INTO transactions (from_account, to_account, amount, transaction_date) VALUES (:from, :to, :amount, SYSDATE)',
      bindParams: [1, 2, 200.00]
    }
  ]);

  // Verify final balances
  await oracleDb.assertColumnValue('accounts', 'balance', 800.00, { id: 1 });
  await oracleDb.assertColumnValue('accounts', 'balance', 700.00, { id: 2 });
  
  // Verify transaction was logged
  await oracleDb.assertRowCount('transactions', 1);
  const transaction = await oracleDb.query(
    'SELECT * FROM transactions WHERE from_account = :from AND to_account = :to',
    [1, 2]
  );
  expect(transaction[0].amount).toBe(200.00);
});
```

### **📊 Advanced Features:**

#### **Database Snapshots:**
```typescript
test('complex business logic with rollback', async ({ oracleDb }) => {
  // Create snapshot of current database state
  const snapshotId = await oracleDb.createSnapshot(
    ['users', 'orders', 'inventory'], 
    'Before complex operation'
  );

  try {
    // Perform complex business operations
    await performComplexBusinessLogic();
    
    // Verify results
    await oracleDb.assertRowCount('orders', 5);
    await oracleDb.assertColumnValue('inventory', 'stock', 95, { product_id: 1 });
    
  } finally {
    // Restore original state regardless of test outcome
    await oracleDb.restoreSnapshot(snapshotId);
  }
});
```

#### **Waiting for Async Operations:**
```typescript
test('async database processing', async ({ oracleDb }) => {
  // Trigger async process
  await oracleDb.execute(
    'INSERT INTO async_jobs (id, status, created_date) VALUES (1, \'pending\', SYSDATE)'
  );

  // Wait for async job to complete (up to 30 seconds)
  const result = await Oracle.TestUtils.waitForCondition(
    Oracle.createQueryExecutor('testing'),
    'SELECT status FROM async_jobs WHERE id = :id',
    (result) => result.success && result.rows[0]?.status === 'completed',
    {
      timeout: 30000,    // 30 seconds
      interval: 2000,    // Check every 2 seconds  
      bindParams: [1]
    }
  );
  
  expect(result.rows[0].status).toBe('completed');
});
```

### **🔧 Configuration Management:**

#### **Multiple Environments:**
```bash
# oracle.env file supports multiple environments
TEST_ORACLE_USER=test_user           # Testing environment
DEV_ORACLE_USER=dev_user             # Development environment
PROD_ORACLE_USER=prod_user           # Production environment
ORACLE_USER=default_user             # Fallback default
```

#### **Environment-Specific Testing:**
```typescript
// Switch between environments in tests
test.describe('Multi-environment testing', () => {
  
  test('development database validation', async () => {
    const devFixture = await Oracle.setupFromEnv('development');
    // Test with development database
  });
  
  test('production database validation', async () => {
    const prodFixture = await Oracle.setupFromEnv('production');
    // Test with production database (read-only operations)
  });
});
```

### **🔒 Security Best Practices:**

1. **Protect Credentials:**
   ```bash
   # Add to .gitignore
   oracle.env
   *.env
   ```

2. **Use Environment-Specific Accounts:**
   - Test databases: Full CRUD permissions
   - Production databases: Read-only for testing

3. **Connection Security:**
   - Use encrypted connections when possible
   - Limit database user permissions to minimum required
   - Use different credentials for different environments

### **📚 Examples and Documentation:**

- **Working Tests:** `tests/tdd/oracle-db.spec.ts`

### **💡 Troubleshooting:**

#### **Common Issues:**

1. **"DPI-1047: Cannot locate Oracle Client library"**
   ```bash
   # Solution: Install Oracle Instant Client and add to PATH
   # Windows: C:\oracle\instantclient
   # Linux: Export LD_LIBRARY_PATH=/path/to/instantclient
   ```

2. **"ORA-12154: TNS:could not resolve connect identifier"**
   ```bash
   # Check connection string format: hostname:port/service_name
   # Example: localhost:1521/xepdb1
   ```

---
- Take screenshots for documentation and debugging

#### For API Testing:
- Store and reuse tokens for authenticated endpoints
- Validate response structure, not just status codes
- Generate comprehensive test suites for better coverage

#### For Combined Workflows:
- Plan sequence: web actions first, then API validation
- Document workflows with screenshots and API responses
- Handle async operations properly

### **Troubleshooting UnifiedMCP:**

**Common Issues:**
1. **MCP Connection Issues**: Restart VS Code and verify configuration path
2. **Browser Not Loading**: Check Node.js version and network connectivity
3. **License Key Issues**: Verify key is correct for your machine
4. **API Requests Failing**: Check URL accessibility and authentication

**Getting Help:**
- Use `--head` mode to see browser actions in real-time
- Check browser console for errors during web automation
- Review API response details in tool output
- Generate scripts to verify automation sequences


### 📧 **MSTeams Notification**

Send automated notifications of test results to configured MSTeams channels:

```bash
npm run notify:results
```

**Setup Requirements:**
- Configure MSTeams webhook URL in `notify-results/config.json`  
- Configuration steps and templates available in `notify-results/` folder
- Supports custom notification templates and channels

### 🚀 **CI/CD Integration**

The framework includes Azure DevOps pipeline integration:

**Files:**
- `azure-pipelines.yml` - Main Azure DevOps pipeline configuration
- `azure.yml` - Additional Azure configuration  
- `playwrightdocker.yml` - Docker-based pipeline configuration

**Features:**
- Automated test execution on code commits
- Cross-browser testing support
- Test result reporting and notifications
- Artifact management for reports and screenshots

**Further Documentation:**
- Playwright: https://playwright.dev/docs/intro