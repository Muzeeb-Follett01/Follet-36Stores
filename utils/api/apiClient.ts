/**
 * API Request Builder and Executor
 * Provides high-level API request operations with validation and response handling
 */

import { APIRequestContext, APIResponse } from '@playwright/test';
import { ApiConfig, ApiEnvironment, AuthConfig, ApiEndpoint } from './apiConfig';

export interface ApiRequestOptions {
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  data?: any;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  auth?: AuthConfig;
  validateStatus?: boolean;
  saveResponse?: boolean;
  description?: string;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  responseTime: number;
  url: string;
  method: string;
  success: boolean;
  error?: string;
  raw?: APIResponse;
}

export interface ApiValidation {
  status?: number;
  statusRange?: [number, number];
  headers?: Record<string, string | RegExp>;
  schema?: any; // JSON schema object
  contains?: string | RegExp;
  notContains?: string | RegExp;
  responseTime?: number; // max response time in ms
  customValidator?: (response: ApiResponse) => boolean | string;
}

export class ApiClient {
  private requestContext: APIRequestContext;
  private environment: ApiEnvironment;
  private baseHeaders: Record<string, string> = {};

  constructor(requestContext: APIRequestContext, environmentName: string = 'testing') {
    this.requestContext = requestContext;
    this.environment = ApiConfig.getEnvironment(environmentName);
    this.setupBaseHeaders();
  }

  /**
   * Send GET request
   */
  async get(endpoint: string, options: Omit<ApiRequestOptions, 'method' | 'data'> = {}): Promise<ApiResponse> {
    return await this.request({ ...options, endpoint, method: 'GET' });
  }

  /**
   * Send POST request
   */
  async post(endpoint: string, data?: any, options: Omit<ApiRequestOptions, 'method' | 'endpoint'> = {}): Promise<ApiResponse> {
    return await this.request({ ...options, endpoint, method: 'POST', data });
  }

  /**
   * Send PUT request
   */
  async put(endpoint: string, data?: any, options: Omit<ApiRequestOptions, 'method' | 'endpoint'> = {}): Promise<ApiResponse> {
    return await this.request({ ...options, endpoint, method: 'PUT', data });
  }

  /**
   * Send PATCH request
   */
  async patch(endpoint: string, data?: any, options: Omit<ApiRequestOptions, 'method' | 'endpoint'> = {}): Promise<ApiResponse> {
    return await this.request({ ...options, endpoint, method: 'PATCH', data });
  }

  /**
   * Send DELETE request
   */
  async delete(endpoint: string, options: Omit<ApiRequestOptions, 'method' | 'endpoint'> = {}): Promise<ApiResponse> {
    return await this.request({ ...options, endpoint, method: 'DELETE' });
  }

  /**
   * Send generic request
   */
  async request(options: ApiRequestOptions): Promise<ApiResponse> {
    const startTime = Date.now();
    const method = options.method || 'GET';
    const url = this.buildUrl(options.endpoint || '', options.params);
    const headers = this.buildHeaders(options.headers, options.auth);

    // Log request if enabled
    if (ApiConfig.getConfig().logRequests) {
      console.log(`🔄 API Request: ${method} ${url}`);
      if (options.data) {
        console.log(`📤 Request Data:`, JSON.stringify(options.data, null, 2));
      }
    }

    try {
      const response = await this.sendRequest(method, url, {
        data: options.data,
        headers,
        timeout: options.timeout || this.environment.timeout
      });

      const responseTime = Date.now() - startTime;
      const apiResponse = await this.processResponse(response, responseTime, method, url);

      // Log response if enabled
      if (ApiConfig.getConfig().logResponses) {
        console.log(`✅ API Response: ${apiResponse.status} ${apiResponse.statusText} (${responseTime}ms)`);
        console.log(`📥 Response Data:`, JSON.stringify(apiResponse.data, null, 2));
      }

      // Save response if enabled
      if (options.saveResponse || ApiConfig.getConfig().saveResponses) {
        await this.saveResponse(apiResponse, options.description);
      }

      return apiResponse;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorResponse: ApiResponse = {
        status: 0,
        statusText: 'Request Failed',
        headers: {},
        data: null,
        responseTime,
        url,
        method,
        success: false,
        error: String(error)
      };

      console.error(`❌ API Request Failed: ${method} ${url}`, error);
      return errorResponse;
    }
  }

