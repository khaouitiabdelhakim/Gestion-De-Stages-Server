const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'stage_test',
  password: 'khaouitipostgresql',
  port: 5432,
});

async function createEntreprise(entrepriseData) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO public.entreprise (nom_entreprise, forme_juridique, telephone_contact_entreprise, adresse_entreprise, telephone_entreprise, fax_entreprise, contact_entreprise) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [
        entrepriseData.nom_entreprise,
        entrepriseData.forme_juridique,
        entrepriseData.telephone_contact_entreprise,
        entrepriseData.adresse_entreprise,
        entrepriseData.telephone_entreprise,
        entrepriseData.fax_entreprise,
        entrepriseData.contact_entreprise,
      ]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function getEntrepriseById(no_entreprise) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM public.entreprise WHERE no_entreprise = $1', [no_entreprise]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function updateEntreprise(no_entreprise, entrepriseData) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE public.entreprise SET nom_entreprise = $1, forme_juridique = $2, telephone_contact_entreprise = $3, adresse_entreprise = $4, telephone_entreprise = $5, fax_entreprise = $6, contact_entreprise = $7 WHERE no_entreprise = $8 RETURNING *',
      [
        entrepriseData.nom_entreprise,
        entrepriseData.forme_juridique,
        entrepriseData.telephone_contact_entreprise,
        entrepriseData.adresse_entreprise,
        entrepriseData.telephone_entreprise,
        entrepriseData.fax_entreprise,
        entrepriseData.contact_entreprise,
        no_entreprise,
      ]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function deleteEntreprise(no_entreprise) {
  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM public.entreprise WHERE no_entreprise = $1 RETURNING *', [no_entreprise]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function getAllEntreprises() {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM public.entreprise');
      return result.rows;
    } finally {
      client.release();
    }
  }

module.exports = {
  createEntreprise,
  getEntrepriseById,
  updateEntreprise,
  deleteEntreprise,
  getAllEntreprises
};
