const { pool } = require('../pool');


async function createEncadrant(encadrantData) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO public.encadrant (nom_encadrant, prenom_encadrant, email_encadrant, telephone_encadrant) VALUES ($1, $2, $3, $4) RETURNING *',
      [encadrantData.nom_encadrant, encadrantData.prenom_encadrant, encadrantData.email_encadrant, encadrantData.telephone_encadrant]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function getEncadrantById(no_encadrant) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM public.encadrant WHERE no_encadrant = $1', [no_encadrant]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function updateEncadrant(no_encadrant, encadrantData) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE public.encadrant SET nom_encadrant = $1, prenom_encadrant = $2, email_encadrant = $3, telephone_encadrant = $4 WHERE no_encadrant = $5 RETURNING *',
      [
        encadrantData.nom_encadrant,
        encadrantData.prenom_encadrant,
        encadrantData.email_encadrant,
        encadrantData.telephone_encadrant,
        no_encadrant,
      ]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function deleteEncadrant(no_encadrant) {
  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM public.encadrant WHERE no_encadrant = $1 RETURNING *', [no_encadrant]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function getAllEncadrants() {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM public.encadrant');
      return result.rows;
    } finally {
      client.release();
    }
  }

module.exports = {
  createEncadrant,
  getEncadrantById,
  updateEncadrant,
  deleteEncadrant,
  getAllEncadrants
};
