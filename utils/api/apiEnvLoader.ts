/**
 * API Environment Configuration Loader
 * Loads and validates API configuration from api.env files
 */

import * as fs from 'fs';
import * as path from 'path';
import { ApiEnvironment, AuthConfig, ApiEndpoint } from './apiConfig';

export interface ApiEnvConfig {
  environment: string;
  baseUrl: string;
  timeout: number;
  retries: number;
  auth?: AuthConfig;
  headers?: Record<string, string>;
  endpoints?: Record<string, ApiEndpoint>;
  settings: Record<string, any>;
}

export class ApiEnvLoader {
  private static envCache: Map<string, ApiEnvConfig> = new Map();

  /**
   * Load API configuration from api.env file
   */
  static loadFromEnv(envFilePath?: string): ApiEnvConfig {
    const filePath = envFilePath || this.findEnvFile();
    
    if (this.envCache.has(filePath)) {
      return this.envCache.get(filePath)!;
    }

    if (!fs.existsSync(filePath)) {
      throw new Error(`API environment file not found: ${filePath}`);
    }

    const envVars = this.parseEnvFile(filePath);
    const config = this.buildConfig(envVars);
    
    this.envCache.set(filePath, config);
    return config;
  }

  /**
   * Load configuration for specific environment
   */
  static loadEnvironment(environmentName: string, envFilePath?: string): ApiEnvironment {
    const config = this.loadFromEnv(envFilePath);
    const envPrefix = environmentName.toUpperCase();
    
    // Extract environment-specific values
    const baseUrl = config.settings[`${envPrefix}_BASE_URL`] || config.baseUrl;
    const timeout = parseInt(config.settings[`${envPrefix}_TIMEOUT`]) || config.timeout;
    const retries = parseInt(config.settings[`${envPrefix}_RETRIES`]) || config.retries;
    
    // Build auth config
    const authType = config.settings[`${envPrefix}_AUTH_TYPE`];
    let auth: AuthConfig | undefined;
    
    if (authType && authType !== 'none') {
      auth = {
        type: authType as any,
        token: config.settings[`${envPrefix}_AUTH_TOKEN`],
        username: config.settings[`${envPrefix}_AUTH_USERNAME`],
        password: config.settings[`${envPrefix}_AUTH_PASSWORD`],
        apiKey: config.settings[`API_KEY_VALUE`],
        apiKeyHeader: config.settings[`API_KEY_HEADER`] || 'X-API-Key'
      };
    }

    // Build headers
    const headers: Record<string, string> = {
      'Accept': config.settings['ACCEPT_HEADER'] || 'application/json',
      'Content-Type': config.settings['CONTENT_TYPE_HEADER'] || 'application/json',
      'User-Agent': config.settings['USER_AGENT'] || 'Playwright-API-Testing/1.0'
    };

    // Build endpoints
    const endpoints: Record<string, ApiEndpoint> = {};
    Object.entries(config.settings).forEach(([key, value]) => {
      if (key.includes('_ENDPOINT') || key.startsWith('JSONPLACEHOLDER_') || key.startsWith('CUSTOM_')) {
        const endpointName = key.toLowerCase().replace(/_endpoint$/, '').replace(/jsonplaceholder_|custom_/, '');
        endpoints[endpointName] = {
          name: endpointName,
          url: value as string,
          method: 'GET' // Default method, can be overridden
        };
      }
    });

    return {
      name: environmentName,
      baseUrl,
      timeout,
      retries,
      auth,
      headers,
      endpoints
    };
  }

