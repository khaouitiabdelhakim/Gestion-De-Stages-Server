const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds for password hashing


const etudiantModel = require('./models/etudiant');
const professeurModel = require('./models/professeur');
const encadrantModel = require('./models/encadrant');
const entrepriseModel = require('./models/entreprise');
const mainModel = require('./models/main');
const typeModel = require('./models/type');
const stageModel = require('./models/stage');
const anneeModel = require('./models/annee');
const competenceModel = require('./models/competence');
const promotionModel = require('./models/promotion');
const exigerModel = require('./models/exiger');
const associerModel = require('./models/associer');



const pool = require('./pool');

const app = express();
const port = 3500;

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Authentication Endpoints

// Sign Up
app.post('/signup', async (req, res) => {
    const { username, email, password, nom, prenom, telephone } = req.body;

    try {
        // Check if username or email already exists
        const userExistsQuery = 'SELECT * FROM public."user" WHERE username = $1 OR email = $2';
        const userExistsResult = await pool.query(userExistsQuery, [username, email]);

        if (userExistsResult.rows.length > 0) {
            return res.status(409).json({ error: 'Username or email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Store the user in the database with additional fields
        const insertUserQuery = `
            INSERT INTO public."user" (username, email, password, nom, prenom, telephone)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        await pool.query(insertUserQuery, [username, email, hashedPassword, nom, prenom, telephone]);

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error during sign up:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Sign In
app.post('/signin', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Find the user by username or email
        const getUserQuery = 'SELECT * FROM public."user" WHERE username = $1 OR email = $2';
        const userResult = await pool.query(getUserQuery, [username, email]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Compare the provided password with the hashed password
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        res.json({ message: 'Sign in successful' });
    } catch (error) {
        console.error('Error during sign in:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Add this endpoint after your other routes

app.get('/user', async (req, res) => {

    const client = await pool.connect();
    try {
        // Query to get a single user with LIMIT 1
        const result = await client.query(`
            SELECT * FROM public."user"
            LIMIT 1
        `);

        const user = result.rows[0];

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
});







//general endpoints

app.get('/stage/types', async (req, res) => {
    try {
        const client = await pool.connect();

        const result = await client.query(`
            SELECT no_type, COUNT(*) AS count
            FROM public.stage
            GROUP BY no_type
        `);

        const stageCounts = {};
        result.rows.forEach((row) => {
            stageCounts[row.no_type] = row.count;
        });

        res.json(stageCounts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/stage/recent', async (req, res) => {
    try {
        const getRecentStages = await mainModel.getRecentStages();
        res.json(getRecentStages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error recent stages' });
    }
});

app.get('/stage/entreprise', async (req, res) => {
    try {
        const getRecentStages = await mainModel.getTopEnterpriseByStageCount();
        res.json(getRecentStages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error recent stages' });
    }
});

app.get('/stage/percentage-completed', async (req, res) => {

    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT
                COUNT(CASE WHEN s.appreciation_stage IS NOT NULL THEN 1 END) AS students_completed,
                COUNT(e.no_etudiant) AS total_students,
                (COUNT(CASE WHEN s.appreciation_stage IS NOT NULL THEN 1 END) * 100.0 / COUNT(e.no_etudiant)) AS percentage_completed
            FROM public.etudiant e
            LEFT JOIN public.stage s ON e.no_etudiant = s.no_etudiant;
        `);

        res.json(result.rows[0]);
    } finally {
        client.release();
    }

});



















// Get all Etudiants
app.get('/etudiant', async (req, res) => {
    try {
        const allEtudiants = await etudiantModel.getAllEtudiants();
        res.json(allEtudiants);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/etudiant', async (req, res) => {
    try {
        const createdEtudiant = await etudiantModel.createEtudiant(req.body);
        res.status(201).json(createdEtudiant);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.get('/etudiant/:no_etudiant', async (req, res) => {
    try {
        const fetchedEtudiant = await etudiantModel.getEtudiantById(req.params.no_etudiant);
        if (!fetchedEtudiant) {
            res.status(404).json({ error: 'Etudiant not found' });
        } else {
            res.json(fetchedEtudiant);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/etudiant/:no_etudiant', async (req, res) => {
    try {
        const updatedEtudiant = await etudiantModel.updateEtudiant(req.params.no_etudiant, req.body);
        if (!updatedEtudiant) {
            res.status(404).json({ error: 'Etudiant not found' });
        } else {
            res.json(updatedEtudiant);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/etudiant/:no_etudiant', async (req, res) => {
    try {
        const deletedEtudiant = await etudiantModel.deleteEtudiant(req.params.no_etudiant);
        if (!deletedEtudiant) {
            res.status(404).json({ error: 'Etudiant not found' });
        } else {
            res.json(deletedEtudiant);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});








// Professeur Endpoints

app.get('/professeur', async (req, res) => {
    try {
        const allProfesseurs = await professeurModel.getAllProfesseurs();
        res.json(allProfesseurs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/professeur', async (req, res) => {
    try {
        const createdProfesseur = await professeurModel.createProfesseur(req.body);
        res.status(201).json(createdProfesseur);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/professeur/:no_professeur', async (req, res) => {
    try {
        const fetchedProfesseur = await professeurModel.getProfesseurById(req.params.no_professeur);
        if (!fetchedProfesseur) {
            res.status(404).json({ error: 'Professeur not found' });
        } else {
            res.json(fetchedProfesseur);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/professeur/:no_professeur', async (req, res) => {
    try {
        const updatedProfesseur = await professeurModel.updateProfesseur(req.params.no_professeur, req.body);
        if (!updatedProfesseur) {
            res.status(404).json({ error: 'Professeur not found' });
        } else {
            res.json(updatedProfesseur);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/professeur/:no_professeur', async (req, res) => {
    try {
        const deletedProfesseur = await professeurModel.deleteProfesseur(req.params.no_professeur);
        if (!deletedProfesseur) {
            res.status(404).json({ error: 'Professeur not found' });
        } else {
            res.json(deletedProfesseur);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});










// Encadrant Endpoints

app.get('/encadrant', async (req, res) => {
    try {
        const allEncadrants = await encadrantModel.getAllEncadrants();
        res.json(allEncadrants);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/encadrant', async (req, res) => {
    try {
        const createdEncadrant = await encadrantModel.createEncadrant(req.body);
        res.status(201).json(createdEncadrant);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/encadrant/:no_encadrant', async (req, res) => {
    try {
        const fetchedEncadrant = await encadrantModel.getEncadrantById(req.params.no_encadrant);
        if (!fetchedEncadrant) {
            res.status(404).json({ error: 'Encadrant not found' });
        } else {
            res.json(fetchedEncadrant);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/encadrant/:no_encadrant', async (req, res) => {
    try {
        const updatedEncadrant = await encadrantModel.updateEncadrant(req.params.no_encadrant, req.body);
        if (!updatedEncadrant) {
            res.status(404).json({ error: 'Encadrant not found' });
        } else {
            res.json(updatedEncadrant);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/encadrant/:no_encadrant', async (req, res) => {
    try {
        const deletedEncadrant = await encadrantModel.deleteEncadrant(req.params.no_encadrant);
        if (!deletedEncadrant) {
            res.status(404).json({ error: 'Encadrant not found' });
        } else {
            res.json(deletedEncadrant);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});












// Entreprise Endpoints

app.get('/entreprise', async (req, res) => {
    try {
        const allEntreprises = await entrepriseModel.getAllEntreprises();
        res.json(allEntreprises);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/entreprise', async (req, res) => {
    try {
        const createdEntreprise = await entrepriseModel.createEntreprise(req.body);
        res.status(201).json(createdEntreprise);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/entreprise/:no_entreprise', async (req, res) => {
    try {
        const fetchedEntreprise = await entrepriseModel.getEntrepriseById(req.params.no_entreprise);
        if (!fetchedEntreprise) {
            res.status(404).json({ error: 'Entreprise not found' });
        } else {
            res.json(fetchedEntreprise);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/entreprise/:no_entreprise', async (req, res) => {
    try {
        const updatedEntreprise = await entrepriseModel.updateEntreprise(req.params.no_entreprise, req.body);
        if (!updatedEntreprise) {
            res.status(404).json({ error: 'Entreprise not found' });
        } else {
            res.json(updatedEntreprise);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/entreprise/:no_entreprise', async (req, res) => {
    try {
        const deletedEntreprise = await entrepriseModel.deleteEntreprise(req.params.no_entreprise);
        if (!deletedEntreprise) {
            res.status(404).json({ error: 'Entreprise not found' });
        } else {
            res.json(deletedEntreprise);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});











// Type Endpoints
app.get('/type', async (req, res) => {
    try {
        const allTypes = await typeModel.getAllTypes();
        res.json(allTypes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/type', async (req, res) => {
    try {
        const createdType = await typeModel.createType(req.body);
        res.status(201).json(createdType);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/type/:no_type', async (req, res) => {
    try {
        const fetchedType = await typeModel.getTypeById(req.params.no_type);
        if (!fetchedType) {
            res.status(404).json({ error: 'Type not found' });
        } else {
            res.json(fetchedType);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/type/:no_type', async (req, res) => {
    try {
        const updatedType = await typeModel.updateType(req.params.no_type, req.body);
        if (!updatedType) {
            res.status(404).json({ error: 'Type not found' });
        } else {
            res.json(updatedType);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/type/:no_type', async (req, res) => {
    try {
        const deletedType = await typeModel.deleteType(req.params.no_type);
        if (!deletedType) {
            res.status(404).json({ error: 'Type not found' });
        } else {
            res.json(deletedType);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});









// Stage Endpoints
app.get('/stage', async (req, res) => {
    try {
        const allStages = await stageModel.getAllStages();
        res.json(allStages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/stage', async (req, res) => {
    try {
        const createdStage = await stageModel.createStage(req.body);
        res.status(201).json(createdStage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/stage/:no_stage', async (req, res) => {
    try {
        const fetchedStage = await stageModel.getStageById(req.params.no_stage);
        if (!fetchedStage) {
            res.status(404).json({ error: 'Stage not found' });
        } else {
            res.json(fetchedStage);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/stage/:no_stage', async (req, res) => {
    try {
        const updatedStage = await stageModel.updateStage(req.params.no_stage, req.body);
        if (!updatedStage) {
            res.status(404).json({ error: 'Stage not found' });
        } else {
            res.json(updatedStage);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/stage/:no_stage', async (req, res) => {
    try {
        const deletedStage = await stageModel.deleteStage(req.params.no_stage);
        if (!deletedStage) {
            res.status(404).json({ error: 'Stage not found' });
        } else {
            res.json(deletedStage);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});










// Annee Endpoints
app.get('/annee', async (req, res) => {
    try {
        const allAnnees = await anneeModel.getAllAnnees();
        res.json(allAnnees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/annee', async (req, res) => {
    try {
        const createdAnnee = await anneeModel.createAnnee(req.body);
        res.status(201).json(createdAnnee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/annee/:annee', async (req, res) => {
    try {
        const fetchedAnnee = await anneeModel.getAnneeById(req.params.annee);
        if (!fetchedAnnee) {
            res.status(404).json({ error: 'Annee not found' });
        } else {
            res.json(fetchedAnnee);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/annee/:annee', async (req, res) => {
    try {
        const updatedAnnee = await anneeModel.updateAnnee(req.params.annee, req.body);
        if (!updatedAnnee) {
            res.status(404).json({ error: 'Annee not found' });
        } else {
            res.json(updatedAnnee);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/annee/:annee', async (req, res) => {
    try {
        const deletedAnnee = await anneeModel.deleteAnnee(req.params.annee);
        if (!deletedAnnee) {
            res.status(404).json({ error: 'Annee not found' });
        } else {
            res.json(deletedAnnee);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});








// Competence Endpoints
app.get('/competence', async (req, res) => {
    try {
        const allCompetences = await competenceModel.getAllCompetences();
        res.json(allCompetences);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/competence', async (req, res) => {
    try {
        const createdCompetence = await competenceModel.createCompetence(req.body);
        res.status(201).json(createdCompetence);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/competence/:no_competence', async (req, res) => {
    try {
        const fetchedCompetence = await competenceModel.getCompetenceById(req.params.no_competence);
        if (!fetchedCompetence) {
            res.status(404).json({ error: 'Competence not found' });
        } else {
            res.json(fetchedCompetence);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/competence/:no_competence', async (req, res) => {
    try {
        const updatedCompetence = await competenceModel.updateCompetence(req.params.no_competence, req.body);
        if (!updatedCompetence) {
            res.status(404).json({ error: 'Competence not found' });
        } else {
            res.json(updatedCompetence);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/competence/:no_competence', async (req, res) => {
    try {
        const deletedCompetence = await competenceModel.deleteCompetence(req.params.no_competence);
        if (!deletedCompetence) {
            res.status(404).json({ error: 'Competence not found' });
        } else {
            res.json(deletedCompetence);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});











// Promotion Endpoints
app.get('/promotion', async (req, res) => {
    try {
        const allPromotions = await promotionModel.getAllPromotions();
        res.json(allPromotions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/promotion', async (req, res) => {
    try {
        const createdPromotion = await promotionModel.createPromotion(req.body);
        res.status(201).json(createdPromotion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/promotion/:annee_promotion', async (req, res) => {
    try {
        const fetchedPromotion = await promotionModel.getPromotionById(req.params.annee_promotion);
        if (!fetchedPromotion) {
            res.status(404).json({ error: 'Promotion not found' });
        } else {
            res.json(fetchedPromotion);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/promotion/:annee_promotion', async (req, res) => {
    try {
        const updatedPromotion = await promotionModel.updatePromotion(req.params.annee_promotion, req.body);
        if (!updatedPromotion) {
            res.status(404).json({ error: 'Promotion not found' });
        } else {
            res.json(updatedPromotion);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/promotion/:annee_promotion', async (req, res) => {
    try {
        const deletedPromotion = await promotionModel.deletePromotion(req.params.annee_promotion);
        if (!deletedPromotion) {
            res.status(404).json({ error: 'Promotion not found' });
        } else {
            res.json(deletedPromotion);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});









// Exiger Endpoints
app.get('/exiger', async (req, res) => {
    try {
        const allExiger = await exigerModel.getAllExiger();
        res.json(allExiger);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/exiger', async (req, res) => {
    try {
        const createdExiger = await exigerModel.createExiger(req.body);
        res.status(201).json(createdExiger);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/exiger/:no_type/:no_competence', async (req, res) => {
    try {
        const fetchedExiger = await exigerModel.getExigerById(req.params.no_type, req.params.no_competence);
        if (!fetchedExiger) {
            res.status(404).json({ error: 'Exiger not found' });
        } else {
            res.json(fetchedExiger);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/exiger/:no_type/:no_competence', async (req, res) => {
    try {
        const updatedExiger = await exigerModel.updateExiger(req.params.no_type, req.params.no_competence, req.body);
        if (!updatedExiger) {
            res.status(404).json({ error: 'Exiger not found' });
        } else {
            res.json(updatedExiger);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/exiger/:no_type/:no_competence', async (req, res) => {
    try {
        const deletedExiger = await exigerModel.deleteExiger(req.params.no_type, req.params.no_competence);
        if (!deletedExiger) {
            res.status(404).json({ error: 'Exiger not found' });
        } else {
            res.json(deletedExiger);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





// Associer Endpoints
app.get('/associer', async (req, res) => {
    try {
        const allAssocier = await associerModel.getAllAssocier();
        res.json(allAssocier);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/associer', async (req, res) => {
    try {
        const createdAssocier = await associerModel.createAssocier(req.body);
        res.status(201).json(createdAssocier);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/associer/:annee/:no_type', async (req, res) => {
    try {
        const fetchedAssocier = await associerModel.getAssocierById(req.params.annee, req.params.no_type);
        if (!fetchedAssocier) {
            res.status(404).json({ error: 'Associer not found' });
        } else {
            res.json(fetchedAssocier);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/associer/:annee/:no_type', async (req, res) => {
    try {
        const updatedAssocier = await associerModel.updateAssocier(req.params.annee, req.params.no_type, req.body);
        if (!updatedAssocier) {
            res.status(404).json({ error: 'Associer not found' });
        } else {
            res.json(updatedAssocier);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/associer/:annee/:no_type', async (req, res) => {
    try {
        const deletedAssocier = await associerModel.deleteAssocier(req.params.annee, req.params.no_type);
        if (!deletedAssocier) {
            res.status(404).json({ error: 'Associer not found' });
        } else {
            res.json(deletedAssocier);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// run the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
