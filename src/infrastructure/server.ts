import pool from './database/connection';
import createTables from './database/migrations';
import app from './http/routes';

async function startServer() {
  try {
    await pool.connect().then(()=>{
      console.log('Connected to database');
    }).catch((error)=>{
      console.log('Error connecting to database', error.message);
    })
    await createTables().then(()=>{
      console.log('Database created');
      console.log('Done Migrations');
      
    }).catch((error)=>{
      console.error('error creating tables', error.message);
      
    })
    
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  } catch (error) {
    console.error('Error during startup:', error);
  }
}

startServer();
