const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'stage',
  password: 'khaouitipostgresql',
  port: 5432,
});



async function getRecentStages() {
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
    ORDER BY s.annee_de_stage DESC
    LIMIT 3
`);

      return result.rows;
  } finally {
      client.release();
  }
}


async function getTopEnterpriseByStageCount() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT ent.nom_entreprise, COUNT(s.no_stage) AS number_of_stages
      FROM public.entreprise ent
      LEFT JOIN public.stage s ON ent.no_entreprise = s.no_entreprise
      GROUP BY ent.no_entreprise
      ORDER BY number_of_stages DESC
      LIMIT 6
    `);

    return result.rows;
  } finally {
    client.release();
  }
}




module.exports = {
  getRecentStages,
  getTopEnterpriseByStageCount
};
