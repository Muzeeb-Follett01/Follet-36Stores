/**
 * Oracle Database Test Data Manager
 * Handles test data setup, cleanup, and validation for testing scenarios
 */

import { OracleQueryExecutor, QueryResult } from './oracleQueryExecutor';
import { OracleConnectionManager } from './oracleConnectionManager';
import { Connection } from 'oracledb';

export interface TestDataSetup {
  tableName: string;
  data: Record<string, any>[];
  cleanupAfter?: boolean;
  preserveExisting?: boolean;
}

export interface TestDataValidation {
  tableName: string;
  conditions: Record<string, any>;
  expectedCount?: number;
  expectedData?: Record<string, any>;
}

export interface DatabaseSnapshot {
  timestamp: Date;
  tables: Record<string, any[]>;
  metadata: {
    snapshotId: string;
    environment: string;
    description?: string;
  };
}

export class OracleTestDataManager {
  private queryExecutor: OracleQueryExecutor;
  private environment: string;
  private snapshots: Map<string, DatabaseSnapshot> = new Map();
  private createdRecords: Map<string, string[]> = new Map(); // table -> record IDs

  constructor(environment: string = 'testing') {
    this.environment = environment;
    this.queryExecutor = new OracleQueryExecutor(environment);
  }

  /**
   * Set up test data for multiple tables
   */
  async setupTestData(setups: TestDataSetup[]): Promise<{success: boolean, results: QueryResult[], errors: string[]}> {
    const results: QueryResult[] = [];
    const errors: string[] = [];
    let success = true;

    console.log(`🔄 Setting up test data for ${setups.length} tables...`);

    for (const setup of setups) {
      try {
        const result = await this.setupTableData(setup);
        results.push(result);
        
        if (!result.success) {
          success = false;
          errors.push(`Failed to setup data for ${setup.tableName}: ${result.error}`);
        } else {
          console.log(`✅ Setup complete for ${setup.tableName}: ${result.rowsAffected || setup.data.length} records`);
        }
      } catch (error) {
        success = false;
        const errorMsg = `Exception setting up ${setup.tableName}: ${error}`;
        errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
    }

    return { success, results, errors };
  }

  /**
   * Setup data for a single table
   */
  async setupTableData(setup: TestDataSetup): Promise<QueryResult> {
    const { tableName, data, cleanupAfter = true, preserveExisting = false } = setup;

    // Clean existing data if not preserving
    if (!preserveExisting) {
      await this.cleanTableData(tableName);
    }

    // Insert test data
    const insertResults: QueryResult[] = [];
    const recordIds: string[] = [];

    for (const record of data) {
      const columns = Object.keys(record);
      const values = Object.values(record);
      const placeholders = columns.map((_, index) => `:${index + 1}`).join(', ');
      
      const sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
      
      const result = await this.queryExecutor.insert(sql, {
        bindParams: values,
        autoCommit: true
      });

      insertResults.push(result);

      // Track created records for cleanup
      if (cleanupAfter && record.id) {
        recordIds.push(record.id);
      }
    }

    // Store record IDs for later cleanup
    if (cleanupAfter && recordIds.length > 0) {
      this.createdRecords.set(tableName, recordIds);
    }

    // Return combined result
    const totalRowsAffected = insertResults.reduce((sum, r) => sum + (r.rowsAffected || 0), 0);
    const allSuccess = insertResults.every(r => r.success);
    const errors = insertResults.filter(r => !r.success).map(r => r.error).join('; ');

    return {
      rows: [],
      rowsAffected: totalRowsAffected,
      queryExecutionTime: insertResults.reduce((sum, r) => sum + r.queryExecutionTime, 0),
      success: allSuccess,
      error: errors || undefined
    };
  }

  /**
   * Clean test data from tables
   */
  async cleanupTestData(tableNames?: string[]): Promise<void> {
    const tablesToClean = tableNames || Array.from(this.createdRecords.keys());
    
    console.log(`🧹 Cleaning up test data from ${tablesToClean.length} tables...`);

    for (const tableName of tablesToClean) {
      try {
        const recordIds = this.createdRecords.get(tableName);
        
        if (recordIds && recordIds.length > 0) {
          // Delete specific records
          const placeholders = recordIds.map((_, index) => `:${index + 1}`).join(', ');
          const sql = `DELETE FROM ${tableName} WHERE id IN (${placeholders})`;
          
          await this.queryExecutor.delete(sql, {
            bindParams: recordIds,
            autoCommit: true
          });
          
          console.log(`✅ Cleaned ${recordIds.length} records from ${tableName}`);
        } else {
          // Clean all test data (if no specific IDs tracked)
          await this.cleanTableData(tableName);
        }
        
        this.createdRecords.delete(tableName);
      } catch (error) {
        console.error(`❌ Failed to cleanup ${tableName}:`, error);
      }
    }
  }

  /**
   * Validate test data exists and matches expectations
   */
  async validateTestData(validations: TestDataValidation[]): Promise<{success: boolean, results: any[], errors: string[]}> {
    const results: any[] = [];
    const errors: string[] = [];
    let success = true;

    console.log(`🔍 Validating test data across ${validations.length} tables...`);

    for (const validation of validations) {
      try {
        const result = await this.validateTableData(validation);
        results.push(result);
        
        if (!result.isValid) {
          success = false;
          errors.push(`Validation failed for ${validation.tableName}: ${result.error}`);
        } else {
          console.log(`✅ Validation passed for ${validation.tableName}`);
        }
      } catch (error) {
        success = false;
        const errorMsg = `Exception validating ${validation.tableName}: ${error}`;
        errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
    }

    return { success, results, errors };
  }

  /**
   * Validate data for a single table
   */
  async validateTableData(validation: TestDataValidation): Promise<{
    isValid: boolean;
    actualCount?: number;
    expectedCount?: number;
    actualData?: any[];
    error?: string;
  }> {
    const { tableName, conditions, expectedCount, expectedData } = validation;

    // Build WHERE clause from conditions
    const whereConditions = Object.entries(conditions)
      .map(([key, value]) => `${key} = :${key}`)
      .join(' AND ');
    
    const sql = `SELECT * FROM ${tableName} WHERE ${whereConditions}`;
    
    const result = await this.queryExecutor.select(sql, {
      bindObject: conditions
    });

    if (!result.success) {
      return {
        isValid: false,
        error: result.error
      };
    }

    const actualCount = result.rows.length;
    
    // Validate count if specified
    if (expectedCount !== undefined && actualCount !== expectedCount) {
      return {
        isValid: false,
        actualCount,
        expectedCount,
        error: `Expected ${expectedCount} records, found ${actualCount}`
      };
    }

    // Validate specific data if specified
    if (expectedData && result.rows.length > 0) {
      const actualRecord = result.rows[0];
      const mismatches = Object.entries(expectedData)
        .filter(([key, expectedValue]) => actualRecord[key] !== expectedValue)
        .map(([key, expectedValue]) => `${key}: expected '${expectedValue}', got '${actualRecord[key]}'`);

      if (mismatches.length > 0) {
        return {
          isValid: false,
          actualData: result.rows,
          error: `Data mismatch: ${mismatches.join(', ')}`
        };
      }
    }

    return {
      isValid: true,
      actualCount,
      expectedCount,
      actualData: result.rows
    };
  }

  /**
   * Create a snapshot of current database state
   */
  async createSnapshot(tables: string[], description?: string): Promise<string> {
    const snapshotId = `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const snapshotData: Record<string, any[]> = {};

    console.log(`📸 Creating database snapshot '${snapshotId}' for ${tables.length} tables...`);

    for (const tableName of tables) {
      try {
        const result = await this.queryExecutor.select(`SELECT * FROM ${tableName}`);
        snapshotData[tableName] = result.success ? result.rows : [];
      } catch (error) {
        console.error(`❌ Failed to snapshot ${tableName}:`, error);
        snapshotData[tableName] = [];
      }
    }

    const snapshot: DatabaseSnapshot = {
      timestamp: new Date(),
      tables: snapshotData,
      metadata: {
        snapshotId,
        environment: this.environment,
        description
      }
    };

    this.snapshots.set(snapshotId, snapshot);
    console.log(`✅ Snapshot '${snapshotId}' created successfully`);
    
    return snapshotId;
  }

  /**
   * Restore database to a previous snapshot state
   */
  async restoreSnapshot(snapshotId: string): Promise<void> {
    const snapshot = this.snapshots.get(snapshotId);
    if (!snapshot) {
      throw new Error(`Snapshot '${snapshotId}' not found`);
    }

    console.log(`🔄 Restoring database to snapshot '${snapshotId}'...`);

    for (const [tableName, data] of Object.entries(snapshot.tables)) {
      try {
        // Clear current data
        await this.cleanTableData(tableName);
        
        // Restore snapshot data
        if (data.length > 0) {
          await this.setupTableData({
            tableName,
            data,
            cleanupAfter: false,
            preserveExisting: false
          });
        }
        
        console.log(`✅ Restored ${data.length} records to ${tableName}`);
      } catch (error) {
        console.error(`❌ Failed to restore ${tableName}:`, error);
      }
    }

    console.log(`✅ Database restored to snapshot '${snapshotId}'`);
  }

  /**
   * Get available snapshots
   */
  getSnapshots(): DatabaseSnapshot[] {
    return Array.from(this.snapshots.values());
  }

  /**
   * Clean all data from a table
   */
  private async cleanTableData(tableName: string): Promise<void> {
    await this.queryExecutor.delete(`DELETE FROM ${tableName}`, {
      autoCommit: true
    });
  }

  /**
   * Clean up all resources
   */
  async cleanup(): Promise<void> {
    await this.cleanupTestData();
    this.snapshots.clear();
    this.createdRecords.clear();
  }
}