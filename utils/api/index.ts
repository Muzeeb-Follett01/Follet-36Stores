/**
 * API Utilities - Main Export
 * Central hub for all API testing utilities
 */

// Configuration
export { ApiConfig, ApiEnvironment, AuthConfig, ApiEndpoint } from './apiConfig';

// API Client
export { ApiClient, ApiResponse, ApiRequestOptions, ApiValidation } from './apiClient';

// Test Data Management
export { 
  ApiTestDataManager, 
  TestDataTemplate, 
  DataGeneration, 
  TestScenario 
} from './apiTestDataManager';

// Test Utilities and Fixtures
export { 
  ApiTestUtils, 
  ApiPerformanceUtils,
  apiTest,
  test,
  expect 
} from './apiTestUtils';

// Import for internal use
import { ApiValidation } from './apiClient';

// Type definitions for common API testing patterns
export interface ApiTestCase {
  name: string;
  description?: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  data?: any;
  headers?: Record<string, string>;
  expectedStatus: number;
  expectedResponse?: any;
  validations?: ApiValidation[];
  setup?: () => Promise<void>;
  cleanup?: () => Promise<void>;
}

export interface ApiTestSuite {
  name: string;
  description?: string;
  baseUrl?: string;
  environment?: string;
  beforeAll?: () => Promise<void>;
  afterAll?: () => Promise<void>;
  beforeEach?: () => Promise<void>;
  afterEach?: () => Promise<void>;
  testCases: ApiTestCase[];
}

// Utility functions
export const ApiUtils = {
  /**
   * Create a simple test case
   */
  createTestCase: (
    name: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    expectedStatus: number = 200,
    data?: any
  ): ApiTestCase => ({
    name,
    method,
    endpoint,
    expectedStatus,
    data
  }),

  /**
   * Create CRUD test cases for a resource
   */
  createCrudTestCases: (resource: string, baseEndpoint: string, sampleData: any): ApiTestCase[] => [
    {
      name: `Create ${resource}`,
      method: 'POST',
      endpoint: baseEndpoint,
      data: sampleData,
      expectedStatus: 201
    },
    {
      name: `Get ${resource}`,
      method: 'GET',
      endpoint: `${baseEndpoint}/1`,
      expectedStatus: 200
    },
    {
      name: `Update ${resource}`,
      method: 'PUT',
      endpoint: `${baseEndpoint}/1`,
      data: { ...sampleData, id: 1 },
      expectedStatus: 200
    },
    {
      name: `Partially Update ${resource}`,
      method: 'PATCH',
      endpoint: `${baseEndpoint}/1`,
      data: { name: 'Updated Name' },
      expectedStatus: 200
    },
    {
      name: `Delete ${resource}`,
      method: 'DELETE',
      endpoint: `${baseEndpoint}/1`,
      expectedStatus: 200
    }
  ],

  /**
   * Create validation test cases
   */
  createValidationTestCases: (resource: string, endpoint: string, validData: any, requiredFields: string[]): ApiTestCase[] => {
    const testCases: ApiTestCase[] = [];

    // Missing required fields
    requiredFields.forEach(field => {
      const dataWithoutField = { ...validData };
      delete dataWithoutField[field];
      
      testCases.push({
        name: `Create ${resource} - Missing ${field}`,
        method: 'POST',
        endpoint,
        data: dataWithoutField,
        expectedStatus: 400
      });
    });

    // Invalid data types
    testCases.push({
      name: `Create ${resource} - Invalid Data Type`,
      method: 'POST',
      endpoint,
      data: 'invalid data',
      expectedStatus: 400
    });

    // Empty data
    testCases.push({
      name: `Create ${resource} - Empty Data`,
      method: 'POST',
      endpoint,
      data: {},
      expectedStatus: 400
    });

    return testCases;
  },

  /**
   * Create performance test cases
   */
  createPerformanceTestCases: (endpoint: string): ApiTestCase[] => [
    {
      name: 'Performance Test - Response Time',
      method: 'GET',
      endpoint,
      expectedStatus: 200,
      validations: [{
        responseTime: 2000 // Max 2 seconds
      }]
    },
    {
      name: 'Performance Test - Large Dataset',
      method: 'GET',
      endpoint: `${endpoint}?limit=1000`,
      expectedStatus: 200,
      validations: [{
        responseTime: 5000 // Max 5 seconds for large dataset
      }]
    }
  ],

  /**
   * Run test suite
   */
  runTestSuite: async (suite: ApiTestSuite, apiClient: any): Promise<{
    passed: number;
    failed: number;
    results: Array<{ testCase: ApiTestCase; success: boolean; error?: string; response?: any }>;
  }> => {
    const results: Array<{ testCase: ApiTestCase; success: boolean; error?: string; response?: any }> = [];
    
    // Setup
    if (suite.beforeAll) {
      await suite.beforeAll();
    }

    for (const testCase of suite.testCases) {
      try {
        if (suite.beforeEach) {
          await suite.beforeEach();
        }

        if (testCase.setup) {
          await testCase.setup();
        }

        // Execute test case
        const response = await apiClient.request({
          method: testCase.method,
          endpoint: testCase.endpoint,
          data: testCase.data,
          headers: testCase.headers
        });

        // Validate response
        const success = response.status === testCase.expectedStatus;
        
        if (testCase.validations) {
          testCase.validations.forEach(validation => {
            const validationResult = apiClient.validateResponse(response, validation);
            if (!validationResult.isValid) {
              throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
            }
          });
        }

        results.push({
          testCase,
          success,
          response: response.data
        });

        if (testCase.cleanup) {
          await testCase.cleanup();
        }

        if (suite.afterEach) {
          await suite.afterEach();
        }

      } catch (error) {
        results.push({
          testCase,
          success: false,
          error: String(error)
        });
      }
    }

    // Cleanup
    if (suite.afterAll) {
      await suite.afterAll();
    }

    const passed = results.filter(r => r.success).length;
    const failed = results.length - passed;

    return { passed, failed, results };
  }
};

// Export default configuration
export const defaultApiConfig = {
  environment: 'testing',
  timeout: 30000,
  retries: 3,
  logRequests: true,
  logResponses: true,
  saveResponses: false,
  validateResponse: true,
  responseDir: './test-results/api-responses'
};