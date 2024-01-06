const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'stage_test',
  password: 'khaouitipostgresql',
  port: 5432,
});

async function createExiger(exigerData) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO public.exiger (no_type, no_competence, niveau_exige) VALUES ($1, $2, $3) RETURNING *',
      [exigerData.no_type, exigerData.no_competence, exigerData.niveau_exige]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function getExigerById(no_type, no_competence) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM public.exiger WHERE no_type = $1 AND no_competence = $2', [no_type, no_competence]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function updateExiger(no_type, no_competence, exigerData) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE public.exiger SET niveau_exige = $1 WHERE no_type = $2 AND no_competence = $3 RETURNING *',
      [exigerData.niveau_exige, no_type, no_competence]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function deleteExiger(no_type, no_competence) {
  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM public.exiger WHERE no_type = $1 AND no_competence = $2 RETURNING *', [no_type, no_competence]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

module.exports = {
  createExiger,
  getExigerById,
  updateExiger,
  deleteExiger,
};
