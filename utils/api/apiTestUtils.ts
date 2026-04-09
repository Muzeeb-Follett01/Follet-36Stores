/**
 * API Test Utilities and Fixtures
 * Provides Playwright-specific utilities and fixtures for API testing
 */

import { test as base, APIRequestContext } from '@playwright/test';
import { ApiClient, ApiResponse, ApiValidation } from './apiClient';
import { ApiTestDataManager } from './apiTestDataManager';
import { ApiConfig } from './apiConfig';

// Extend Playwright fixtures
type ApiFixtures = {
  apiClient: ApiClient;
  dataManager: ApiTestDataManager;
  apiConfig: typeof ApiConfig;
};

export const test = base.extend<ApiFixtures>({
  // API Client fixture
  apiClient: async ({ request }, use, testInfo) => {
    // Get environment from test tags or default
    const environment = testInfo.tags?.find(tag => tag.startsWith('@env:'))?.replace('@env:', '') || 'testing';
    
    console.log(`🔧 Setting up API client for environment: ${environment}`);
    const client = new ApiClient(request, environment);
    
    await use(client);
    
    console.log(`🧹 API client cleanup completed`);
  },

  // Test Data Manager fixture
  dataManager: async ({}, use) => {
    const manager = ApiTestDataManager.getInstance();
    await use(manager);
  },

  // Config fixture
  apiConfig: async ({}, use) => {
    await use(ApiConfig);
  }
});

export { expect } from '@playwright/test';

/**
 * API Test Utilities Class
 */
export class ApiTestUtils {
  /**
   * Assert API response status
   */
  static assertStatus(response: ApiResponse, expectedStatus: number, message?: string): void {
    const msg = message || `Expected status ${expectedStatus}, got ${response.status}`;
    if (response.status !== expectedStatus) {
      throw new Error(`${msg}\nResponse: ${JSON.stringify(response.data, null, 2)}`);
    }
  }

  /**
   * Assert API response success
   */
  static assertSuccess(response: ApiResponse, message?: string): void {
    const msg = message || `Expected successful response, got ${response.status}`;
    if (!response.success) {
      throw new Error(`${msg}\nError: ${response.error}\nResponse: ${JSON.stringify(response.data, null, 2)}`);
    }
  }

  /**
   * Assert response contains data
   */
  static assertContains(response: ApiResponse, expectedContent: string | RegExp, message?: string): void {
    const responseText = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
    const msg = message || `Response should contain: ${expectedContent}`;
    
    if (typeof expectedContent === 'string') {
      if (!responseText.includes(expectedContent)) {
        throw new Error(`${msg}\nActual response: ${responseText}`);
      }
    } else {
      if (!expectedContent.test(responseText)) {
        throw new Error(`${msg}\nActual response: ${responseText}`);
      }
    }
  }

  /**
   * Assert response does not contain data
   */
  static assertNotContains(response: ApiResponse, unexpectedContent: string | RegExp, message?: string): void {
    const responseText = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
    const msg = message || `Response should not contain: ${unexpectedContent}`;
    
    if (typeof unexpectedContent === 'string') {
      if (responseText.includes(unexpectedContent)) {
        throw new Error(`${msg}\nActual response: ${responseText}`);
      }
    } else {
      if (unexpectedContent.test(responseText)) {
        throw new Error(`${msg}\nActual response: ${responseText}`);
      }
    }
  }

  /**
   * Assert response time within limit
   */
  static assertResponseTime(response: ApiResponse, maxTime: number, message?: string): void {
    const msg = message || `Response time ${response.responseTime}ms should be within ${maxTime}ms`;
    if (response.responseTime > maxTime) {
      throw new Error(msg);
    }
  }

  /**
   * Assert response header
   */
  static assertHeader(response: ApiResponse, headerName: string, expectedValue: string | RegExp, message?: string): void {
    const actualValue = response.headers[headerName.toLowerCase()];
    const msg = message || `Header '${headerName}' should be: ${expectedValue}`;
    
    if (typeof expectedValue === 'string') {
      if (actualValue !== expectedValue) {
        throw new Error(`${msg}\nActual: ${actualValue}`);
      }
    } else {
      if (!expectedValue.test(actualValue || '')) {
        throw new Error(`${msg}\nActual: ${actualValue}`);
      }
    }
  }

