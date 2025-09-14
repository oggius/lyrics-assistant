import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from './connection';

async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...');
    
    await migrate(db, {
      migrationsFolder: './src/database/migrations',
    });
    
    console.log('✅ Database migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    process.exit(1);
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

export { runMigrations };