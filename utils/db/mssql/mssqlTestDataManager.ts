import { MssqlQueryExecutor, QueryResult } from './mssqlQueryExecutor';

nexport interface TestDataSetup {
  tableName: string;
  data: Record<string, any>[];
  cleanupAfter?: boolean;
  preserveExisting?: boolean;
}

nexport interface TestDataValidation {
  tableName: string;
  conditions: Record<string, any>;
  expectedCount?: number;
  expectedData?: Record<string, any>;
}

nexport class MssqlTestDataManager {
  private executor: MssqlQueryExecutor;
  private createdRecords: Map<string, any[]> = new Map();

n  constructor(environment: string = 'testing') {
    this.executor = new MssqlQueryExecutor(environment);
  }

  async setupTestData(setups: TestDataSetup[]): Promise<{ success: boolean; results: QueryResult[]; errors: string[] }> {
    const results: QueryResult[] = [];
    const errors: string[] = [];
    let success = true;

    for (const s of setups) {
      try {
        const res = await this.setupTableData(s);
        results.push(res);
        if (!res.success) { success = false; errors.push(res.error || 'unknown'); }
      } catch (error) {
        success = false; errors.push(String(error));
      }
    }

    return { success, results, errors };
  }

  private async setupTableData(setup: TestDataSetup): Promise<QueryResult> {
    const { tableName, data, cleanupAfter = true, preserveExisting = false } = setup;
    if (!preserveExisting) await this.executor.execute(`DELETE FROM ${tableName}`);

    const insertResults: QueryResult[] = [];
    const created: any[] = [];

    for (const record of data) {
      const columns = Object.keys(record);
      const values = columns.map((_, i) => `@p${i}`);
      const sql = `INSERT INTO ${tableName} (${columns.join(',')}) VALUES (${values.join(',')})`;
      const inputs: Record<string, any> = {};
      columns.forEach((c, i) => inputs[`p${i}`] = record[c]);
      const res = await this.executor.execute(sql, { inputs });
      insertResults.push(res);
      if (res.success) created.push(record);
    }

    if (cleanupAfter && created.length > 0) this.createdRecords.set(tableName, created);

    const totalRows = insertResults.reduce((s, r) => s + (r.rowsAffected || 0), 0);
    const allSuccess = insertResults.every(r => r.success);
    const errors = insertResults.filter(r => !r.success).map(r => r.error).join('; ');

    return { rows: [], rowsAffected: totalRows, queryExecutionTime: insertResults.reduce((s,r)=>s+(r.queryExecutionTime||0),0), success: allSuccess, error: errors || undefined };
  }

  async cleanupTestData(tableNames?: string[]): Promise<void> {
    const tables = tableNames || Array.from(this.createdRecords.keys());
    for (const table of tables) {
      const records = this.createdRecords.get(table);
      if (records && records.length > 0) {
        // Attempt delete by primary key id if present, otherwise delete all
        const ids = records.map(r => r.id).filter(Boolean);
        if (ids.length > 0) {
          const params = ids.map((_,i) => `@id${i}`).join(',');
          await this.executor.execute(`DELETE FROM ${table} WHERE id IN (${params})`, { inputs: Object.fromEntries(ids.map((v,i)=>[`id${i}`, v])) });
        } else {
          await this.executor.execute(`DELETE FROM ${table}`);
        }
      } else {
        await this.executor.execute(`DELETE FROM ${table}`);
      }
      this.createdRecords.delete(table);
    }
  }

  async validateTestData(validations: TestDataValidation[]): Promise<{ success: boolean; results: any[]; errors: string[] }> {
    const results: any[] = []; const errors: string[] = []; let success = true;
    for (const v of validations) {
      try {
        const where = Object.keys(v.conditions).map(k=>`${k}=@${k}`).join(' AND ');
        const sql = `SELECT * FROM ${v.tableName} WHERE ${where}`;
        const res = await this.executor.select(sql, { inputs: v.conditions });
        if (!res.success) { success = false; errors.push(res.error || ''); }
        else {
          const count = res.rows.length;
          if (v.expectedCount !== undefined && count !== v.expectedCount) { success = false; errors.push(`${v.tableName} expected ${v.expectedCount} got ${count}`); }
        }
        results.push(res);
      } catch (error) { success = false; errors.push(String(error)); }
    }
    return { success, results, errors };
  }

  async createSnapshot(tables: string[]): Promise<Record<string, any[]>> {
    const snap: Record<string, any[]> = {};
    for (const t of tables) {
      const res = await this.executor.select(`SELECT * FROM ${t}`);
      snap[t] = res.success ? res.rows : [];
    }
    return snap;
  }

  async cleanup(): Promise<void> { await this.cleanupTestData(); this.createdRecords.clear(); }
}