  /**
   * Assert JSON schema
   */
  static assertJsonSchema(data: any, schema: any, message?: string): void {
    const Ajv = require('ajv');
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(data);
    
    if (!valid) {
      const msg = message || 'JSON schema validation failed';
      throw new Error(`${msg}\nErrors: ${JSON.stringify(validate.errors, null, 2)}\nData: ${JSON.stringify(data, null, 2)}`);
    }
  }

  /**
   * Assert response pagination
   */
  static assertPagination(response: ApiResponse, expectedKeys: string[] = ['page', 'limit', 'total'], message?: string): void {
    const msg = message || 'Response should contain pagination info';
    
    if (!response.data || typeof response.data !== 'object') {
      throw new Error(`${msg}\nResponse data is not an object`);
    }

    expectedKeys.forEach(key => {
      if (!(key in response.data)) {
        throw new Error(`${msg}\nMissing pagination key: ${key}`);
      }
    });
  }

  /**
   * Wait for API condition
   */
  static async waitForCondition(
    checkFunction: () => Promise<boolean>,
    timeout: number = 30000,
    interval: number = 1000,
    message?: string
  ): Promise<void> {
    const startTime = Date.now();
    const msg = message || 'Condition not met within timeout';
    
    while (Date.now() - startTime < timeout) {
      if (await checkFunction()) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    
    throw new Error(`${msg} (timeout: ${timeout}ms)`);
  }

  /**
   * Retry API request
   */
  static async retryRequest(
    requestFunction: () => Promise<ApiResponse>,
    maxRetries: number = 3,
    retryDelay: number = 1000,
    retryCondition?: (response: ApiResponse) => boolean
  ): Promise<ApiResponse> {
    let lastResponse: ApiResponse;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      lastResponse = await requestFunction();
      
      // If no retry condition, only retry on failures
      const shouldRetry = retryCondition ? retryCondition(lastResponse) : !lastResponse.success;
      
      if (!shouldRetry || attempt === maxRetries) {
        return lastResponse;
      }
      
      console.log(`🔄 Retrying request (attempt ${attempt + 1}/${maxRetries}) after ${retryDelay}ms`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
    
    return lastResponse!;
  }

  /**
   * Compare responses
   */
  static compareResponses(response1: ApiResponse, response2: ApiResponse, ignoreFields: string[] = []): {
    equal: boolean;
    differences: string[];
  } {
    const differences: string[] = [];
    
    // Compare status
    if (response1.status !== response2.status) {
      differences.push(`Status: ${response1.status} vs ${response2.status}`);
    }
    
    // Compare data (deep comparison)
    const data1 = this.removeFields(response1.data, ignoreFields);
    const data2 = this.removeFields(response2.data, ignoreFields);
    
    const dataDiff = this.deepCompare(data1, data2, 'data');
    differences.push(...dataDiff);
    
    return {
      equal: differences.length === 0,
      differences
    };
  }

  /**
   * Extract values from response using JSON path
   */
  static extractValue(response: ApiResponse, jsonPath: string): any {
    const JSONPath = require('jsonpath');
    return JSONPath.query(response.data, jsonPath);
  }

  /**
   * Generate test report
   */
  static generateTestReport(responses: ApiResponse[], testName: string): {
    summary: any;
    details: any;
    report: string;
  } {
    const summary = {
      total: responses.length,
      successful: responses.filter(r => r.success).length,
      failed: responses.filter(r => !r.success).length,
      averageResponseTime: responses.reduce((sum, r) => sum + r.responseTime, 0) / responses.length,
      maxResponseTime: Math.max(...responses.map(r => r.responseTime)),
      minResponseTime: Math.min(...responses.map(r => r.responseTime))
    };

    const details = {
      responses: responses.map(r => ({
        url: r.url,
        method: r.method,
        status: r.status,
        success: r.success,
        responseTime: r.responseTime,
        error: r.error
      }))
    };

    const report = `
# API Test Report: ${testName}

## Summary
- **Total Requests**: ${summary.total}
- **Successful**: ${summary.successful}
- **Failed**: ${summary.failed}
- **Success Rate**: ${((summary.successful / summary.total) * 100).toFixed(2)}%
- **Average Response Time**: ${summary.averageResponseTime.toFixed(2)}ms
- **Max Response Time**: ${summary.maxResponseTime}ms
- **Min Response Time**: ${summary.minResponseTime}ms

## Details
${details.responses.map(r => `
### ${r.method} ${r.url}
- **Status**: ${r.status} (${r.success ? '✅' : '❌'})
- **Response Time**: ${r.responseTime}ms
${r.error ? `- **Error**: ${r.error}` : ''}
`).join('\n')}
`;

    return { summary, details, report };
  }

  /**
   * Validate API responses in bulk
   */
  static validateResponses(responses: ApiResponse[], validations: ApiValidation[]): {
    valid: boolean;
    results: Array<{ response: ApiResponse; validation: ApiValidation; valid: boolean; errors: string[] }>;
  } {
    const results = responses.map((response, index) => {
      const validation = validations[index] || validations[0]; // Use first validation if not enough provided
      const client = new (ApiClient as any)(null, 'testing'); // Mock client for validation
      const validationResult = client.validateResponse(response, validation);
      
      return {
        response,
        validation,
        valid: validationResult.isValid,
        errors: validationResult.errors
      };
    });

    return {
      valid: results.every(r => r.valid),
      results
    };
  }

  // Private helper methods
  private static removeFields(obj: any, fieldsToRemove: string[]): any {
    if (!obj || typeof obj !== 'object') return obj;
    
    const result = Array.isArray(obj) ? [] : {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (!fieldsToRemove.includes(key)) {
        (result as any)[key] = this.removeFields(value, fieldsToRemove);
      }
    }
    
    return result;
  }

  private static deepCompare(obj1: any, obj2: any, path: string = ''): string[] {
    const differences: string[] = [];
    
    if (typeof obj1 !== typeof obj2) {
      differences.push(`${path}: type mismatch (${typeof obj1} vs ${typeof obj2})`);
      return differences;
    }
    
    if (obj1 === null || obj2 === null) {
      if (obj1 !== obj2) {
        differences.push(`${path}: ${obj1} vs ${obj2}`);
      }
      return differences;
    }
    
    if (typeof obj1 !== 'object') {
      if (obj1 !== obj2) {
        differences.push(`${path}: ${obj1} vs ${obj2}`);
      }
      return differences;
    }
    
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    const allKeys = new Set([...keys1, ...keys2]);
    
    allKeys.forEach(key => {
      const newPath = path ? `${path}.${key}` : key;
      
      if (!(key in obj1)) {
        differences.push(`${newPath}: missing in first object`);
      } else if (!(key in obj2)) {
        differences.push(`${newPath}: missing in second object`);
      } else {
        differences.push(...this.deepCompare(obj1[key], obj2[key], newPath));
      }
    });
    
    return differences;
  }
}

/**
 * API Test Decorators
 */
export function apiTest(name: string, options?: { 
  timeout?: number; 
  retries?: number; 
  environment?: string;
  tags?: string[];
}) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      console.log(`🚀 Starting API test: ${name}`);
      const startTime = Date.now();
      
      try {
        const result = await originalMethod.apply(this, args);
        const duration = Date.now() - startTime;
        console.log(`✅ API test completed: ${name} (${duration}ms)`);
        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`❌ API test failed: ${name} (${duration}ms)`, error);
        throw error;
      }
    };
    
    return descriptor;
  };
}

