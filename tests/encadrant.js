const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'stage',
  password: 'khaouitipostgresql',
  port: 5432,
});

// Data for 15 encadrants
const encadrantsData = [

     {
       "nom_encadrant": "Abdou",
       "prenom_encadrant": "Hassan",
       "email_encadrant": "hassan.abdou@example.com",
       "telephone_encadrant": "06 12 34 56 78"
    }
    
    , {
       "nom_encadrant": "El Amrani",
       "prenom_encadrant": "Nora",
       "email_encadrant": "nora.elamrani@example.com",
       "telephone_encadrant": "07 23 45 67 89"
    }
    
    , {
       "nom_encadrant": "Belhaj",
       "prenom_encadrant": "Youssef",
       "email_encadrant": "youssef.belhaj@example.com",
       "telephone_encadrant": "06 34 56 78 90"
    }
    
    , {
       "nom_encadrant": "Ouazzani",
       "prenom_encadrant": "Fatima",
       "email_encadrant": "fatima.ouazzani@example.com",
       "telephone_encadrant": "07 45 67 89 01"
    }
    
    , {
       "nom_encadrant": "El Hajjaji",
       "prenom_encadrant": "Ahmed",
       "email_encadrant": "ahmed.elhajjaji@example.com",
       "telephone_encadrant": "06 56 78 90 12"
    }
    
    , {
       "nom_encadrant": "Bouazza",
       "prenom_encadrant": "Amina",
       "email_encadrant": "amina.bouazza@example.com",
       "telephone_encadrant": "07 67 89 01 23"
    }
    
    , {
       "nom_encadrant": "Cherkaoui",
       "prenom_encadrant": "Samira",
       "email_encadrant": "samira.cherkaoui@example.com",
       "telephone_encadrant": "06 78 90 12 34"
    }
    
    , {
       "nom_encadrant": "Fassi",
       "prenom_encadrant": "Karim",
       "email_encadrant": "karim.fassi@example.com",
       "telephone_encadrant": "07 89 01 23 45"
    }
    
    , {
       "nom_encadrant": "Lamrani",
       "prenom_encadrant": "Lina",
       "email_encadrant": "lina.lamrani@example.com",
       "telephone_encadrant": "06 90 12 34 56"
    }
    
    , {
        "nom_encadrant": "Tazi",
        "prenom_encadrant": "Sofiane",
        "email_encadrant": "sofiane.tazi@example.com",
        "telephone_encadrant": "07 01 23 45 67"
    }
    
    , {
        "nom_encadrant": "Mahjoub",
        "prenom_encadrant": "Yasmine",
        "email_encadrant": "yasmine.mahjoub@example.com",
        "telephone_encadrant": "06 12 34 56 78"
    }
    
    , {
        "nom_encadrant": "Bennani",
        "prenom_encadrant": "Karima",
        "email_encadrant": "karima.bennani@example.com",
        "telephone_encadrant": "07 23 45 67 89"
    }
    
    , {
        "nom_encadrant": "Ouakili",
        "prenom_encadrant": "Omar",
        "email_encadrant": "omar.ouakili@example.com",
        "telephone_encadrant": "06 34 56 78 90"
    }
    
    ,{
        "nom_encadrant": "Zouini",
        "prenom_encadrant": "Leïla",
        "email_encadrant": "leila.zouini@example.com",
        "telephone_encadrant": "07 45 67 89 01"
    } ,
    
     {
        "nom_encadrant": "Berrada",
        "prenom_encadrant": "Khalid",
        "email_encadrant": "khalid.berrada@example.com",
        "telephone_encadrant": "06 56 78 90 12"
    }
];

async function saveEncadrants() {
  const client = await pool.connect();
  try {
    // Loop through the encadrantsData and insert each record into the encadrant table
    for (const encadrant of encadrantsData) {
      const result = await client.query(
        `INSERT INTO public.encadrant (nom_encadrant, prenom_encadrant, email_encadrant, telephone_encadrant) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [
          encadrant.nom_encadrant,
          encadrant.prenom_encadrant,
          encadrant.email_encadrant,
          encadrant.telephone_encadrant,
        ]
      );
      console.log('Encadrant inserted:', result.rows[0]);
    }
  } finally {
    client.release();
  }
}

// Call the function to save encadrants
saveEncadrants()
  .then(() => console.log('Encadrants saved successfully!'))
  .catch((error) => console.error('Error saving encadrants:', error))
  .finally(() => pool.end()); // Make sure to close the connection pool when done
