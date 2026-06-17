const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('Error: DATABASE_URL environment variable is not defined.');
    process.exit(1);
  }

  console.log('Connecting to PostgreSQL database...');
  const client = new Client({
    connectionString,
    ssl: connectionString.includes('sslmode=') || connectionString.includes('localhost') ? false : {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Successfully connected to database.');

    const schemaPath = path.join(__dirname, '../../database/schemas/001_init_all_domain_schemas.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at path: ${schemaPath}`);
    }

    console.log(`Reading schema definitions from: ${schemaPath}`);
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing database schema initialization SQL...');
    await client.query(sql);

    console.log('Database initialization completed successfully! All schemas, tables, and constraints are provisioned.');
  } catch (err) {
    console.error('Migration failed with error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
}

runMigration().catch(err => {
  console.error('Unhandled migration error:', err);
  process.exit(1);
});
