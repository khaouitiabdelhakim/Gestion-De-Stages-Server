const { Pool } = require('pg');

// Replace these values with your PostgreSQL connection details
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'stage',
  password: 'khaouitipostgresql',
  port: 5432, // Your PostgreSQL port
});

async function createTables() {
  const client = await pool.connect();

  try {
    // Create tables
    await client.query(`
    
    CREATE TABLE public."user" (
        id SERIAL NOT NULL,
        username VARCHAR(250),
        password VARCHAR(250),
        email VARCHAR(250),
        nom VARCHAR(250),
        prenom VARCHAR(250),
        telephone VARCHAR(15), -- Assuming a standard phone number format
        CONSTRAINT user_PK PRIMARY KEY (id)
    ) WITHOUT OIDS;
    

    
    
    `);

    console.log('Tables created successfully');
  } finally {
    client.release();
  }
}

// Execute the function
createTables()
  .then(() => process.exit())
  .catch((err) => {
    console.error('Error creating tables:', err);
    process.exit(1);
  });





