/**
 * Oracle Database Global Setup for Playwright
 * Initialize Oracle database connections and configurations
 */

import { Oracle } from './db/oracle';

async function globalSetup() {
  console.log('🔄 Initializing Oracle Database for testing...');

  try {
    // Initialize Oracle testing from oracle.env file or environment variables
    // Priority: oracle.env file -> environment variables -> defaults
    console.log('📋 Loading Oracle configuration...');
    
    // Display available environments for debugging
    const availableEnvs = Oracle.getAvailableEnvironments();
    console.log(`Available environments: ${availableEnvs.join(', ')}`);
    
    // Display current configuration (without sensitive data)
    Oracle.displayConfig('testing');
    
    // Initialize Oracle testing
    const dbFixture = await Oracle.setupFromEnv('testing');
    
    console.log('✅ Oracle Database initialized successfully');
    
    // Optional: Verify critical tables exist
    const criticalTables = ['users', 'orders', 'products']; // Add your tables
    for (const table of criticalTables) {
      try {
        const exists = await dbFixture.tableExists(table);
        if (exists) {
          console.log(`✅ Table '${table}' verified`);
        } else {
          console.warn(`⚠️  Table '${table}' does not exist`);
        }
      } catch (error) {
        console.warn(`⚠️  Could not verify table '${table}':`, error);
      }
    }

    // Optional: Run any setup queries
    try {
      // Example: Create test-specific tables or data
      // await dbFixture.execute(`
      //   CREATE TABLE IF NOT EXISTS test_sessions (
      //     id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      //     session_id VARCHAR2(100) UNIQUE,
      //     created_date DATE DEFAULT SYSDATE
      //   )
      // `);
    } catch (error) {
      console.warn('⚠️  Setup queries failed:', error);
    }

    await dbFixture.cleanup();
    console.log('✅ Oracle Database setup complete');

  } catch (error) {
    console.error('❌ Oracle Database setup failed:', error);
    console.error('💡 Please check:');
    console.error('   1. Oracle Instant Client is installed');
    console.error('   2. oracle.env file exists with valid credentials, OR');
    console.error('   3. Environment variables are set: ORACLE_USER, ORACLE_PASSWORD, ORACLE_CONNECT_STRING');
    console.error('   4. Database is accessible and running');
    console.error('   5. User has necessary permissions');
    console.error('\n🔧 Quick fixes:');
    console.error('   - Run Oracle.createSampleEnvFile() to create oracle.env template');
    console.error('   - Run Oracle.displayConfig("testing") to debug configuration');
    
    // Don't fail the entire test suite if DB is not available
    // throw error; // Uncomment to fail tests if DB setup fails
  }
}

export default globalSetup;