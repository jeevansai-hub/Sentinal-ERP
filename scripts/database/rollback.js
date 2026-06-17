const { Client } = require('pg');

async function runRollback() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('Error: DATABASE_URL environment variable is not defined.');
    process.exit(1);
  }

  console.log('Connecting to PostgreSQL database for rollback...');
  const client = new Client({
    connectionString,
    ssl: connectionString.includes('sslmode=') || connectionString.includes('localhost') ? false : {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Successfully connected to database.');

    const sql = `
      DROP SCHEMA IF EXISTS hr, finance, crm, procurement, inventory, workflows, analytics, agents, observability CASCADE;
    `;

    console.log('Executing database schema rollback...');
    await client.query(sql);

    console.log('Database rollback completed successfully! All schemas and tables have been dropped.');
  } catch (err) {
    console.error('Rollback failed with error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
}

runRollback().catch(err => {
  console.error('Unhandled rollback error:', err);
  process.exit(1);
});
