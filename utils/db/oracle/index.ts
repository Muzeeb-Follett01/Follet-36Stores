/**
 * Oracle Database Testing Utility - Main Export
 * Central hub for all Oracle database testing functionality
 */

// Core modules
export { OracleConfig, OracleEnvironments } from './oracleConfig';
export { OracleConnectionManager } from './oracleConnectionManager';
export { OracleQueryExecutor } from './oracleQueryExecutor';
export { OracleTestDataManager } from './oracleTestDataManager';
export { test, expect, OracleDbFixture, OracleTestUtils } from './oracleTestUtils';
export { OracleEnvLoader } from './oracleEnvLoader';

// Import for internal use
import { OracleConfig, OracleEnvironments } from './oracleConfig';
import { OracleConnectionManager } from './oracleConnectionManager';
import { OracleQueryExecutor } from './oracleQueryExecutor';
import { OracleTestDataManager } from './oracleTestDataManager';
import { OracleDbFixture, OracleTestUtils } from './oracleTestUtils';
import { OracleEnvLoader } from './oracleEnvLoader';

// Types
export type { OracleConnectionConfig, DatabaseEnvironment } from './oracleConfig';
export type { QueryOptions, QueryResult, TransactionOptions } from './oracleQueryExecutor';
export type { TestDataSetup, TestDataValidation, DatabaseSnapshot } from './oracleTestDataManager';
export type { OracleEnvConfig } from './oracleEnvLoader';

/**
 * Quick setup helper for common Oracle testing scenarios
 */
export class OracleTestingSetup {
  /**
   * Initialize Oracle testing with environment configuration
   */
  static async initialize(config: {
    environment: string;
    connectionConfig: {
      user: string;
      password: string;
      connectString: string;
    };
    testTables?: string[];
  }): Promise<OracleDbFixture> {
    const { environment, connectionConfig, testTables = [] } = config;

    // Register environment
    if (environment === 'testing') {
      OracleEnvironments.testing(connectionConfig);
    } else if (environment === 'development') {
      OracleEnvironments.development(connectionConfig);
    } else {
      OracleConfig.registerEnvironment({
        name: environment,
        config: connectionConfig
      });
    }

    // Create and setup fixture
    const dbFixture = new OracleDbFixture(environment);
    await dbFixture.setupEnvironment();

    // Validate test tables exist
    for (const table of testTables) {
      const exists = await dbFixture.tableExists(table);
      if (!exists) {
        console.warn(`⚠️  Test table '${table}' does not exist in database`);
      }
    }

    console.log(`✅ Oracle testing setup complete for '${environment}' environment`);
    return dbFixture;
  }

  /**
   * Setup Oracle testing from environment variables or oracle.env file
   */
  static async initializeFromEnv(environment: string = 'testing', envFilePath?: string): Promise<OracleDbFixture> {
    try {
      const config = OracleConfig.loadFromEnv(environment, envFilePath);
      return await this.initialize({
        environment,
        connectionConfig: config
      });
    } catch (error) {
      console.error('❌ Failed to initialize Oracle testing from environment:', error);
      throw error;
    }
  }

  /**
   * Setup Oracle testing from specific oracle.env file
   */
  static async initializeFromEnvFile(envFilePath: string, environment: string = 'testing'): Promise<OracleDbFixture> {
    return await this.initializeFromEnv(environment, envFilePath);
  }

  /**
   * Display current configuration for debugging
   */
  static displayConfig(environment: string = 'testing', envFilePath?: string): void {
    OracleConfig.displayConfig(environment, envFilePath);
  }

  /**
   * Create a sample oracle.env file
   */
  static createSampleEnvFile(targetPath?: string): string {
    return OracleConfig.createSampleEnvFile(targetPath);
  }

  /**
   * Get available environments from configuration
   */
  static getAvailableEnvironments(envFilePath?: string): string[] {
    return OracleConfig.getAvailableEnvironmentsFromFile(envFilePath);
  }
}

/**
 * Global Oracle testing utilities
 */
export const Oracle = {
  // Quick access to main classes
  Config: OracleConfig,
  ConnectionManager: OracleConnectionManager,
  QueryExecutor: OracleQueryExecutor,
  TestDataManager: OracleTestDataManager,
  TestUtils: OracleTestUtils,
  
  // Quick setup methods
  setup: OracleTestingSetup.initialize,
  setupFromEnv: OracleTestingSetup.initializeFromEnv,
  setupFromEnvFile: OracleTestingSetup.initializeFromEnvFile,
  
  // Configuration helpers
  displayConfig: OracleTestingSetup.displayConfig,
  createSampleEnvFile: OracleTestingSetup.createSampleEnvFile,
  getAvailableEnvironments: OracleTestingSetup.getAvailableEnvironments,
  
  // Environment helpers
  environments: OracleEnvironments,
  EnvLoader: OracleEnvLoader,
  
  // Create fixtures
  createFixture: (environment: string = 'testing') => new OracleDbFixture(environment),
  createQueryExecutor: (environment: string = 'testing') => new OracleQueryExecutor(environment),
  createTestDataManager: (environment: string = 'testing') => new OracleTestDataManager(environment)
};

// Default export for convenience
export default Oracle;