import pool from './connection';

async function createTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      customer_code VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS water_consumption (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      image_url VARCHAR(100),
      measure_value INTEGER NOT NULL,
      has_confirmed BOOLEAN,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS gas_consumption (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      image_url VARCHAR(100),
      measure_value INTEGER NOT NULL,
      has_confirmed BOOLEAN,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

export default createTables;