  /**
   * Validate environment configuration
   */
  static validateConfig(config: ApiEnvConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields
    if (!config.baseUrl) {
      errors.push('Base URL is required');
    }

    if (!config.baseUrl?.startsWith('http')) {
      errors.push('Base URL must start with http:// or https://');
    }

    if (config.timeout <= 0) {
      errors.push('Timeout must be greater than 0');
    }

    if (config.retries < 0) {
      errors.push('Retries cannot be negative');
    }

    // Auth validation
    if (config.auth) {
      switch (config.auth.type) {
        case 'bearer':
          if (!config.auth.token) {
            errors.push('Bearer token is required for bearer authentication');
          }
          break;
        case 'basic':
          if (!config.auth.username || !config.auth.password) {
            errors.push('Username and password are required for basic authentication');
          }
          break;
        case 'apikey':
          if (!config.auth.apiKey || !config.auth.apiKeyHeader) {
            errors.push('API key and header are required for API key authentication');
          }
          break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Create api.env file from template
   */
  static createEnvFile(targetPath: string = './api.env', templatePath?: string): void {
    const template = templatePath || path.join(__dirname, '../../api.env.template');
    
    if (!fs.existsSync(template)) {
      throw new Error(`Template file not found: ${template}`);
    }

    if (fs.existsSync(targetPath)) {
      console.warn(`⚠️  api.env file already exists at: ${targetPath}`);
      return;
    }

    fs.copyFileSync(template, targetPath);
    console.log(`✅ Created api.env file at: ${targetPath}`);
    console.log('📝 Please edit the file to configure your API settings.');
  }

  /**
   * Get available environments from env file
   */
  static getAvailableEnvironments(envFilePath?: string): string[] {
    try {
      const config = this.loadFromEnv(envFilePath);
      const environments = new Set<string>();
      
      Object.keys(config.settings).forEach(key => {
        if (key.endsWith('_BASE_URL')) {
          const env = key.replace('_BASE_URL', '').toLowerCase();
          environments.add(env);
        }
      });

      return Array.from(environments);
    } catch (error) {
      console.warn('Failed to load environments:', error);
      return ['development', 'testing', 'staging', 'production'];
    }
  }

  // Private helper methods
  private static findEnvFile(): string {
    const possiblePaths = [
      './api.env',
      './config/api.env',
      './.env.api',
      './.env'
    ];

    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        return filePath;
      }
    }

    throw new Error('API environment file not found. Please create api.env file.');
  }

  private static parseEnvFile(filePath: string): Record<string, string> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const envVars: Record<string, string> = {};

    content.split('\n').forEach(line => {
      line = line.trim();
      
      // Skip comments and empty lines
      if (line.startsWith('#') || line.startsWith('=') || !line) {
        return;
      }

      const equalIndex = line.indexOf('=');
      if (equalIndex === -1) {
        return;
      }

      const key = line.substring(0, equalIndex).trim();
      let value = line.substring(equalIndex + 1).trim();

      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      // Handle boolean values
      if (value.toLowerCase() === 'true') {
        envVars[key] = 'true';
      } else if (value.toLowerCase() === 'false') {
        envVars[key] = 'false';
      } else {
        envVars[key] = value;
      }
    });

    return envVars;
  }

  private static buildConfig(envVars: Record<string, string>): ApiEnvConfig {
    const environment = envVars['API_ENVIRONMENT'] || 'testing';
    const envPrefix = environment.toUpperCase();

    // Get environment-specific or fallback values
    const baseUrl = envVars[`${envPrefix}_BASE_URL`] || envVars['BASE_URL'] || 'http://localhost:3000/api';
    const timeout = parseInt(envVars[`${envPrefix}_TIMEOUT`] || envVars['DEFAULT_TIMEOUT'] || '30000');
    const retries = parseInt(envVars[`${envPrefix}_RETRIES`] || envVars['DEFAULT_RETRIES'] || '3');

    // Build auth config
    const authType = envVars[`${envPrefix}_AUTH_TYPE`] || envVars['AUTH_TYPE'];
    let auth: AuthConfig | undefined;

    if (authType && authType !== 'none') {
      auth = {
        type: authType as any,
        token: envVars[`${envPrefix}_AUTH_TOKEN`] || envVars['AUTH_TOKEN'],
        username: envVars[`${envPrefix}_AUTH_USERNAME`] || envVars['AUTH_USERNAME'],
        password: envVars[`${envPrefix}_AUTH_PASSWORD`] || envVars['AUTH_PASSWORD'],
        apiKey: envVars['API_KEY_VALUE'],
        apiKeyHeader: envVars['API_KEY_HEADER'] || 'X-API-Key'
      };
    }

    // Build headers
    const headers: Record<string, string> = {};
    if (envVars['ACCEPT_HEADER']) headers['Accept'] = envVars['ACCEPT_HEADER'];
    if (envVars['CONTENT_TYPE_HEADER']) headers['Content-Type'] = envVars['CONTENT_TYPE_HEADER'];
    if (envVars['USER_AGENT']) headers['User-Agent'] = envVars['USER_AGENT'];

    // Build endpoints
    const endpoints: Record<string, ApiEndpoint> = {};
    Object.entries(envVars).forEach(([key, value]) => {
      if (key.includes('_ENDPOINT') || key.startsWith('JSONPLACEHOLDER_') || key.startsWith('CUSTOM_')) {
        const endpointName = key.toLowerCase()
          .replace(/_endpoint$/, '')
          .replace(/jsonplaceholder_|custom_/, '');
        endpoints[endpointName] = {
          name: endpointName,
          url: value,
          method: 'GET' // Default method
        };
      }
    });

    return {
      environment,
      baseUrl,
      timeout,
      retries,
      auth,
      headers,
      endpoints,
      settings: envVars
    };
  }
}