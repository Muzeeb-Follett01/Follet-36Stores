/**
 * Oracle Environment Configuration Loader
 * Enhanced configuration loading from oracle.env files and environment variables
 */

import * as fs from 'fs';
import * as path from 'path';

export interface OracleEnvConfig {
  [key: string]: string | undefined;
}

export class OracleEnvLoader {
  private static loadedConfigs: Map<string, OracleEnvConfig> = new Map();
  private static rootPath: string = process.cwd();

  /**
   * Set the root path for searching oracle.env files
   */
  static setRootPath(rootPath: string): void {
    this.rootPath = rootPath;
  }

  /**
   * Load configuration from oracle.env file and environment variables
   */
  static loadConfig(envFilePath?: string): OracleEnvConfig {
    const configPath = envFilePath || this.findOracleEnvFile();
    
    // Check if already loaded
    if (this.loadedConfigs.has(configPath)) {
      return this.loadedConfigs.get(configPath)!;
    }

    const config: OracleEnvConfig = {};

    // 1. Load from oracle.env file first (if exists)
    if (configPath && fs.existsSync(configPath)) {
      const fileConfig = this.parseEnvFile(configPath);
      Object.assign(config, fileConfig);
      console.log(`✅ Loaded Oracle configuration from: ${configPath}`);
    } else {
      console.log('ℹ️  No oracle.env file found, using environment variables only');
    }

    // 2. Override with actual environment variables (higher priority)
    const envConfig = this.loadFromEnvironmentVariables();
    Object.assign(config, envConfig);

    // Cache the loaded config
    this.loadedConfigs.set(configPath, config);

    return config;
  }

  /**
   * Get environment-specific configuration
   */
  static getEnvironmentConfig(environment: string, envFilePath?: string): OracleEnvConfig {
    const allConfig = this.loadConfig(envFilePath);
    const envPrefix = this.getEnvironmentPrefix(environment);
    const envConfig: OracleEnvConfig = {};

    // Extract environment-specific settings
    Object.keys(allConfig).forEach(key => {
      if (key.startsWith(envPrefix)) {
        // Remove prefix and convert to standard key
        const standardKey = key.replace(envPrefix, 'ORACLE_');
        envConfig[standardKey] = allConfig[key];
      }
    });

    // Fallback to default ORACLE_* settings if environment-specific not found
    Object.keys(allConfig).forEach(key => {
      if (key.startsWith('ORACLE_')) {
        const standardKey = key;
        if (!envConfig[standardKey]) {
          envConfig[standardKey] = allConfig[key];
        }
      }
    });

    return envConfig;
  }

  /**
   * Validate required configuration is present
   */
  static validateConfig(config: OracleEnvConfig, environment: string): boolean {
    const required = ['ORACLE_USER', 'ORACLE_PASSWORD', 'ORACLE_CONNECT_STRING'];
    const missing = required.filter(key => !config[key] || config[key]!.trim() === '');

    if (missing.length > 0) {
      console.error(`❌ Missing required Oracle configuration for '${environment}' environment:`);
      missing.forEach(key => console.error(`   - ${key}`));
      console.error('\n💡 Please set these in:');
      console.error('   1. oracle.env file, or');
      console.error('   2. Environment variables, or');
      console.error(`   3. Environment-specific variables (${this.getEnvironmentPrefix(environment)}*)`);
      return false;
    }

    return true;
  }

  /**
   * Get available environments from configuration
   */
  static getAvailableEnvironments(envFilePath?: string): string[] {
    const config = this.loadConfig(envFilePath);
    const environments = new Set<string>();

    Object.keys(config).forEach(key => {
      const match = key.match(/^([A-Z]+)_ORACLE_/);
      if (match) {
        environments.add(match[1].toLowerCase());
      }
    });

    // Always include default if ORACLE_* settings exist
    if (Object.keys(config).some(key => key.startsWith('ORACLE_'))) {
      environments.add('default');
    }

    return Array.from(environments).sort();
  }

  /**
   * Display current configuration (without sensitive data)
   */
  static displayConfig(environment: string, envFilePath?: string): void {
    const config = this.getEnvironmentConfig(environment, envFilePath);
    
    console.log(`\n🔧 Oracle Configuration for '${environment}' environment:`);
    console.log('=' .repeat(60));
    
    Object.keys(config).sort().forEach(key => {
      let value = config[key] || '';
      
      // Mask sensitive information
      if (key.includes('PASSWORD') || key.includes('SECRET')) {
        value = value ? '*'.repeat(8) : '(not set)';
      }
      
      console.log(`   ${key.padEnd(25)} = ${value}`);
    });
    
    console.log('=' .repeat(60));
  }

