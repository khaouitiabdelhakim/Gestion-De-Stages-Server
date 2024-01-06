const { Pool } = require('pg');

// Replace these values with your PostgreSQL connection details
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'stage_test',
  password: 'khaouitipostgresql',
  port: 5432, // Your PostgreSQL port
});

async function createTables() {
  const client = await pool.connect();

  try {
    // Create tables
    await client.query(`
    ------------------------------------------------------------
    --        Script Postgre 
    ------------------------------------------------------------
    
    
    
    ------------------------------------------------------------
    -- Table: ETUDIANT
    ------------------------------------------------------------
    CREATE TABLE public.etudiant(
        no_etudiant               SERIAL NOT NULL ,
        nom_etudiant              VARCHAR (250)  ,
        prenom_etudiant           VARCHAR (250)  ,
        date_naissance_etudiant   DATE   ,
        sexe_etudiant             BOOL   ,
        adresse_etudiant          VARCHAR (250)  ,
        telephone_etudiant        VARCHAR (20)  ,
        email_etudiant            VARCHAR (20)  ,
        annee_promotion           INTEGER   ,
        mention_etudiant          VARCHAR (2000)  ,
        CONSTRAINT etudiant_PK PRIMARY KEY (no_etudiant)
    )WITHOUT OIDS;
    
    
    ------------------------------------------------------------
    -- Table: professeur
    ------------------------------------------------------------
    CREATE TABLE public.professeur(
        no_professeur               SERIAL NOT NULL ,
        sexe_professeur             BOOL   ,
        date_emauche_professeur     DATE   ,
        date_depart_professeur      DATE   ,
        prenom_professeur           VARCHAR (250) NOT NULL ,
        date_naissance_professeur   DATE   ,
        telephone_professeur        VARCHAR (250) ,
        email_professeur            VARCHAR (250)  ,
        nom_professeur              VARCHAR (250) NOT NULL ,
        adresse_professeur          VARCHAR (250)   ,
        CONSTRAINT professeur_PK PRIMARY KEY (no_professeur)
    )WITHOUT OIDS;
    
    
    ------------------------------------------------------------
    -- Table: encadrant
    ------------------------------------------------------------
    CREATE TABLE public.encadrant(
        no_encadrant          SERIAL NOT NULL ,
        nom_encadrant         VARCHAR (250) NOT NULL ,
        prenom_encadrant      VARCHAR (250) NOT NULL ,
        email_encadrant       VARCHAR (250)  ,
        telephone_encadrant   VARCHAR (250)   ,
        CONSTRAINT encadrant_PK PRIMARY KEY (no_encadrant)
    )WITHOUT OIDS;
    
    
    ------------------------------------------------------------
    -- Table: entreprise
    ------------------------------------------------------------
    CREATE TABLE public.entreprise(
        no_entreprise                  SERIAL NOT NULL ,
        nom_entreprise                 VARCHAR (50)  ,
        forme_juridique                VARCHAR (50) ,
        telephone_contact_entreprise   VARCHAR (50) NOT NULL ,
        adresse_entreprise             VARCHAR (250)  ,
        telephone_entreprise           VARCHAR (50)  ,
        fax_entreprise                 VARCHAR (50)  ,
        contact_entreprise             VARCHAR (50)  ,
        CONSTRAINT entreprise_PK PRIMARY KEY (no_entreprise)
    )WITHOUT OIDS;
    
    
    ------------------------------------------------------------
    -- Table: Type
    ------------------------------------------------------------
    CREATE TABLE public.Type(
        no_type   INTEGER  NOT NULL ,
        duree     INTEGER   ,
        CONSTRAINT Type_PK PRIMARY KEY (no_type)
    )WITHOUT OIDS;
    
    
    ------------------------------------------------------------
    -- Table: stage
    ------------------------------------------------------------
    CREATE TABLE public.stage(
        no_stage             SERIAL NOT NULL ,
        appreciation_stage   VARCHAR (2000) ,
        annee_de_stage       DATE ,
        no_etudiant          SERIAL NOT NULL ,  -- Change this line
        no_professeur        INT  NOT NULL ,
        no_encadrant         INT  NOT NULL ,
        no_type              INTEGER  NOT NULL ,
        no_entreprise        INT  NOT NULL  ,
        CONSTRAINT stage_PK PRIMARY KEY (no_stage),
        CONSTRAINT stage_etudiant_FK FOREIGN KEY (no_etudiant) REFERENCES public.etudiant(no_etudiant),
        CONSTRAINT stage_professeur0_FK FOREIGN KEY (no_professeur) REFERENCES public.professeur(no_professeur),
        CONSTRAINT stage_encadrant1_FK FOREIGN KEY (no_encadrant) REFERENCES public.encadrant(no_encadrant),
        CONSTRAINT stage_Type2_FK FOREIGN KEY (no_type) REFERENCES public.Type(no_type),
        CONSTRAINT stage_entreprise3_FK FOREIGN KEY (no_entreprise) REFERENCES public.entreprise(no_entreprise)
    )WITHOUT OIDS;
    
    
    ------------------------------------------------------------
    -- Table: annee
    ------------------------------------------------------------
    CREATE TABLE public.annee(
        annee   INTEGER  NOT NULL  ,
        CONSTRAINT annee_PK PRIMARY KEY (annee)
    )WITHOUT OIDS;
    
    
    ------------------------------------------------------------
    -- Table: competence
    ------------------------------------------------------------
    CREATE TABLE public.competence(
        no_competence   VARCHAR (250) NOT NULL ,
        description     VARCHAR (2000)  ,
        libelle         VARCHAR (2000)  NOT NULL  ,
        CONSTRAINT competence_PK PRIMARY KEY (no_competence)
    )WITHOUT OIDS;
    
    
    ------------------------------------------------------------
    -- Table: promotion
    ------------------------------------------------------------
    CREATE TABLE public.promotion(
        annee_promotion   INTEGER  NOT NULL ,
        nb_inscrits       INTEGER  ,
        nb_recus          INTEGER  ,
        no_professeur     INT   ,
        CONSTRAINT promotion_PK PRIMARY KEY (annee_promotion)
    
        ,CONSTRAINT promotion_professeur_FK FOREIGN KEY (no_professeur) REFERENCES public.professeur(no_professeur)
    )WITHOUT OIDS;
    
    
    ------------------------------------------------------------
    -- Table: exiger
    ------------------------------------------------------------
    CREATE TABLE public.exiger(
        no_type         INTEGER  NOT NULL ,
        no_competence   VARCHAR (250) NOT NULL ,
        niveau_exige    INTEGER   ,
        CONSTRAINT exiger_PK PRIMARY KEY (no_type,no_competence)
    
        ,CONSTRAINT exiger_Type_FK FOREIGN KEY (no_type) REFERENCES public.Type(no_type)
        ,CONSTRAINT exiger_competence0_FK FOREIGN KEY (no_competence) REFERENCES public.competence(no_competence)
    )WITHOUT OIDS;
    
    
    ------------------------------------------------------------
    -- Table: associer
    ------------------------------------------------------------
    CREATE TABLE public.associer(
        annee        INTEGER  NOT NULL ,
        no_type      INTEGER  NOT NULL ,
        date_debut   DATE   ,
        date_fin     DATE   ,
        CONSTRAINT associer_PK PRIMARY KEY (annee,no_type)
    );
    
    `);

    console.log('Tables created successfully');
  } finally {
    client.release();
  }
}

// Execute the function
createTables()
  .then(() => process.exit())
  .catch((err) => {
    console.error('Error creating tables:', err);
    process.exit(1);
  });
