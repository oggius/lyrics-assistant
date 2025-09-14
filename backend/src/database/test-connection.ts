import { db } from './connection';
import { songs } from './schema';

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection by querying the songs table
    const result = await db.select().from(songs).limit(1);
    console.log('✅ Database connection successful!');
    console.log(`📊 Found ${result.length} songs in database`);
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testConnection().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

export { testConnection };