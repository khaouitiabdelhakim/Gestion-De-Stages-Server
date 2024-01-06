const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'stage_test',
  password: 'khaouitipostgresql',
  port: 5432,
});

async function createCompetence(competenceData) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO public.competence (no_competence, description, libelle) VALUES ($1, $2, $3) RETURNING *',
      [competenceData.no_competence, competenceData.description, competenceData.libelle]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function getCompetenceById(no_competence) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM public.competence WHERE no_competence = $1', [no_competence]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function updateCompetence(no_competence, competenceData) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE public.competence SET description = $1, libelle = $2 WHERE no_competence = $3 RETURNING *',
      [competenceData.description, competenceData.libelle, no_competence]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function deleteCompetence(no_competence) {
  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM public.competence WHERE no_competence = $1 RETURNING *', [no_competence]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function getAllCompetences() {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM public.competence');
      return result.rows;
    } finally {
      client.release();
    }
  }

module.exports = {
  createCompetence,
  getCompetenceById,
  updateCompetence,
  deleteCompetence,
  getAllCompetences
};
