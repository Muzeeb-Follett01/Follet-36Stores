/**
 * Oracle Database Test Utilities
 * High-level utilities for common database testing patterns in Playwright
 */

import { test as base, expect } from '@playwright/test';
import { OracleConnectionManager } from './oracleConnectionManager';
import { OracleQueryExecutor, QueryResult } from './oracleQueryExecutor';
import { OracleTestDataManager, TestDataSetup, TestDataValidation } from './oracleTestDataManager';
import { OracleConfig, OracleEnvironments } from './oracleConfig';

// Extend Playwright test with Oracle database fixtures
export const test = base.extend<{
  oracleDb: OracleDbFixture;
  oracleTestData: OracleTestDataManager;
  oracleQuery: OracleQueryExecutor;
}>({
  oracleDb: async ({}, use) => {
    const dbFixture = new OracleDbFixture();
    await use(dbFixture);
    await dbFixture.cleanup();
  },

  oracleTestData: async ({}, use) => {
    const testDataManager = new OracleTestDataManager();
    await use(testDataManager);
    await testDataManager.cleanup();
  },

  oracleQuery: async ({}, use) => {
    const queryExecutor = new OracleQueryExecutor();
    await use(queryExecutor);
  }
});

export { expect };

/**
 * Oracle Database Test Fixture
 * Provides high-level database testing capabilities for Playwright tests
 */
export class OracleDbFixture {
  private queryExecutor: OracleQueryExecutor;
  private testDataManager: OracleTestDataManager;
  private environment: string;

  constructor(environment: string = 'testing') {
    this.environment = environment;
    this.queryExecutor = new OracleQueryExecutor(environment);
    this.testDataManager = new OracleTestDataManager(environment);
  }

  /**
   * Setup database environment for testing
   */
  async setupEnvironment(config?: {
    user: string;
    password: string;
    connectString: string;
  }): Promise<void> {
    if (config) {
      OracleEnvironments.testing(config);
    }
    
    // Test database connectivity
    const isHealthy = await OracleConnectionManager.healthCheck(this.environment);
    if (!isHealthy) {
      throw new Error(`Database health check failed for environment '${this.environment}'`);
    }
    
    console.log(`✅ Oracle database environment '${this.environment}' is ready`);
  }

  /**
   * Execute SQL query and return results
   */
  async query<T = any>(sql: string, bindParams?: any[]): Promise<T[]> {
    const result = await this.queryExecutor.select<T>(sql, { bindParams });
    
    if (!result.success) {
      throw new Error(`Query failed: ${result.error}`);
    }
    
    return result.rows;
  }

  /**
   * Execute SQL statement (INSERT, UPDATE, DELETE)
   */
  async execute(sql: string, bindParams?: any[]): Promise<number> {
    const result = await this.queryExecutor.execute(sql, { bindParams });
    
    if (!result.success) {
      throw new Error(`SQL execution failed: ${result.error}`);
    }
    
    return result.rowsAffected || 0;
  }

  /**
   * Setup test data for testing
   */
  async setupData(setups: TestDataSetup[]): Promise<void> {
    const result = await this.testDataManager.setupTestData(setups);
    
    if (!result.success) {
      throw new Error(`Test data setup failed: ${result.errors.join(', ')}`);
    }
  }

  /**
   * Validate test data
   */
  async validateData(validations: TestDataValidation[]): Promise<void> {
    const result = await this.testDataManager.validateTestData(validations);
    
    if (!result.success) {
      throw new Error(`Data validation failed: ${result.errors.join(', ')}`);
    }
  }

  /**
   * Clean up test data
   */
  async cleanupData(tableNames?: string[]): Promise<void> {
    await this.testDataManager.cleanupTestData(tableNames);
  }

  /**
   * Create database snapshot
   */
  async createSnapshot(tables: string[], description?: string): Promise<string> {
    return await this.testDataManager.createSnapshot(tables, description);
  }

  /**
   * Restore database snapshot
   */
  async restoreSnapshot(snapshotId: string): Promise<void> {
    await this.testDataManager.restoreSnapshot(snapshotId);
  }

  /**
   * Get row count from table
   */
  async getRowCount(tableName: string, whereClause?: string): Promise<number> {
    return await this.queryExecutor.getRowCount(tableName, whereClause);
  }

  /**
   * Check if table exists
   */
  async tableExists(tableName: string, schema?: string): Promise<boolean> {
    return await this.queryExecutor.tableExists(tableName, schema);
  }

  /**
   * Assert row count in table
   */
  async assertRowCount(tableName: string, expectedCount: number, whereClause?: string): Promise<void> {
    const actualCount = await this.getRowCount(tableName, whereClause);
    expect(actualCount, `Expected ${expectedCount} rows in ${tableName}, found ${actualCount}`).toBe(expectedCount);
  }

  /**
   * Assert table exists
   */
  async assertTableExists(tableName: string, schema?: string): Promise<void> {
    const exists = await this.tableExists(tableName, schema);
    expect(exists, `Table ${schema ? schema + '.' : ''}${tableName} should exist`).toBe(true);
  }

