/**
 * Oracle Database Query Builder and Executor
 * Provides high-level query operations with result mapping and validation
 */

import { Connection } from 'oracledb';
import { OracleConnectionManager } from './oracleConnectionManager';

export interface QueryOptions {
  environment?: string;
  connection?: Connection;
  bindParams?: any[];
  bindObject?: Record<string, any>;
  autoCommit?: boolean;
  fetchArraySize?: number;
  maxRows?: number;
}

export interface QueryResult<T = any> {
  rows: T[];
  rowsAffected?: number;
  metadata?: any[];
  queryExecutionTime: number;
  success: boolean;
  error?: string;
}

export interface TransactionOptions {
  environment?: string;
  connection?: Connection;
  isolationLevel?: 'READ_COMMITTED' | 'SERIALIZABLE';
}

export class OracleQueryExecutor {
  private connection?: Connection;
  private environment: string;
  private isTransactionActive = false;

  constructor(environment: string = 'default', connection?: Connection) {
    this.environment = environment;
    this.connection = connection;
  }

  /**
   * Execute a SELECT query
   */
  async select<T = any>(
    sql: string, 
    options: QueryOptions = {}
  ): Promise<QueryResult<T>> {
    const startTime = Date.now();
    
    try {
      const connection = await this.getConnection(options);
      
      const result = await connection.execute(sql, 
        options.bindParams || options.bindObject || [], 
        {
          autoCommit: options.autoCommit,
          fetchArraySize: options.fetchArraySize,
          maxRows: options.maxRows
        }
      );

      const executionTime = Date.now() - startTime;

      return {
        rows: (result.rows as T[]) || [],
        metadata: result.metaData,
        queryExecutionTime: executionTime,
        success: true
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.error('❌ SELECT query failed:', error);
      
      return {
        rows: [],
        queryExecutionTime: executionTime,
        success: false,
        error: String(error)
      };
    } finally {
      await this.releaseConnection(options);
    }
  }

  /**
   * Execute an INSERT query
   */
  async insert(
    sql: string, 
    options: QueryOptions = {}
  ): Promise<QueryResult> {
    return this.executeModifyQuery(sql, 'INSERT', options);
  }

  /**
   * Execute an UPDATE query
   */
  async update(
    sql: string, 
    options: QueryOptions = {}
  ): Promise<QueryResult> {
    return this.executeModifyQuery(sql, 'UPDATE', options);
  }

  /**
   * Execute a DELETE query
   */
  async delete(
    sql: string, 
    options: QueryOptions = {}
  ): Promise<QueryResult> {
    return this.executeModifyQuery(sql, 'DELETE', options);
  }

  /**
   * Execute any SQL statement
   */
  async execute(
    sql: string, 
    options: QueryOptions = {}
  ): Promise<QueryResult> {
    const startTime = Date.now();
    
    try {
      const connection = await this.getConnection(options);
      
      const result = await connection.execute(sql, 
        options.bindParams || options.bindObject || [], 
        {
          autoCommit: options.autoCommit ?? true,
          fetchArraySize: options.fetchArraySize,
          maxRows: options.maxRows
        }
      );

      const executionTime = Date.now() - startTime;

      return {
        rows: (result.rows as any[]) || [],
        rowsAffected: result.rowsAffected,
        metadata: result.metaData,
        queryExecutionTime: executionTime,
        success: true
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.error('❌ SQL execution failed:', error);
      
      return {
        rows: [],
        queryExecutionTime: executionTime,
        success: false,
        error: String(error)
      };
    } finally {
      await this.releaseConnection(options);
    }
  }

  /**
   * Execute multiple queries in a transaction
   */
  async executeTransaction(
    queries: Array<{ sql: string; bindParams?: any[] | Record<string, any> }>,
    options: TransactionOptions = {}
  ): Promise<QueryResult[]> {
    const connection = options.connection || await OracleConnectionManager.getConnection(options.environment || this.environment);
    const results: QueryResult[] = [];

    try {
      // Start transaction
      await connection.execute('BEGIN');
      this.isTransactionActive = true;

      // Execute all queries
      for (const query of queries) {
        const result = await this.execute(query.sql, {
          connection,
          bindParams: Array.isArray(query.bindParams) ? query.bindParams : undefined,
          bindObject: !Array.isArray(query.bindParams) ? query.bindParams : undefined,
          autoCommit: false
        });
        results.push(result);

        // If any query fails, rollback
        if (!result.success) {
          await connection.execute('ROLLBACK');
          this.isTransactionActive = false;
          throw new Error(`Transaction failed at query: ${query.sql}. Error: ${result.error}`);
        }
      }

      // Commit transaction
      await connection.execute('COMMIT');
      this.isTransactionActive = false;
      
      console.log(`✅ Transaction completed successfully with ${queries.length} queries`);
      return results;

    } catch (error) {
      // Rollback on error
      if (this.isTransactionActive) {
        await connection.execute('ROLLBACK');
        this.isTransactionActive = false;
      }
      
      console.error('❌ Transaction failed:', error);
      throw error;
    } finally {
      if (!options.connection) {
        await OracleConnectionManager.releaseConnection(connection);
      }
    }
  }

  /**
   * Execute a stored procedure
   */
  async callProcedure(
    procedureName: string,
    parameters: Record<string, any> = {},
    options: QueryOptions = {}
  ): Promise<QueryResult> {
    const paramNames = Object.keys(parameters);
    const bindParams = Object.values(parameters);
    
    // Build procedure call syntax
    const paramPlaceholders = paramNames.map(name => `:${name}`).join(', ');
    const sql = `BEGIN ${procedureName}(${paramPlaceholders}); END;`;

    return this.execute(sql, {
      ...options,
      bindObject: parameters
    });
  }

  /**
   * Get table row count
   */
  async getRowCount(tableName: string, whereClause?: string, options: QueryOptions = {}): Promise<number> {
    const sql = `SELECT COUNT(*) as ROW_COUNT FROM ${tableName}${whereClause ? ` WHERE ${whereClause}` : ''}`;
    const result = await this.select<{ ROW_COUNT: number }>(sql, options);
    
    return result.success && result.rows.length > 0 ? result.rows[0].ROW_COUNT : 0;
  }

  /**
   * Check if table exists
   */
  async tableExists(tableName: string, schema?: string, options: QueryOptions = {}): Promise<boolean> {
    const sql = `
      SELECT COUNT(*) as TABLE_COUNT 
      FROM ALL_TABLES 
      WHERE TABLE_NAME = UPPER(:tableName)
      ${schema ? 'AND OWNER = UPPER(:schema)' : ''}
    `;
    
    const bindObject = schema ? { tableName, schema } : { tableName };
    const result = await this.select<{ TABLE_COUNT: number }>(sql, { ...options, bindObject });
    
    return result.success && result.rows.length > 0 && result.rows[0].TABLE_COUNT > 0;
  }

  /**
   * Get table metadata
   */
  async getTableMetadata(tableName: string, schema?: string, options: QueryOptions = {}): Promise<any[]> {
    const sql = `
      SELECT COLUMN_NAME, DATA_TYPE, DATA_LENGTH, NULLABLE, DATA_DEFAULT
      FROM ALL_TAB_COLUMNS 
      WHERE TABLE_NAME = UPPER(:tableName)
      ${schema ? 'AND OWNER = UPPER(:schema)' : ''}
      ORDER BY COLUMN_ID
    `;
    
    const bindObject = schema ? { tableName, schema } : { tableName };
    const result = await this.select(sql, { ...options, bindObject });
    
    return result.success ? result.rows : [];
  }

  // Private helper methods
  private async executeModifyQuery(
    sql: string, 
    operation: string, 
    options: QueryOptions
  ): Promise<QueryResult> {
    const startTime = Date.now();
    
    try {
      const connection = await this.getConnection(options);
      
      const result = await connection.execute(sql, 
        options.bindParams || options.bindObject || [], 
        {
          autoCommit: options.autoCommit ?? true
        }
      );

      const executionTime = Date.now() - startTime;

      return {
        rows: [],
        rowsAffected: result.rowsAffected,
        queryExecutionTime: executionTime,
        success: true
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.error(`❌ ${operation} query failed:`, error);
      
      return {
        rows: [],
        queryExecutionTime: executionTime,
        success: false,
        error: String(error)
      };
    } finally {
      await this.releaseConnection(options);
    }
  }

  private async getConnection(options: QueryOptions): Promise<Connection> {
    if (options.connection) {
      return options.connection;
    }
    
    if (this.connection) {
      return this.connection;
    }
    
    return await OracleConnectionManager.getConnection(options.environment || this.environment);
  }

  private async releaseConnection(options: QueryOptions): Promise<void> {
    // Only release if we created the connection (not provided via options)
    if (!options.connection && !this.connection) {
      // Connection will be released by the connection manager
    }
  }
}