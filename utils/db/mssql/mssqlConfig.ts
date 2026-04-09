/**
 * MS SQL Database Configuration Management
 */
export interface MssqlConnectionConfig {
  user: string;
  password: string;
  server: string;
  database: string;
  port?: number;
  poolMin?: number;
  poolMax?: number;
  poolIdleTimeout?: number;
  encrypt?: boolean;
  trustServerCertificate?: boolean;
}

export interface DatabaseEnvironment {
  name: string;
  config: MssqlConnectionConfig;
  description?: string;
}

export class MssqlConfig {
  private static environments: Map<string, DatabaseEnvironment> = new Map();

  static registerEnvironment(env: DatabaseEnvironment): void {
    this.environments.set(env.name.toLowerCase(), env);
  }

  static getEnvironment(name: string): DatabaseEnvironment {
    const key = name.toLowerCase();
    const env = this.environments.get(key);
    if (env) {
      return env;
    }

    // Attempt to auto-load from mssql.env when environment wasn't explicitly registered
    try {
      const config = this.loadFromEnv(name);
      // Validate using env loader
      const { MssqlEnvLoader } = require('./mssqlEnvLoader');
      const envConfig = MssqlEnvLoader.getEnvironmentConfig(name);
      if (!MssqlEnvLoader.validateConfig(envConfig, name)) {
        throw new Error(`Invalid MSSQL configuration for environment '${name}'`);
      }

      const databaseEnvironment: DatabaseEnvironment = {
        name,
        description: `Loaded from mssql.env (${name})`,
        config
      };

      this.registerEnvironment(databaseEnvironment);
      return databaseEnvironment;
    } catch (err) {
      throw new Error(`Database environment '${name}' not found and could not be loaded from mssql.env: ${err}`);
    }
  }

  static getAvailableEnvironments(): string[] {
    return Array.from(this.environments.keys());
  }

  static loadFromEnv(envName: string = 'testing', envFilePath?: string): MssqlConnectionConfig {
    const { MssqlEnvLoader } = require('./mssqlEnvLoader');
    const envConfig = MssqlEnvLoader.getEnvironmentConfig(envName, envFilePath);

    const config: MssqlConnectionConfig = {
      user: envConfig.MSSQL_USER || '',
      password: envConfig.MSSQL_PASSWORD || '',
      server: envConfig.MSSQL_SERVER || 'localhost',
      database: envConfig.MSSQL_DATABASE || '',
      port: envConfig.MSSQL_PORT ? parseInt(envConfig.MSSQL_PORT) : undefined,
      poolMin: envConfig.MSSQL_POOL_MIN ? parseInt(envConfig.MSSQL_POOL_MIN) : 0,
      poolMax: envConfig.MSSQL_POOL_MAX ? parseInt(envConfig.MSSQL_POOL_MAX) : 10,
      poolIdleTimeout: envConfig.MSSQL_POOL_IDLE_TIMEOUT ? parseInt(envConfig.MSSQL_POOL_IDLE_TIMEOUT) : 30000,
      encrypt: envConfig.MSSQL_ENCRYPT === 'true',
      trustServerCertificate: envConfig.MSSQL_TRUST_SERVER_CERT === 'true'
    };

    console.log(`✅ Loaded MSSQL configuration for '${envName}' environment`);
    return config;
  }

  static displayConfig(envName: string = 'testing', envFilePath?: string): void {
    const { MssqlEnvLoader } = require('./mssqlEnvLoader');
    MssqlEnvLoader.displayConfig(envName, envFilePath);
  }

  static createSampleEnvFile(targetPath?: string): string {
    const { MssqlEnvLoader } = require('./mssqlEnvLoader');
    return MssqlEnvLoader.createSampleEnvFile(targetPath);
  }
}

export const MssqlEnvironments = {
  development: (config: Partial<MssqlConnectionConfig>) => {
    MssqlConfig.registerEnvironment({
      name: 'development',
      description: 'Development MSSQL environment',
      config: {
        poolMin: 0,
        poolMax: 5,
        poolIdleTimeout: 30000,
        encrypt: false,
        trustServerCertificate: true,
        ...config
      } as MssqlConnectionConfig
    });
  },
  testing: (config: Partial<MssqlConnectionConfig>) => {
    MssqlConfig.registerEnvironment({
      name: 'testing',
      description: 'Testing MSSQL environment',
      config: {
        poolMin: 0,
        poolMax: 10,
        poolIdleTimeout: 30000,
        encrypt: false,
        trustServerCertificate: true,
        ...config
      } as MssqlConnectionConfig
    });
  },
  production: (config: Partial<MssqlConnectionConfig>) => {
    MssqlConfig.registerEnvironment({
      name: 'production',
      description: 'Production MSSQL environment',
      config: {
        poolMin: 0,
        poolMax: 50,
        poolIdleTimeout: 30000,
        encrypt: true,
        trustServerCertificate: false,
        ...config
      } as MssqlConnectionConfig
    });
  }
};
