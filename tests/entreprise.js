const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'stage',
  password: 'khaouitipostgresql',
  port: 5432,
});

// Data for 10 Moroccan commerce enterprises
const entreprisesData = [
    [
        {
          "nom_entreprise": "Maroc Telecom",
          "forme_juridique": "SA",
          "telephone_contact_entreprise": "980 000 000",
          "adresse_entreprise": "Avenue Hassan II, Casablanca",
          "telephone_entreprise": "05 22 22 22 22",
          "fax_entreprise": "05 22 22 22 23",
          "contact_entreprise": "Mohamed"
        },
        {
          "nom_entreprise": "Intelcia Maroc",
          "forme_juridique": "SA",
          "telephone_contact_entreprise": "05 22 22 22 24",
          "adresse_entreprise": "Rue Mohamed V, Rabat",
          "telephone_entreprise": "05 37 37 37 37",
          "fax_entreprise": "05 37 37 37 38",
          "contact_entreprise": "Salma"
        },
        {
          "nom_entreprise": "Kerix",
          "forme_juridique": "SARL",
          "telephone_contact_entreprise": "06 11 22 33 45",
          "adresse_entreprise": "Avenue Hassan II, Fès",
          "telephone_entreprise": "05 56 56 56 56",
          "fax_entreprise": "05 56 56 56 57",
          "contact_entreprise": "Abdellatif"
        },
        {
          "nom_entreprise": "DS Industrie",
          "forme_juridique": "SARL",
          "telephone_contact_entreprise": "06 11 22 33 46",
          "adresse_entreprise": "Avenue Mohamed V, Marrakech",
          "telephone_entreprise": "05 24 24 24 24",
          "fax_entreprise": "05 24 24 24 25",
          "contact_entreprise": "Fatima"
        },
        {
          "nom_entreprise": "SAIDE VTC",
          "forme_juridique": "SARL",
          "telephone_contact_entreprise": "06 11 22 33 47",
          "adresse_entreprise": "Avenue Hassan II, Tanger",
          "telephone_entreprise": "05 39 39 39 39",
          "fax_entreprise": "05 39 39 39 40",
          "contact_entreprise": "Ali"
        },
        {
          "nom_entreprise": "Mazars Maroc",
          "forme_juridique": "SA",
          "telephone_contact_entreprise": "05 22 22 22 26",
          "adresse_entreprise": "Rue Mohamed V, Meknès",
          "telephone_entreprise": "05 55 55 55 55",
          "fax_entreprise": "05 55 55 55 56",
          "contact_entreprise": "Souad"
        },
        {
          "nom_entreprise": "Cegos Maroc",
          "forme_juridique": "SA",
          "telephone_contact_entreprise": "05 22 22 22 27",
          "adresse_entreprise": "Avenue Mohamed V, Oujda",
          "telephone_entreprise": "05 35 35 35 35",
          "fax_entreprise": "05 35 35 35 36",
          "contact_entreprise": "Omar"
        },
        {
          "nom_entreprise": "IBM Maroc",
          "forme_juridique": "SA",
          "telephone_contact_entreprise": "05 22 22 22 28",
          "adresse_entreprise": "Avenue Mohamed V, Agadir",
          "telephone_entreprise": "05 28 28 28 28",
          "fax_entreprise": "05 28 28 28 29",
          "contact_entreprise": "Karim"
        }
      ]
      
];





