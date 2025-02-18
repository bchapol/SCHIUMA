const express = require('express');
const router = express.Router();
const { connection } = require('../config/config.db'); // Asegúrate de que la ruta es correcta

router.get('/providers', (req, res) => {
    if (!connection) {
        return res.status(500).json({ error: 'Could not establish a connection to the database.' });
    }

    connection.query('SELECT * FROM providers', (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json(results);
    });
});

router.get('/providers/:provider', (req, res) => {
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

router.post('/providers', (req, res) => {
    const {user} = req.body;

    connection.query('INSERT INTO providers (fk_user) VALUES (?)', [user], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({"New provider added": results.affectedRows});

    });
});

router.put('/providers/:provider', (req, res) => {
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

module.exports = router;