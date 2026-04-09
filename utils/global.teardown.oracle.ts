/**
 * Oracle Database Global Teardown for Playwright
 * Clean up Oracle database connections and resources
 */

import { Oracle } from './db/oracle';

async function globalTeardown() {
  console.log('🔄 Cleaning up Oracle Database connections...');

  try {
    // Close all connection pools and connections
    await Oracle.ConnectionManager.closeAll();
    console.log('✅ Oracle Database cleanup complete');

  } catch (error) {
    console.error('❌ Oracle Database cleanup failed:', error);
    // Don't fail teardown - just log the error
  }
}

export default globalTeardown;