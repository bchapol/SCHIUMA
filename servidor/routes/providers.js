const express = require('express');
const router = express.Router();

// Middlewares
const verifyToken = require("../middlewares/verifyToken");
const uploadPhotos = require("../middlewares/uploadPhotos");

const uploadProductPhotos = uploadPhotos("images/users");

const {
    getProviders,
    getProvidersById,
    postProviders,
    putProviders,
    deleteProvider
} = require("../controllers/providersController");

router.get('/api/providers', verifyToken, getProviders)

router.post("/api/providers", verifyToken, uploadProductPhotos.single('image'), postProviders);

router.get("/api/providers/:pk_provider", verifyToken, getProvidersById);

router.put("/api/providers/:pk_provider", verifyToken, uploadProductPhotos.single('image'), putProviders);

router.delete("/api/providers/:pk_provider", verifyToken, deleteProvider);

/*
router.get('/api/providers/:provider', verifyToken, (req, res) => {
    const providerId = req.params.provider;
    if (!connection) {
        return res.status(500).json({ error: 'Could not establish a connection to the database.' });
    }

    connection.query('SELECT * FROM providers WHERE pk_provider = ?', [providerId], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json(results);
    });
});

router.post('/api/providers', verifyToken, (req, res) => {
    const {user} = req.body;

    connection.query('INSERT INTO providers (fk_user) VALUES (?)', [user], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({"New provider added": results.affectedRows});

    });
});

router.put('/api/providers/:provider', verifyToken, (req, res) => {
    const providerId = req.params.provider;
    const {user} = req.body;

    connection.query('UPDATE providers SET fk_user = ? WHERE pk_provider = ?', [user, providerId], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({"Provider updated": results.affectedRows});
    });
});
*/

module.exports = router;