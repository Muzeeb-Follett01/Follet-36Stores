import sql from 'mssql';

/**
 * Database Helper utility for TOSCA-converted test scenarios
 * Handles MSSQL database connections and queries
 * Database type from TOSCA: DB Expert module - MSSQL
 */
export class DatabaseHelper {
  private pool: sql.ConnectionPool | null = null;

  /**
   * Parse connection string and connect to database
   * Connection string format from TOSCA API response
   * @param connectionString - Connection string from API
   */
  async connect(connectionString: string): Promise<void> {
    if (this.pool) {
      return; // Already connected
    }

    // Parse connection string to config object
    const config = this.parseConnectionString(connectionString);
    this.pool = await sql.connect(config);
  }

  /**
   * Parse MSSQL connection string to config object
   * @param connectionString - Raw connection string
   */
  private parseConnectionString(connectionString: string): sql.config {
    const params: Record<string, string> = {};
    
    connectionString.split(';').forEach((part) => {
      const [key, value] = part.split('=');
      if (key && value) {
        params[key.trim().toLowerCase()] = value.trim();
      }
    });

    return {
      server: params['server'] || params['data source'] || '',
      database: params['database'] || params['initial catalog'] || '',
      user: params['user id'] || params['uid'] || '',
      password: params['password'] || params['pwd'] || '',
      options: {
        encrypt: true,
        trustServerCertificate: true,
      },
    };
  }

  /**
   * Execute a SQL query and return results
   * Step: DB Expert module - Execute Query
   * @param connectionString - Database connection string
   * @param query - SQL query to execute
   */
  async executeQuery(connectionString: string, query: string): Promise<sql.IRecordSet<Record<string, unknown>>> {
    await this.connect(connectionString);
    
    if (!this.pool) {
      throw new Error('Database connection not established');
    }

    const result = await this.pool.request().query(query);
    return result.recordset;
  }

  /**
   * Execute a parameterized query
   * @param connectionString - Database connection string
   * @param query - SQL query with parameters (@param1, @param2, etc.)
   * @param params - Object with parameter values
   */
  async executeParameterizedQuery(
    connectionString: string,
    query: string,
    params: Record<string, unknown>
  ): Promise<sql.IRecordSet<Record<string, unknown>>> {
    await this.connect(connectionString);
    
    if (!this.pool) {
      throw new Error('Database connection not established');
    }

    const request = this.pool.request();
    
    // Add parameters to request
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });

    const result = await request.query(query);
    return result.recordset;
  }

  /**
   * Close the database connection
   */
  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.close();
      this.pool = null;
    }
  }
}
