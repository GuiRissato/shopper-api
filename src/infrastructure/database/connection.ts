
import { Pool } from 'pg';

const dbConnection = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default dbConnection;
