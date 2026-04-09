/**
 * API Configuration Management
 * Handles API endpoints, authentication, and environment-specific configurations
 */

export interface ApiEndpoint {
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  description?: string;
  requiresAuth?: boolean;
  timeout?: number;
  retries?: number;
}

export interface ApiEnvironment {
  name: string;
  baseUrl: string;
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
  auth?: AuthConfig;
  endpoints?: Record<string, ApiEndpoint>;
}

export interface AuthConfig {
  type: 'bearer' | 'basic' | 'apikey' | 'oauth' | 'custom';
  token?: string;
  username?: string;
  password?: string;
  apiKey?: string;
  apiKeyHeader?: string;
  customHeaders?: Record<string, string>;
}

export interface ApiTestConfig {
  environment: string;
  timeout: number;
  retries: number;
  validateResponse: boolean;
  logRequests: boolean;
  logResponses: boolean;
  saveResponses: boolean;
  responseDir?: string;
}

export class ApiConfig {
  private static environments: Map<string, ApiEnvironment> = new Map();
  private static currentConfig: ApiTestConfig = {
    environment: 'testing',
    timeout: 30000,
    retries: 2,
    validateResponse: true,
    logRequests: true,
    logResponses: true,
    saveResponses: false
  };

  // Initialize default environments
  static {
    this.initializeDefaultEnvironments();
  }

  /**
   * Initialize default environments
   */
  private static initializeDefaultEnvironments(): void {
    // Default testing environment (ReqRes API)
    this.environments.set('testing', {
      name: 'testing',
      baseUrl: 'https://reqres.in/api',
      timeout: 30000,
      retries: 3,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    // Development environment
    this.environments.set('development', {
      name: 'development',
      baseUrl: 'http://localhost:3000/api',
      timeout: 30000,
      retries: 3,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    // JSONPlaceholder for examples
    this.environments.set('jsonplaceholder', {
      name: 'jsonplaceholder',
      baseUrl: 'https://jsonplaceholder.typicode.com',
      timeout: 30000,
      retries: 3,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Register an API environment
   */
  static registerEnvironment(env: ApiEnvironment): void {
    this.environments.set(env.name.toLowerCase(), env);
  }

  /**
   * Get environment configuration
   */
  static getEnvironment(name: string): ApiEnvironment {
    const env = this.environments.get(name.toLowerCase());
    if (!env) {
      throw new Error(`API environment '${name}' not found. Available: ${Array.from(this.environments.keys()).join(', ')}`);
    }
    return env;
  }

  /**
   * Set current test configuration
   */
  static setConfig(config: Partial<ApiTestConfig>): void {
    this.currentConfig = { ...this.currentConfig, ...config };
  }

  /**
   * Get current test configuration
   */
  static getConfig(): ApiTestConfig {
    return { ...this.currentConfig };
  }

  /**
   * Load configuration from environment variables
   */
  static loadFromEnv(envName: string = 'testing'): ApiEnvironment {
    const prefix = envName.toUpperCase();
    
    const config: ApiEnvironment = {
      name: envName,
      baseUrl: process.env[`${prefix}_API_BASE_URL`] || process.env.API_BASE_URL || '',
      timeout: parseInt(process.env[`${prefix}_API_TIMEOUT`] || process.env.API_TIMEOUT || '30000'),
      retries: parseInt(process.env[`${prefix}_API_RETRIES`] || process.env.API_RETRIES || '2'),
      headers: this.parseHeaders(process.env[`${prefix}_API_HEADERS`] || process.env.API_HEADERS || ''),
      auth: this.parseAuth(envName)
    };

    if (!config.baseUrl) {
      throw new Error(`Missing required API base URL for environment '${envName}'. Set ${prefix}_API_BASE_URL or API_BASE_URL environment variable.`);
    }

    return config;
  }

  /**
   * Get available environments
   */
  static getAvailableEnvironments(): string[] {
    return Array.from(this.environments.keys());
  }

  /**
   * Create API endpoint configuration
   */
  static createEndpoint(config: Omit<ApiEndpoint, 'name'> & { name: string }): ApiEndpoint {
    return {
      ...config,
      requiresAuth: config.requiresAuth ?? true,
      timeout: config.timeout ?? this.currentConfig.timeout
    };
  }

  // Private helper methods
  private static parseHeaders(headerString: string): Record<string, string> {
    if (!headerString) return {};
    
    try {
      return JSON.parse(headerString);
    } catch {
      // Parse as comma-separated key:value pairs
      const headers: Record<string, string> = {};
      headerString.split(',').forEach(pair => {
        const [key, value] = pair.split(':').map(s => s.trim());
        if (key && value) {
          headers[key] = value;
        }
      });
      return headers;
    }
  }

  private static parseAuth(envName: string): AuthConfig | undefined {
    const prefix = envName.toUpperCase();
    const authType = (process.env[`${prefix}_API_AUTH_TYPE`] || process.env.API_AUTH_TYPE || '').toLowerCase();
    
    if (!authType) return undefined;

    const auth: AuthConfig = { type: authType as AuthConfig['type'] };

    switch (authType) {
      case 'bearer':
        auth.token = process.env[`${prefix}_API_AUTH_TOKEN`] || process.env.API_AUTH_TOKEN;
        break;
      case 'basic':
        auth.username = process.env[`${prefix}_API_AUTH_USERNAME`] || process.env.API_AUTH_USERNAME;
        auth.password = process.env[`${prefix}_API_AUTH_PASSWORD`] || process.env.API_AUTH_PASSWORD;
        break;
      case 'apikey':
        auth.apiKey = process.env[`${prefix}_API_AUTH_APIKEY`] || process.env.API_AUTH_APIKEY;
        auth.apiKeyHeader = process.env[`${prefix}_API_AUTH_APIKEY_HEADER`] || process.env.API_AUTH_APIKEY_HEADER || 'X-API-Key';
        break;
      case 'custom':
        auth.customHeaders = this.parseHeaders(process.env[`${prefix}_API_AUTH_HEADERS`] || process.env.API_AUTH_HEADERS || '');
        break;
    }

    return auth;
  }
}

// Pre-configured common environments
export const ApiEnvironments = {
  /**
   * Register development environment
   */
  development: (config: Partial<ApiEnvironment>) => {
    ApiConfig.registerEnvironment({
      name: 'development',
      baseUrl: 'http://localhost:3000',
      timeout: 10000,
      retries: 1,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      ...config
    } as ApiEnvironment);
  },

  /**
   * Register testing environment
   */
  testing: (config: Partial<ApiEnvironment>) => {
    ApiConfig.registerEnvironment({
      name: 'testing',
      baseUrl: 'https://api-test.example.com',
      timeout: 15000,
      retries: 2,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      ...config
    } as ApiEnvironment);
  },

  /**
   * Register production environment
   */
  production: (config: Partial<ApiEnvironment>) => {
    ApiConfig.registerEnvironment({
      name: 'production',
      baseUrl: 'https://api.example.com',
      timeout: 30000,
      retries: 3,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      ...config
    } as ApiEnvironment);
  }
};