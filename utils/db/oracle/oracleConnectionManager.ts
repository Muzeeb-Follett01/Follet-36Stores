/**
 * Oracle Database Connection Manager
 * Handles connection pooling, lifecycle management, and error handling
 */

import oracledb, { Connection, Pool, PoolAttributes } from 'oracledb';
import { OracleConnectionConfig, OracleConfig } from './oracleConfig';

export class OracleConnectionManager {
  private static pools: Map<string, Pool> = new Map();
  private static connections: Map<string, Connection> = new Map();
  private static isInitialized = false;

  /**
   * Initialize Oracle client settings
   */
  static async initialize(options?: {
    outFormat?: number;
    fetchArraySize?: number;
    autoCommit?: boolean;
  }): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Configure Oracle client defaults
      oracledb.outFormat = options?.outFormat ?? oracledb.OUT_FORMAT_OBJECT;
      oracledb.fetchArraySize = options?.fetchArraySize ?? 100;
      oracledb.autoCommit = options?.autoCommit ?? false;

      // Set up Oracle client (may require Oracle Instant Client)
      // oracledb.initOracleClient({ libDir: 'path/to/instantclient' }); // Uncomment if needed

      this.isInitialized = true;
      console.log('✅ Oracle Database client initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Oracle client:', error);
      throw new Error(`Oracle client initialization failed: ${error}`);
    }
  }

  /**
   * Create a connection pool for an environment
   */
  static async createPool(environmentName: string): Promise<Pool> {
    await this.initialize();

    const existingPool = this.pools.get(environmentName);
    if (existingPool) {
      return existingPool;
    }

    try {
      const env = OracleConfig.getEnvironment(environmentName);
      const poolConfig: PoolAttributes = {
        user: env.config.user,
        password: env.config.password,
        connectString: env.config.connectString,
        poolMin: env.config.poolMin || 2,
        poolMax: env.config.poolMax || 10,
        poolIncrement: env.config.poolIncrement || 1,
        poolTimeout: env.config.poolTimeout || 60,
        stmtCacheSize: env.config.stmtCacheSize || 30
      };

      const pool = await oracledb.createPool(poolConfig);
      this.pools.set(environmentName, pool);
      
      console.log(`✅ Created Oracle connection pool for '${environmentName}' environment`);
      console.log(`   Pool size: ${poolConfig.poolMin}-${poolConfig.poolMax} connections`);
      
      return pool;
    } catch (error) {
      console.error(`❌ Failed to create pool for '${environmentName}':`, error);
      throw new Error(`Failed to create Oracle connection pool: ${error}`);
    }
  }

  /**
   * Get a connection from the pool
   */
  static async getConnection(environmentName: string = 'default'): Promise<Connection> {
    const pool = await this.createPool(environmentName);
    
    try {
      const connection = await pool.getConnection();
      const connectionId = `${environmentName}_${Date.now()}_${Math.random()}`;
      this.connections.set(connectionId, connection);
      
      // Add connection metadata
      (connection as any)._environmentName = environmentName;
      (connection as any)._connectionId = connectionId;
      
      return connection;
    } catch (error) {
      console.error(`❌ Failed to get connection from pool '${environmentName}':`, error);
      throw new Error(`Failed to get Oracle connection: ${error}`);
    }
  }

  /**
   * Create a direct connection (without pool)
   */
  static async createDirectConnection(config: OracleConnectionConfig): Promise<Connection> {
    await this.initialize();

    try {
      const connection = await oracledb.getConnection({
        user: config.user,
        password: config.password,
        connectString: config.connectString
      });

      const connectionId = `direct_${Date.now()}_${Math.random()}`;
      this.connections.set(connectionId, connection);
      (connection as any)._connectionId = connectionId;

      return connection;
    } catch (error) {
      console.error('❌ Failed to create direct connection:', error);
      throw new Error(`Failed to create Oracle direct connection: ${error}`);
    }
  }

  /**
   * Release a connection back to the pool
   */
  static async releaseConnection(connection: Connection): Promise<void> {
    try {
      const connectionId = (connection as any)._connectionId;
      if (connectionId) {
        this.connections.delete(connectionId);
      }
      
      await connection.close();
    } catch (error) {
      console.error('❌ Failed to release connection:', error);
      throw new Error(`Failed to release Oracle connection: ${error}`);
    }
  }

  /**
   * Close a specific pool
   */
  static async closePool(environmentName: string): Promise<void> {
    const pool = this.pools.get(environmentName);
    if (pool) {
      try {
        await pool.close(0); // Force close immediately
        this.pools.delete(environmentName);
        console.log(`✅ Closed Oracle pool for '${environmentName}' environment`);
      } catch (error) {
        console.error(`❌ Failed to close pool '${environmentName}':`, error);
      }
    }
  }

  /**
   * Close all pools and connections
   */
  static async closeAll(): Promise<void> {
    console.log('🔄 Closing all Oracle connections and pools...');

    // Close all individual connections
    for (const [id, connection] of this.connections) {
      try {
        await connection.close();
        this.connections.delete(id);
      } catch (error) {
        console.error(`Failed to close connection ${id}:`, error);
      }
    }

    // Close all pools
    for (const [name, pool] of this.pools) {
      try {
        await pool.close(0);
        this.pools.delete(name);
      } catch (error) {
        console.error(`Failed to close pool ${name}:`, error);
      }
    }

    console.log('✅ All Oracle connections and pools closed');
  }

  /**
   * Get pool statistics
   */
  static getPoolStats(environmentName: string): any {
    const pool = this.pools.get(environmentName);
    if (!pool) {
      return null;
    }

    return {
      connectionsInUse: pool.connectionsInUse,
      connectionsOpen: pool.connectionsOpen,
      poolMin: pool.poolMin,
      poolMax: pool.poolMax,
      poolIncrement: pool.poolIncrement,
      poolTimeout: pool.poolTimeout,
      stmtCacheSize: pool.stmtCacheSize
    };
  }

  /**
   * Health check for database connectivity
   */
  static async healthCheck(environmentName: string = 'default'): Promise<boolean> {
    try {
      const connection = await this.getConnection(environmentName);
      const result = await connection.execute('SELECT 1 FROM DUAL');
      await this.releaseConnection(connection);
      
      return !!(result.rows && result.rows.length > 0);
    } catch (error) {
      console.error(`❌ Health check failed for '${environmentName}':`, error);
      return false;
    }
  }
}