  /**
   * Validate API response
   */
  validateResponse(response: ApiResponse, validation: ApiValidation): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Status validation
    if (validation.status !== undefined && response.status !== validation.status) {
      errors.push(`Expected status ${validation.status}, got ${response.status}`);
    }

    // Status range validation
    if (validation.statusRange) {
      const [min, max] = validation.statusRange;
      if (response.status < min || response.status > max) {
        errors.push(`Status ${response.status} not in range ${min}-${max}`);
      }
    }

    // Headers validation
    if (validation.headers) {
      Object.entries(validation.headers).forEach(([key, expectedValue]) => {
        const actualValue = response.headers[key.toLowerCase()];
        if (typeof expectedValue === 'string') {
          if (actualValue !== expectedValue) {
            errors.push(`Header '${key}': expected '${expectedValue}', got '${actualValue}'`);
          }
        } else if (expectedValue instanceof RegExp) {
          if (!expectedValue.test(actualValue || '')) {
            errors.push(`Header '${key}': does not match pattern ${expectedValue}`);
          }
        }
      });
    }

    // Content validation
    const responseText = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
    
    if (validation.contains) {
      const pattern = typeof validation.contains === 'string' ? validation.contains : validation.contains;
      if (typeof pattern === 'string' && !responseText.includes(pattern)) {
        errors.push(`Response does not contain: ${pattern}`);
      } else if (pattern instanceof RegExp && !pattern.test(responseText)) {
        errors.push(`Response does not match pattern: ${pattern}`);
      }
    }

    if (validation.notContains) {
      const pattern = typeof validation.notContains === 'string' ? validation.notContains : validation.notContains;
      if (typeof pattern === 'string' && responseText.includes(pattern)) {
        errors.push(`Response should not contain: ${pattern}`);
      } else if (pattern instanceof RegExp && pattern.test(responseText)) {
        errors.push(`Response should not match pattern: ${pattern}`);
      }
    }

    // Response time validation
    if (validation.responseTime !== undefined && response.responseTime > validation.responseTime) {
      errors.push(`Response time ${response.responseTime}ms exceeds limit ${validation.responseTime}ms`);
    }

