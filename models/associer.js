const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'stage_test',
  password: 'khaouitipostgresql',
  port: 5432,
});

async function createAssocier(associerData) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO public.associer (annee, no_type, date_debut, date_fin) VALUES ($1, $2, $3, $4) RETURNING *',
      [associerData.annee, associerData.no_type, associerData.date_debut, associerData.date_fin]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function getAssocierById(annee, no_type) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM public.associer WHERE annee = $1 AND no_type = $2', [annee, no_type]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function updateAssocier(annee, no_type, associerData) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE public.associer SET date_debut = $1, date_fin = $2 WHERE annee = $3 AND no_type = $4 RETURNING *',
      [associerData.date_debut, associerData.date_fin, annee, no_type]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function deleteAssocier(annee, no_type) {
  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM public.associer WHERE annee = $1 AND no_type = $2 RETURNING *', [annee, no_type]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

module.exports = {
  createAssocier,
  getAssocierById,
  updateAssocier,
  deleteAssocier,
};
