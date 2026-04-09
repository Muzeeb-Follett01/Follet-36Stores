/**
 * MSSQL Connection Manager using `mssql` package
 */
import * as mssql from 'mssql';
import { MssqlConnectionConfig, MssqlConfig } from './mssqlConfig';

export class MssqlConnectionManager {
  private static pools: Map<string, mssql.ConnectionPool> = new Map();
  private static isInitialized = false;

  static async initialize(): Promise<void> {
    if (this.isInitialized) return;
    // noop for mssql - can be extended if needed
    this.isInitialized = true;
    console.log('✅ MSSQL Connection Manager initialized');
  }

  static async createPool(environmentName: string = 'default'): Promise<mssql.ConnectionPool> {
    await this.initialize();
    const existing = this.pools.get(environmentName);
    if (existing && existing.connected) return existing;

    try {
      const env = MssqlConfig.getEnvironment(environmentName);
      const cfg = env.config;

      const poolConfig: mssql.config = {
        user: cfg.user,
        password: cfg.password,
        server: cfg.server,
        database: cfg.database,
        port: cfg.port,
        options: {
          encrypt: cfg.encrypt ?? false,
          trustServerCertificate: cfg.trustServerCertificate ?? true
        },
        pool: {
          min: cfg.poolMin ?? 0,
          max: cfg.poolMax ?? 10,
          idleTimeoutMillis: cfg.poolIdleTimeout ?? 30000
        }
      } as any;

      const pool = new mssql.ConnectionPool(poolConfig);
      await pool.connect();
      this.pools.set(environmentName, pool);

      console.log(`✅ Created MSSQL pool for '${environmentName}'`);
      return pool;
    } catch (error) {
      console.error(`❌ Failed to create MSSQL pool for '${environmentName}':`, error);
      throw error;
    }
  }

  static async getPool(environmentName: string = 'default'): Promise<mssql.ConnectionPool> {
    const pool = await this.createPool(environmentName);
    return pool;
  }

  static async releasePool(environmentName: string): Promise<void> {
    const pool = this.pools.get(environmentName);
    if (pool) {
      try {
        await pool.close();
        this.pools.delete(environmentName);
        console.log(`✅ Closed MSSQL pool '${environmentName}'`);
      } catch (error) {
        console.error(`❌ Failed to close MSSQL pool '${environmentName}':`, error);
      }
    }
  }

  static async closeAll(): Promise<void> {
    for (const [name, pool] of this.pools) {
      try {
        await pool.close();
        this.pools.delete(name);
      } catch (error) {
        console.error(`Failed to close pool ${name}:`, error);
      }
    }
    console.log('✅ All MSSQL pools closed');
  }

  static async healthCheck(environmentName: string = 'default'): Promise<boolean> {
    try {
      const pool = await this.getPool(environmentName);
      const result = await pool.request().query('SELECT 1 as OK');
      return !!(result && result.recordset && result.recordset.length > 0);
    } catch (error) {
      console.error(`❌ MSSQL health check failed for '${environmentName}':`, error);
      return false;
    }
  }
}
