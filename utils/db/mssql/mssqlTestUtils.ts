import { test as base, expect } from '@playwright/test';
import { MssqlQueryExecutor } from './mssqlQueryExecutor';
import { MssqlTestDataManager } from './mssqlTestDataManager';

export const test = base.extend<{
  mssqlDb: MssqlDbFixture;
  mssqlTestData: MssqlTestDataManager;
  mssqlQuery: MssqlQueryExecutor;
}>({
  mssqlDb: async ({}, use) => {
    const fixture = new MssqlDbFixture();
    await use(fixture);
    await fixture.cleanup();
  },
  mssqlTestData: async ({}, use) => {
    const manager = new MssqlTestDataManager();
    await use(manager);
    await manager.cleanup();
  },
  mssqlQuery: async ({}, use) => {
    const q = new MssqlQueryExecutor();
    await use(q);
  }
});

export { expect };

export class MssqlDbFixture {
  private executor: MssqlQueryExecutor;
  private testDataManager: MssqlTestDataManager;
  private environment: string;

  constructor(environment: string = 'testing') {
    this.environment = environment;
    this.executor = new MssqlQueryExecutor(environment);
    this.testDataManager = new MssqlTestDataManager(environment);
  }

  async setupEnvironment(config?: { user: string; password: string; server: string; database: string; }) {
    // optionally register environment via MssqlConfig externally
    const ok = await (await import('./mssqlConnectionManager')).MssqlConnectionManager.healthCheck(this.environment);
    if (!ok) throw new Error(`MSSQL health check failed for ${this.environment}`);
  }

  async query<T = any>(sql: string, inputs?: Record<string, any>): Promise<T[]> {
    const r = await this.executor.select<T>(sql, { inputs });
    if (!r.success) throw new Error(`Query failed: ${r.error}`);
    return r.rows;
  }

  async execute(sql: string, inputs?: Record<string, any>): Promise<number> {
    const r = await this.executor.execute(sql, { inputs });
    if (!r.success) throw new Error(`Execute failed: ${r.error}`);
    return r.rowsAffected || 0;
  }

  async setupData(setups: any[]) { await this.testDataManager.setupTestData(setups); }
  async validateData(validations: any[]) { await this.testDataManager.validateTestData(validations); }
  async cleanupData(tables?: string[]) { await this.testDataManager.cleanupTestData(tables); }
  async createSnapshot(tables: string[]) { return await this.testDataManager.createSnapshot(tables); }
  async restoreSnapshot(_: any) { throw new Error('Restore snapshot not implemented'); }
  async getRowCount(tableName: string, where?: string) { return await this.executor.getRowCount(tableName, where); }
  async tableExists(tableName: string, schema?: string) { return await this.executor.tableExists(tableName, schema); }
  async cleanup() { await this.testDataManager.cleanup(); }
}