  /**
   * Create a sample oracle.env file
   */
  static createSampleEnvFile(targetPath?: string): string {
    const samplePath = targetPath || path.join(this.rootPath, 'oracle.env');
    const templatePath = path.join(this.rootPath, 'oracle.env.template');

    try {
      if (fs.existsSync(templatePath)) {
        fs.copyFileSync(templatePath, samplePath);
        console.log(`✅ Created sample oracle.env file: ${samplePath}`);
      } else {
        // Create basic template if no template exists
        const basicTemplate = this.getBasicTemplate();
        fs.writeFileSync(samplePath, basicTemplate);
        console.log(`✅ Created basic oracle.env file: ${samplePath}`);
      }
      
      return samplePath;
    } catch (error) {
      console.error(`❌ Failed to create oracle.env file: ${error}`);
      throw error;
    }
  }

  // Private helper methods
  private static findOracleEnvFile(): string {
    const possiblePaths = [
      path.join(this.rootPath, 'oracle.env'),
      path.join(this.rootPath, '.oracle.env'),
      path.join(this.rootPath, 'config', 'oracle.env'),
      path.join(this.rootPath, 'env', 'oracle.env')
    ];

    for (const envPath of possiblePaths) {
      if (fs.existsSync(envPath)) {
        return envPath;
      }
    }

    return ''; // No file found
  }

  private static parseEnvFile(filePath: string): OracleEnvConfig {
    const config: OracleEnvConfig = {};
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');

      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Skip comments and empty lines
        if (!trimmedLine || trimmedLine.startsWith('#')) {
          continue;
        }

        // Parse key=value pairs
        const equalIndex = trimmedLine.indexOf('=');
        if (equalIndex > 0) {
          const key = trimmedLine.substring(0, equalIndex).trim();
          let value = trimmedLine.substring(equalIndex + 1).trim();

          // Remove quotes if present
          if ((value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }

          config[key] = value;
        }
      }
    } catch (error) {
      console.error(`❌ Failed to parse oracle.env file: ${filePath}`, error);
    }

    return config;
  }

  private static loadFromEnvironmentVariables(): OracleEnvConfig {
    const config: OracleEnvConfig = {};
    
    // Load all environment variables that match Oracle patterns
    Object.keys(process.env).forEach(key => {
      if (key.includes('ORACLE') || key.startsWith('DEV_ORACLE') || 
          key.startsWith('TEST_ORACLE') || key.startsWith('PROD_ORACLE') ||
          key.startsWith('DB_')) {
        config[key] = process.env[key];
      }
    });

    return config;
  }

  private static getEnvironmentPrefix(environment: string): string {
    const envMap: { [key: string]: string } = {
      'development': 'DEV_ORACLE_',
      'dev': 'DEV_ORACLE_',
      'testing': 'TEST_ORACLE_',
      'test': 'TEST_ORACLE_',
      'production': 'PROD_ORACLE_',
      'prod': 'PROD_ORACLE_',
      'staging': 'STAGE_ORACLE_',
      'stage': 'STAGE_ORACLE_'
    };

    return envMap[environment.toLowerCase()] || 'ORACLE_';
  }

  private static getBasicTemplate(): string {
    return `# Oracle Database Configuration
# Fill in your actual database credentials

# Default/Testing Environment
ORACLE_USER=your_username
ORACLE_PASSWORD=your_password
ORACLE_CONNECT_STRING=localhost:1521/xepdb1

# Optional pool settings
ORACLE_POOL_MIN=2
ORACLE_POOL_MAX=10
ORACLE_POOL_INCREMENT=1
ORACLE_POOL_TIMEOUT=60
ORACLE_STMT_CACHE_SIZE=30

# Development Environment (optional)
DEV_ORACLE_USER=dev_username
DEV_ORACLE_PASSWORD=dev_password
DEV_ORACLE_CONNECT_STRING=localhost:1521/xepdb1

# Production Environment (optional)
PROD_ORACLE_USER=prod_username
PROD_ORACLE_PASSWORD=prod_password
PROD_ORACLE_CONNECT_STRING=proddb:1521/prodpdb
`;
  }

  /**
   * Clear cached configurations (useful for testing)
   */
  static clearCache(): void {
    this.loadedConfigs.clear();
  }
}