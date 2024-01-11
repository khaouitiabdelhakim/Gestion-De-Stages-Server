const { pool } = require('../pool');



async function createAnnee(anneeData) {
  const client = await pool.connect();
  try {
    const result = await client.query('INSERT INTO public.annee (annee) VALUES ($1) RETURNING *', [anneeData.annee]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function getAnneeById(annee) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM public.annee WHERE annee = $1', [annee]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function updateAnnee(oldAnnee, newAnnee) {
  const client = await pool.connect();
  try {
    const result = await client.query('UPDATE public.annee SET annee = $1 WHERE annee = $2 RETURNING *', [newAnnee, oldAnnee]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function deleteAnnee(annee) {
  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM public.annee WHERE annee = $1 RETURNING *', [annee]);
    return result.rows[0];
  } finally {
    client.release();
  }
}


async function getAllAnnees() {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM public.annee');
      return result.rows;
    } finally {
      client.release();
    }
  }

module.exports = {
  createAnnee,
  getAnneeById,
  updateAnnee,
  deleteAnnee,
  getAllAnnees
};
