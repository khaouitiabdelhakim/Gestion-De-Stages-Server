const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'stage_test',
  password: 'khaouitipostgresql',
  port: 5432,
});

async function createType(typeData) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO public.type (no_type, duree) VALUES ($1, $2) RETURNING *',
      [typeData.no_type, typeData.duree]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function getTypeById(no_type) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM public.type WHERE no_type = $1', [no_type]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function updateType(no_type, typeData) {
  const client = await pool.connect();
  try {
    const result = await client.query('UPDATE public.type SET duree = $1 WHERE no_type = $2 RETURNING *', [typeData.duree, no_type]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function deleteType(no_type) {
  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM public.type WHERE no_type = $1 RETURNING *', [no_type]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

module.exports = {
  createType,
  getTypeById,
  updateType,
  deleteType,
};
