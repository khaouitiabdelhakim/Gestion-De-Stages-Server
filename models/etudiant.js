const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'stage',
  password: 'khaouitipostgresql',
  port: 5432,
});

async function getAllEtudiants() {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM public.etudiant');
      return result.rows;
    } finally {
      client.release();
    }
  }

// Create
async function createEtudiant(etudiantData) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO public.etudiant (nom_etudiant, prenom_etudiant, date_naissance_etudiant, sexe_etudiant, adresse_etudiant, telephone_etudiant, email_etudiant, annee_promotion, mention_etudiant) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [
        etudiantData.nom_etudiant,
        etudiantData.prenom_etudiant,
        etudiantData.date_naissance_etudiant,
        etudiantData.sexe_etudiant,
        etudiantData.adresse_etudiant,
        etudiantData.telephone_etudiant,
        etudiantData.email_etudiant,
        etudiantData.annee_promotion,
        etudiantData.mention_etudiant,
      ]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

// Read
async function getEtudiantById(no_etudiant) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM public.etudiant WHERE no_etudiant = $1', [no_etudiant]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

// Update
async function updateEtudiant(no_etudiant, etudiantData) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE public.etudiant SET nom_etudiant = $1, prenom_etudiant = $2, date_naissance_etudiant = $3, sexe_etudiant = $4, adresse_etudiant = $5, telephone_etudiant = $6, email_etudiant = $7, annee_promotion = $8, mention_etudiant = $9 WHERE no_etudiant = $10 RETURNING *',
      [
        etudiantData.nom_etudiant,
        etudiantData.prenom_etudiant,
        etudiantData.date_naissance_etudiant,
        etudiantData.sexe_etudiant,
        etudiantData.adresse_etudiant,
        etudiantData.telephone_etudiant,
        etudiantData.email_etudiant,
        etudiantData.annee_promotion,
        etudiantData.mention_etudiant,
        no_etudiant,
      ]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

// Delete
async function deleteEtudiant(no_etudiant) {
  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM public.etudiant WHERE no_etudiant = $1 RETURNING *', [no_etudiant]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

module.exports = {
  createEtudiant,
  getEtudiantById,
  updateEtudiant,
  deleteEtudiant,
  getAllEtudiants,
};
