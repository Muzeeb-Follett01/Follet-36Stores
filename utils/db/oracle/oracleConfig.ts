/**
 * Oracle Database Configuration Management
 * Handles database connections, environments, and configuration
 */

export interface OracleConnectionConfig {
  user: string;
  password: string;
  connectString: string;
  poolMin?: number;
  poolMax?: number;
  poolIncrement?: number;
  poolTimeout?: number;
  stmtCacheSize?: number;
}

export interface DatabaseEnvironment {
  name: string;
  config: OracleConnectionConfig;
  description?: string;
}

export class OracleConfig {
  private static environments: Map<string, DatabaseEnvironment> = new Map();

  /**
   * Register a database environment
   */
  static registerEnvironment(env: DatabaseEnvironment): void {
    this.environments.set(env.name.toLowerCase(), env);
  }

  /**
   * Get configuration for an environment
   */
  static getEnvironment(name: string): DatabaseEnvironment {
    const env = this.environments.get(name.toLowerCase());
    if (!env) {
      throw new Error(`Database environment '${name}' not found. Available: ${Array.from(this.environments.keys()).join(', ')}`);
    }
    return env;
  }

  /**
   * Get all registered environments
   */
  static getAvailableEnvironments(): string[] {
    return Array.from(this.environments.keys());
  }

  /**
   * Load configuration from oracle.env file and environment variables
   */
  static loadFromEnv(envName: string = 'testing', envFilePath?: string): OracleConnectionConfig {
    // Import here to avoid circular dependency
    const { OracleEnvLoader } = require('./oracleEnvLoader');
    
    try {
      // Load environment-specific configuration
      const envConfig = OracleEnvLoader.getEnvironmentConfig(envName, envFilePath);
      
      // Validate required configuration
      if (!OracleEnvLoader.validateConfig(envConfig, envName)) {
        throw new Error(`Invalid Oracle configuration for environment '${envName}'`);
      }

      const config: OracleConnectionConfig = {
        user: envConfig.ORACLE_USER || '',
        password: envConfig.ORACLE_PASSWORD || '',
        connectString: envConfig.ORACLE_CONNECT_STRING || '',
        poolMin: parseInt(envConfig.ORACLE_POOL_MIN || '2'),
        poolMax: parseInt(envConfig.ORACLE_POOL_MAX || '10'),
        poolIncrement: parseInt(envConfig.ORACLE_POOL_INCREMENT || '1'),
        poolTimeout: parseInt(envConfig.ORACLE_POOL_TIMEOUT || '60'),
        stmtCacheSize: parseInt(envConfig.ORACLE_STMT_CACHE_SIZE || '30')
      };

      console.log(`✅ Loaded Oracle configuration for '${envName}' environment`);
      return config;

    } catch (error) {
      console.error(`❌ Failed to load Oracle configuration for '${envName}':`, error);
      throw error;
    }
  }

  /**
   * Load configuration from specific oracle.env file
   */
  static loadFromEnvFile(envFilePath: string, envName: string = 'testing'): OracleConnectionConfig {
    return this.loadFromEnv(envName, envFilePath);
  }

  /**
   * Display current configuration for debugging
   */
  static displayConfig(envName: string = 'testing', envFilePath?: string): void {
    const { OracleEnvLoader } = require('./oracleEnvLoader');
    OracleEnvLoader.displayConfig(envName, envFilePath);
  }

  /**
   * Get available environments from configuration
   */
  static getAvailableEnvironmentsFromFile(envFilePath?: string): string[] {
    const { OracleEnvLoader } = require('./oracleEnvLoader');
    return OracleEnvLoader.getAvailableEnvironments(envFilePath);
  }

  /**
   * Create a sample oracle.env file
   */
  static createSampleEnvFile(targetPath?: string): string {
    const { OracleEnvLoader } = require('./oracleEnvLoader');
    return OracleEnvLoader.createSampleEnvFile(targetPath);
  }
}

// Pre-configured common environments
export const OracleEnvironments = {
  /**
   * Register development environment
   */
  development: (config: Partial<OracleConnectionConfig>) => {
    OracleConfig.registerEnvironment({
      name: 'development',
      description: 'Development database environment',
      config: {
        poolMin: 1,
        poolMax: 5,
        poolIncrement: 1,
        poolTimeout: 30,
        stmtCacheSize: 20,
        ...config
      } as OracleConnectionConfig
    });
  },

  /**
   * Register testing environment
   */
  testing: (config: Partial<OracleConnectionConfig>) => {
    OracleConfig.registerEnvironment({
      name: 'testing',
      description: 'Testing database environment',
      config: {
        poolMin: 2,
        poolMax: 8,
        poolIncrement: 1,
        poolTimeout: 45,
        stmtCacheSize: 25,
        ...config
      } as OracleConnectionConfig
    });
  },

  /**
   * Register production environment
   */
  production: (config: Partial<OracleConnectionConfig>) => {
    OracleConfig.registerEnvironment({
      name: 'production',
      description: 'Production database environment',
      config: {
        poolMin: 5,
        poolMax: 20,
        poolIncrement: 2,
        poolTimeout: 60,
        stmtCacheSize: 30,
        ...config
      } as OracleConnectionConfig
    });
  }
};