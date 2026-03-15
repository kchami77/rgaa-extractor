import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('DATABASE_URL not found in .env');
  process.exit(1);
}

// Extract base connection string without database name
// mysql://root@localhost:3306/rgaa_extractor
const url = new URL(dbUrl);
const dbName = url.pathname.slice(1);
url.pathname = '/';

async function main() {
  console.log(`Connecting to ${url.toString()} to create database ${dbName}...`);
  try {
    const connection = await mysql.createConnection(url.toString());
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Database \`${dbName}\` created or already exists.`);
    await connection.end();
  } catch (err) {
    console.error('Failed to create database:', err);
    process.exit(1);
  }
}

main();
