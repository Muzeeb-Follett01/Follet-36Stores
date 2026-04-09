import * as fs from 'fs';
import * as path from 'path';

export interface MssqlEnvConfig {
  [key: string]: string | undefined;
}

export class MssqlEnvLoader {
  private static loadedConfigs: Map<string, MssqlEnvConfig> = new Map();
  private static rootPath: string = process.cwd();

  static setRootPath(rootPath: string): void {
    this.rootPath = rootPath;
  }

  static loadConfig(envFilePath?: string): MssqlEnvConfig {
    const configPath = envFilePath || this.findEnvFile();
    if (this.loadedConfigs.has(configPath)) return this.loadedConfigs.get(configPath)!;

    const config: MssqlEnvConfig = {};

    if (configPath && fs.existsSync(configPath)) {
      Object.assign(config, this.parseEnvFile(configPath));
      console.log(`✅ Loaded MSSQL configuration from: ${configPath}`);
    } else {
      console.log('ℹ️  No mssql.env file found, using environment variables only');
    }

    Object.assign(config, this.loadFromEnvironmentVariables());
    this.loadedConfigs.set(configPath, config);
    return config;
  }

  static getEnvironmentConfig(environment: string, envFilePath?: string): MssqlEnvConfig {
    const all = this.loadConfig(envFilePath);
    const prefix = this.getEnvironmentPrefix(environment);
    const envConfig: MssqlEnvConfig = {};

    Object.keys(all).forEach(key => {
      if (key.startsWith(prefix)) {
        const std = key.replace(prefix, 'MSSQL_');
        envConfig[std] = all[key];
      }
    });

    Object.keys(all).forEach(key => {
      if (key.startsWith('MSSQL_')) {
        const std = key;
        if (!envConfig[std]) envConfig[std] = all[key];
      }
    });

    return envConfig;
  }

  static validateConfig(config: MssqlEnvConfig, environment: string): boolean {
    const required = ['MSSQL_USER', 'MSSQL_PASSWORD', 'MSSQL_SERVER', 'MSSQL_DATABASE'];
    const missing = required.filter(k => !config[k] || (config[k] || '').trim() === '');

    if (missing.length > 0) {
      console.error(`❌ Missing required MSSQL configuration for '${environment}' environment:`);
      missing.forEach(m => console.error(`   - ${m}`));
      return false;
    }

    return true;
  }

  static getAvailableEnvironments(envFilePath?: string): string[] {
    const config = this.loadConfig(envFilePath);
    const envs = new Set<string>();
    Object.keys(config).forEach(k => {
      const match = k.match(/^([A-Z]+)_MSSQL_/);
      if (match) envs.add(match[1].toLowerCase());
    });
    if (Object.keys(config).some(k => k.startsWith('MSSQL_'))) envs.add('default');
    return Array.from(envs).sort();
  }

  static displayConfig(environment: string, envFilePath?: string): void {
    const cfg = this.getEnvironmentConfig(environment, envFilePath);
    console.log(`\n🔧 MSSQL Configuration for '${environment}':`);
    console.log('='.repeat(60));
    Object.keys(cfg).sort().forEach(key => {
      let value = cfg[key] || '';
      if (key.includes('PASSWORD') || key.includes('SECRET')) value = value ? '*'.repeat(8) : '(not set)';
      console.log(`   ${key.padEnd(30)} = ${value}`);
    });
    console.log('='.repeat(60));
  }

  static createSampleEnvFile(targetPath?: string): string {
    const samplePath = targetPath || path.join(this.rootPath, 'mssql.env');
    const templatePath = path.join(this.rootPath, 'mssql.env.template');
    try {
      if (fs.existsSync(templatePath)) {
        fs.copyFileSync(templatePath, samplePath);
      } else {
        const basic = this.getBasicTemplate();
        fs.writeFileSync(samplePath, basic);
      }
      console.log(`✅ Created sample mssql.env: ${samplePath}`);
      return samplePath;
    } catch (error) {
      console.error('❌ Failed to create mssql.env', error);
      throw error;
    }
  }

  private static findEnvFile(): string {
    const candidates = [
      path.join(this.rootPath, 'mssql.env'),
      path.join(this.rootPath, '.mssql.env'),
      path.join(this.rootPath, 'config', 'mssql.env')
    ];
    for (const c of candidates) if (fs.existsSync(c)) return c;
    return '';
  }

  private static parseEnvFile(filePath: string): MssqlEnvConfig {
    const cfg: MssqlEnvConfig = {};
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      for (const l of lines) {
        const t = l.trim();
        if (!t || t.startsWith('#')) continue;
        const idx = t.indexOf('=');
        if (idx > 0) {
          let key = t.substring(0, idx).trim();
          let val = t.substring(idx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          cfg[key] = val;
        }
      }
    } catch (error) {
      console.error('❌ Failed to parse mssql.env file:', filePath, error);
    }
    return cfg;
  }

  private static loadFromEnvironmentVariables(): MssqlEnvConfig {
    const cfg: MssqlEnvConfig = {};
    Object.keys(process.env).forEach(key => {
      if (key.includes('MSSQL') || key.startsWith('DEV_MSSQL') || key.startsWith('TEST_MSSQL') || key.startsWith('PROD_MSSQL') || key.startsWith('DB_')) {
        cfg[key] = process.env[key];
      }
    });
    return cfg;
  }

  private static getEnvironmentPrefix(environment: string): string {
    const map: { [k: string]: string } = {
      development: 'DEV_MSSQL_',
      dev: 'DEV_MSSQL_',
      testing: 'TEST_MSSQL_',
      test: 'TEST_MSSQL_',
      production: 'PROD_MSSQL_',
      prod: 'PROD_MSSQL_'
    };
    return map[environment.toLowerCase()] || 'MSSQL_';
  }

  private static getBasicTemplate(): string {
    return `# MSSQL Database Configuration\nMSSQL_USER=your_user\nMSSQL_PASSWORD=your_password\nMSSQL_SERVER=localhost\nMSSQL_DATABASE=your_db\nMSSQL_PORT=1433\nMSSQL_POOL_MIN=0\nMSSQL_POOL_MAX=10\nMSSQL_ENCRYPT=false\nMSSQL_TRUST_SERVER_CERT=true\n`;
  }

  static clearCache(): void { this.loadedConfigs.clear(); }
}
