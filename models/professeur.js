const { pool } = require('../pool');


async function getAllProfesseurs() {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM public.professeur');
      return result.rows;
    } finally {
      client.release();
    }
  }

async function createProfesseur(professeurData) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO public.professeur (sexe_professeur, date_emauche_professeur, date_depart_professeur, prenom_professeur, date_naissance_professeur, telephone_professeur, email_professeur, nom_professeur, adresse_professeur) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [
        professeurData.sexe_professeur,
        professeurData.date_embauche_professeur,
        professeurData.date_depart_professeur,
        professeurData.prenom_professeur,
        professeurData.date_naissance_professeur,
        professeurData.telephone_professeur,
        professeurData.email_professeur,
        professeurData.nom_professeur,
        professeurData.adresse_professeur,
      ]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function getProfesseurById(no_professeur) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM public.professeur WHERE no_professeur = $1', [no_professeur]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function updateProfesseur(no_professeur, professeurData) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE public.professeur SET sexe_professeur = $1, date_emauche_professeur = $2, date_depart_professeur = $3, prenom_professeur = $4, date_naissance_professeur = $5, telephone_professeur = $6, email_professeur = $7, nom_professeur = $8, adresse_professeur = $9 WHERE no_professeur = $10 RETURNING *',
      [
        professeurData.sexe_professeur,
        professeurData.date_emauche_professeur,
        professeurData.date_depart_professeur,
        professeurData.prenom_professeur,
        professeurData.date_naissance_professeur,
        professeurData.telephone_professeur,
        professeurData.email_professeur,
        professeurData.nom_professeur,
        professeurData.adresse_professeur,
        no_professeur,
      ]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function deleteProfesseur(no_professeur) {
  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM public.professeur WHERE no_professeur = $1 RETURNING *', [no_professeur]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

module.exports = {
  createProfesseur,
  getProfesseurById,
  updateProfesseur,
  deleteProfesseur,
  getAllProfesseurs
};