    // Custom validation
    if (validation.customValidator) {
      const customResult = validation.customValidator(response);
      if (typeof customResult === 'string') {
        errors.push(customResult);
      } else if (!customResult) {
        errors.push('Custom validation failed');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Execute multiple requests in sequence
   */
  async executeSequence(requests: ApiRequestOptions[]): Promise<ApiResponse[]> {
    const results: ApiResponse[] = [];
    
    for (const requestOptions of requests) {
      const response = await this.request(requestOptions);
      results.push(response);
      
      // Stop on first failure if validation is enabled
      if (ApiConfig.getConfig().validateResponse && !response.success) {
        console.warn(`⚠️ Sequence stopped at request ${results.length} due to failure`);
        break;
      }
    }
    
    return results;
  }

  /**
   * Execute multiple requests in parallel
   */
  async executeParallel(requests: ApiRequestOptions[]): Promise<ApiResponse[]> {
    const promises = requests.map(options => this.request(options));
    return await Promise.all(promises);
  }

  /**
   * Upload file
   */
  async uploadFile(endpoint: string, filePath: string, fieldName: string = 'file', additionalData?: Record<string, any>): Promise<ApiResponse> {
    const fs = require('fs');
    const path = require('path');
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const formData = new FormData();
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    
    formData.append(fieldName, new Blob([fileBuffer]), fileName);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    return await this.request({
      endpoint,
      method: 'POST',
      data: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it with boundary
      }
    });
  }

  /**
   * Download file
   */
  async downloadFile(endpoint: string, savePath: string, options: Omit<ApiRequestOptions, 'endpoint' | 'method'> = {}): Promise<{ success: boolean; filePath?: string; error?: string }> {
    try {
      const response = await this.request({ ...options, endpoint, method: 'GET' });
      
      if (!response.success) {
        return { success: false, error: response.error };
      }

      const fs = require('fs');
      const path = require('path');
      
      // Ensure directory exists
      const dir = path.dirname(savePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Save file
      if (response.raw) {
        const buffer = await response.raw.body();
        fs.writeFileSync(savePath, buffer);
      } else {
        fs.writeFileSync(savePath, response.data);
      }

      return { success: true, filePath: savePath };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  // Private helper methods
  private setupBaseHeaders(): void {
    this.baseHeaders = {
      'User-Agent': 'Playwright-API-Testing/1.0',
      ...this.environment.headers
    };

    // Add authentication headers
    if (this.environment.auth) {
      const authHeaders = this.buildAuthHeaders(this.environment.auth);
      Object.assign(this.baseHeaders, authHeaders);
    }
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    let url = endpoint.startsWith('http') ? endpoint : `${this.environment.baseUrl}${endpoint}`;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      url += `?${searchParams.toString()}`;
    }
    
    return url;
  }

  private buildHeaders(customHeaders?: Record<string, string>, auth?: AuthConfig): Record<string, string> {
    const headers = { ...this.baseHeaders };
    
    if (auth) {
      const authHeaders = this.buildAuthHeaders(auth);
      Object.assign(headers, authHeaders);
    }
    
    if (customHeaders) {
      Object.assign(headers, customHeaders);
    }
    
    return headers;
  }

  private buildAuthHeaders(auth: AuthConfig): Record<string, string> {
    const headers: Record<string, string> = {};
    
    switch (auth.type) {
      case 'bearer':
        if (auth.token) {
          headers['Authorization'] = `Bearer ${auth.token}`;
        }
        break;
      case 'basic':
        if (auth.username && auth.password) {
          const credentials = Buffer.from(`${auth.username}:${auth.password}`).toString('base64');
          headers['Authorization'] = `Basic ${credentials}`;
        }
        break;
      case 'apikey':
        if (auth.apiKey && auth.apiKeyHeader) {
          headers[auth.apiKeyHeader] = auth.apiKey;
        }
        break;
      case 'custom':
        if (auth.customHeaders) {
          Object.assign(headers, auth.customHeaders);
        }
        break;
    }
    
    return headers;
  }

  private async sendRequest(method: string, url: string, options: any): Promise<APIResponse> {
    switch (method.toUpperCase()) {
      case 'GET':
        return await this.requestContext.get(url, options);
      case 'POST':
        return await this.requestContext.post(url, options);
      case 'PUT':
        return await this.requestContext.put(url, options);
      case 'PATCH':
        return await this.requestContext.patch(url, options);
      case 'DELETE':
        return await this.requestContext.delete(url, options);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }

  private async processResponse(response: APIResponse, responseTime: number, method: string, url: string): Promise<ApiResponse> {
    const headers: Record<string, string> = {};
    Object.entries(response.headers()).forEach(([key, value]) => {
      headers[key.toLowerCase()] = value;
    });

    let data: any;
    try {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    } catch {
      data = null;
    }

    return {
      status: response.status(),
      statusText: response.statusText(),
      headers,
      data,
      responseTime,
      url,
      method,
      success: response.ok(),
      raw: response
    };
  }

  private async saveResponse(response: ApiResponse, description?: string): Promise<void> {
    try {
      const fs = require('fs');
      const path = require('path');
      
      const config = ApiConfig.getConfig();
      const responseDir = config.responseDir || './test-results/api-responses';
      
      if (!fs.existsSync(responseDir)) {
        fs.mkdirSync(responseDir, { recursive: true });
      }
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${response.method}-${response.status}-${timestamp}.json`;
      const filePath = path.join(responseDir, filename);
      
      const responseData = {
        description,
        timestamp: new Date().toISOString(),
        request: {
          method: response.method,
          url: response.url
        },
        response: {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          data: response.data,
          responseTime: response.responseTime
        }
      };
      
      fs.writeFileSync(filePath, JSON.stringify(responseData, null, 2));
    } catch (error) {
      console.warn('Failed to save response:', error);
    }
  }
}