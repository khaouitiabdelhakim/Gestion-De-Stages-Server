const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'stage',
  password: 'khaouitipostgresql',
  port: 5432,
});

async function createStage(stageData) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO public.stage (appreciation_stage, annee_de_stage, no_etudiant, no_professeur, no_encadrant, no_type, no_entreprise) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [
        stageData.appreciation_stage,
        stageData.annee_de_stage,
        stageData.no_etudiant,
        stageData.no_professeur,
        stageData.no_encadrant,
        stageData.no_type,
        stageData.no_entreprise,
      ]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function getStageById(no_stage) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM public.stage WHERE no_stage = $1', [no_stage]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function updateStage(no_stage, stageData) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE public.stage SET appreciation_stage = $1, annee_de_stage = $2, no_etudiant = $3, no_professeur = $4, no_encadrant = $5, no_type = $6, no_entreprise = $7 WHERE no_stage = $8 RETURNING *',
      [
        stageData.appreciation_stage,
        stageData.annee_de_stage,
        stageData.no_etudiant,
        stageData.no_professeur,
        stageData.no_encadrant,
        stageData.no_type,
        stageData.no_entreprise,
        no_stage,
      ]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function deleteStage(no_stage) {
  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM public.stage WHERE no_stage = $1 RETURNING *', [no_stage]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function getAllStages() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
    SELECT s.*, e.nom_etudiant, e.prenom_etudiant,
           p.nom_professeur, p.prenom_professeur,
           en.nom_encadrant, en.prenom_encadrant,
           ent.nom_entreprise
    FROM public.stage s
    LEFT JOIN public.etudiant e ON s.no_etudiant = e.no_etudiant
    LEFT JOIN public.professeur p ON s.no_professeur = p.no_professeur
    LEFT JOIN public.encadrant en ON s.no_encadrant = en.no_encadrant
    LEFT JOIN public.entreprise ent ON s.no_entreprise = ent.no_entreprise
`);

      return result.rows;
  } finally {
      client.release();
  }
}

module.exports = {
  createStage,
  getStageById,
  updateStage,
  deleteStage,
  getAllStages
};
