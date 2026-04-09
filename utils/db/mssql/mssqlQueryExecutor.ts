/**
 * MSSQL Query Executor
 */
import * as mssql from 'mssql';
import { MssqlConnectionManager } from './mssqlConnectionManager';

export interface QueryOptions {
  environment?: string;
  pool?: mssql.ConnectionPool;
  inputs?: Record<string, any>;
  timeout?: number;
}

export interface QueryResult<T = any> {
  rows: T[];
  rowsAffected?: number;
  queryExecutionTime: number;
  success: boolean;
  error?: string;
}

export class MssqlQueryExecutor {
  private environment: string;
  private pool?: mssql.ConnectionPool;

  constructor(environment: string = 'default', pool?: mssql.ConnectionPool) {
    this.environment = environment;
    this.pool = pool;
  }

  private async getPool(options?: QueryOptions): Promise<mssql.ConnectionPool> {
    if (options?.pool) return options.pool;
    if (this.pool) return this.pool;
    return await MssqlConnectionManager.getPool(options?.environment || this.environment);
  }

  async select<T = any>(sql: string, options: QueryOptions = {}): Promise<QueryResult<T>> {
    const start = Date.now();
    try {
      const pool = await this.getPool(options);
      const request = pool.request();
      if (options.inputs) Object.entries(options.inputs).forEach(([k, v]) => request.input(k, v));
      if (options.timeout) request.queryTimeout = options.timeout;
      const result = await request.query(sql);
      return { rows: result.recordset as T[], rowsAffected: result.rowsAffected ? result.rowsAffected[0] : undefined, queryExecutionTime: Date.now() - start, success: true };
    } catch (error) {
      console.error('❌ SELECT failed:', error);
      return { rows: [], queryExecutionTime: Date.now() - start, success: false, error: String(error) };
    }
  }

  async execute(sql: string, options: QueryOptions = {}): Promise<QueryResult> {
    const start = Date.now();
    try {
      const pool = await this.getPool(options);
      const request = pool.request();
      if (options.inputs) Object.entries(options.inputs).forEach(([k, v]) => request.input(k, v));
      if (options.timeout) request.queryTimeout = options.timeout;
      const result = await request.query(sql);
      return { rows: result.recordset || [], rowsAffected: result.rowsAffected ? result.rowsAffected[0] : undefined, queryExecutionTime: Date.now() - start, success: true };
    } catch (error) {
      console.error('❌ SQL execution failed:', error);
      return { rows: [], queryExecutionTime: Date.now() - start, success: false, error: String(error) };
    }
  }

  async executeTransaction(queries: Array<{ sql: string; inputs?: Record<string, any> }>, options: { environment?: string; pool?: mssql.ConnectionPool } = {}): Promise<QueryResult[]> {
    const pool = await this.getPool(options);
    const tr = new mssql.Transaction(pool);
    const results: QueryResult[] = [];
    try {
      await tr.begin();
      for (const q of queries) {
        const req = tr.request();
        if (q.inputs) Object.entries(q.inputs).forEach(([k, v]) => req.input(k, v));
        const r = await req.query(q.sql);
        results.push({ rows: r.recordset || [], rowsAffected: r.rowsAffected ? r.rowsAffected[0] : undefined, queryExecutionTime: 0, success: true });
      }
      await tr.commit();
      return results;
    } catch (error) {
      try { await tr.rollback(); } catch (e) { /* ignore */ }
      console.error('❌ Transaction failed:', error);
      throw error;
    }
  }

  async getRowCount(tableName: string, whereClause?: string, options: QueryOptions = {}): Promise<number> {
    const sql = `SELECT COUNT(1) as ROW_COUNT FROM ${tableName}${whereClause ? ` WHERE ${whereClause}` : ''}`;
    const r = await this.select<{ ROW_COUNT: number }>(sql, options);
    return r.success && r.rows.length > 0 ? r.rows[0].ROW_COUNT : 0;
  }

  async tableExists(tableName: string, schema?: string, options: QueryOptions = {}): Promise<boolean> {
    const full = schema ? `'${schema}'` : 'SCHEMA_NAME()';
    const sql = `SELECT COUNT(1) as COUNT FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '${tableName}' ${schema ? `AND TABLE_SCHEMA = '${schema}'` : ''}`;
    const r = await this.select<{ COUNT: number }>(sql, options);
    return r.success && r.rows.length > 0 && r.rows[0].COUNT > 0;
  }
}
