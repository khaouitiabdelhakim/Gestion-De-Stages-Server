const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'stage_test',
  password: 'khaouitipostgresql',
  port: 5432,
});

async function createPromotion(promotionData) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO public.promotion (annee_promotion, nb_inscrits, nb_recus, no_professeur) VALUES ($1, $2, $3, $4) RETURNING *',
      [promotionData.annee_promotion, promotionData.nb_inscrits, promotionData.nb_recus, promotionData.no_professeur]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function getPromotionById(annee_promotion) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM public.promotion WHERE annee_promotion = $1', [annee_promotion]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function updatePromotion(annee_promotion, promotionData) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE public.promotion SET nb_inscrits = $1, nb_recus = $2, no_professeur = $3 WHERE annee_promotion = $4 RETURNING *',
      [promotionData.nb_inscrits, promotionData.nb_recus, promotionData.no_professeur, annee_promotion]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function deletePromotion(annee_promotion) {
  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM public.promotion WHERE annee_promotion = $1 RETURNING *', [annee_promotion]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

module.exports = {
  createPromotion,
  getPromotionById,
  updatePromotion,
  deletePromotion,
};