/**
 * Performance Test Utilities
 */
export class ApiPerformanceUtils {
  /**
   * Run load test
   */
  static async runLoadTest(
    requestFunction: () => Promise<ApiResponse>,
    options: {
      concurrent: number;
      duration: number;
      rampUp?: number;
    }
  ): Promise<{
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    minResponseTime: number;
    maxResponseTime: number;
    requestsPerSecond: number;
    errors: string[];
  }> {
    const results: ApiResponse[] = [];
    const errors: string[] = [];
    const startTime = Date.now();
    const endTime = startTime + options.duration;
    
    // Create concurrent workers
    const workers = Array.from({ length: options.concurrent }, async () => {
      while (Date.now() < endTime) {
        try {
          const response = await requestFunction();
          results.push(response);
          if (!response.success && response.error) {
            errors.push(response.error);
          }
        } catch (error) {
          errors.push(String(error));
        }
        
        // Small delay to prevent overwhelming
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    });
    
    await Promise.all(workers);
    
    const successfulRequests = results.filter(r => r.success).length;
    const responseTimes = results.map(r => r.responseTime);
    const totalDuration = (Date.now() - startTime) / 1000; // in seconds
    
    return {
      totalRequests: results.length,
      successfulRequests,
      failedRequests: results.length - successfulRequests,
      averageResponseTime: responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length || 0,
      minResponseTime: Math.min(...responseTimes) || 0,
      maxResponseTime: Math.max(...responseTimes) || 0,
      requestsPerSecond: results.length / totalDuration,
      errors: [...new Set(errors)] // Remove duplicates
    };
  }
}