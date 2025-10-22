/**
 * Database Migration Runner
 * 
 * This script runs database migrations to set up the initial schema
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/phish_prod'
  });

  try {
    console.log('Connecting to database...');
    await pool.query('SELECT NOW()');
    console.log('Database connection successful');

    // Read and execute init.sql
    const initSqlPath = path.join(__dirname, '..', 'sql', 'init.sql');
    const initSql = fs.readFileSync(initSqlPath, 'utf8');

    console.log('Running database migrations...');
    await pool.query(initSql);
    console.log('Database migrations completed successfully');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();