  /**
   * Assert record exists with conditions
   */
  async assertRecordExists(tableName: string, conditions: Record<string, any>): Promise<void> {
    const whereConditions = Object.entries(conditions)
      .map(([key, value]) => `${key} = :${key}`)
      .join(' AND ');
    
    const sql = `SELECT COUNT(*) as COUNT FROM ${tableName} WHERE ${whereConditions}`;
    const result = await this.queryExecutor.select<{COUNT: number}>(sql, { bindObject: conditions });
    
    expect(result.success, `Failed to check record existence: ${result.error}`).toBe(true);
    expect(result.rows[0]?.COUNT, `Record should exist in ${tableName} with conditions: ${JSON.stringify(conditions)}`).toBeGreaterThan(0);
  }

  /**
   * Assert record does not exist with conditions
   */
  async assertRecordNotExists(tableName: string, conditions: Record<string, any>): Promise<void> {
    const whereConditions = Object.entries(conditions)
      .map(([key, value]) => `${key} = :${key}`)
      .join(' AND ');
    
    const sql = `SELECT COUNT(*) as COUNT FROM ${tableName} WHERE ${whereConditions}`;
    const result = await this.queryExecutor.select<{COUNT: number}>(sql, { bindObject: conditions });
    
    expect(result.success, `Failed to check record existence: ${result.error}`).toBe(true);
    expect(result.rows[0]?.COUNT, `Record should not exist in ${tableName} with conditions: ${JSON.stringify(conditions)}`).toBe(0);
  }

  /**
   * Assert column value in table
   */
  async assertColumnValue(tableName: string, column: string, expectedValue: any, conditions: Record<string, any> = {}): Promise<void> {
    const whereClause = Object.keys(conditions).length > 0 
      ? 'WHERE ' + Object.entries(conditions).map(([key, value]) => `${key} = :${key}`).join(' AND ')
      : '';
    
    const sql = `SELECT ${column} FROM ${tableName} ${whereClause}`;
    const result = await this.queryExecutor.select(sql, { bindObject: conditions });
    
    expect(result.success, `Failed to query column value: ${result.error}`).toBe(true);
    expect(result.rows.length, `No rows found in ${tableName} with conditions: ${JSON.stringify(conditions)}`).toBeGreaterThan(0);
    expect(result.rows[0][column], `Column ${column} should have value ${expectedValue}`).toBe(expectedValue);
  }

  /**
   * Execute queries in transaction
   */
  async executeTransaction(queries: Array<{ sql: string; bindParams?: any[] }>): Promise<void> {
    const result = await this.queryExecutor.executeTransaction(queries);
    
    if (result.some(r => !r.success)) {
      const errors = result.filter(r => !r.success).map(r => r.error).join(', ');
      throw new Error(`Transaction failed: ${errors}`);
    }
  }

  /**
   * Clean up all resources
   */
  async cleanup(): Promise<void> {
    await this.testDataManager.cleanup();
  }
}

/**
 * Database test utilities for common patterns
 */
export class OracleTestUtils {
  /**
   * Generate test data for a table with specific patterns
   */
  static generateTestData(tableName: string, count: number, generator: (index: number) => Record<string, any>): TestDataSetup {
    const data = Array.from({ length: count }, (_, index) => generator(index));
    
    return {
      tableName,
      data,
      cleanupAfter: true,
      preserveExisting: false
    };
  }

  /**
   * Create validation for expected data
   */
  static createValidation(tableName: string, conditions: Record<string, any>, expectedCount?: number): TestDataValidation {
    return {
      tableName,
      conditions,
      expectedCount
    };
  }

  /**
   * Wait for database condition to be met (useful for async operations)
   */
  static async waitForCondition(
    queryExecutor: OracleQueryExecutor,
    sql: string,
    condition: (result: QueryResult) => boolean,
    options: {
      timeout?: number;
      interval?: number;
      bindParams?: any[];
    } = {}
  ): Promise<QueryResult> {
    const { timeout = 10000, interval = 1000, bindParams } = options;
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const result = await queryExecutor.select(sql, { bindParams });
      
      if (condition(result)) {
        return result;
      }
      
      await new Promise(resolve => setTimeout(resolve, interval));
    }

    throw new Error(`Condition not met within ${timeout}ms for SQL: ${sql}`);
  }

  /**
   * Compare database states before and after an operation
   */
  static async compareStates(
    queryExecutor: OracleQueryExecutor,
    tables: string[],
    operation: () => Promise<void>
  ): Promise<{
    before: Record<string, any[]>;
    after: Record<string, any[]>;
    changes: Record<string, { added: number; removed: number; modified: number }>;
  }> {
    // Capture before state
    const before: Record<string, any[]> = {};
    for (const table of tables) {
      const result = await queryExecutor.select(`SELECT * FROM ${table}`);
      before[table] = result.rows;
    }

    // Execute operation
    await operation();

    // Capture after state
    const after: Record<string, any[]> = {};
    for (const table of tables) {
      const result = await queryExecutor.select(`SELECT * FROM ${table}`);
      after[table] = result.rows;
    }

    // Calculate changes
    const changes: Record<string, { added: number; removed: number; modified: number }> = {};
    for (const table of tables) {
      const beforeCount = before[table].length;
      const afterCount = after[table].length;
      
      changes[table] = {
        added: Math.max(0, afterCount - beforeCount),
        removed: Math.max(0, beforeCount - afterCount),
        modified: 0 // Simple implementation - could be enhanced
      };
    }

    return { before, after, changes };
  }
}