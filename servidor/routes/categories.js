const express = require('express');
const router = express.Router();
const { connection } = require('../config/config.db'); // Asegúrate de que la ruta es correcta

router.get('/categories', (req, res) => {
    if (!connection) {
        return res.status(500).json({ error: 'Could not establish a connection to the database.' });
    }

    connection.query('SELECT * FROM categories', (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json(results);
    });
});

router.get('/categories/:category', (req, res) => {
    const categoryId = req.params.role;
    if (!connection) {
        return res.status(500).json({ error: 'Could not establish a connection to the database.' });
    }

    connection.query('SELECT * FROM categories WHERE pk_category = ?', [categoryId], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json(results);
    });
});

router.post('/categories', (req, res) => {
    const {name} = req.body;

    connection.query('INSERT INTO categories (name) VALUES (?)', [name], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({"New category added": results.affectedRows});

    });
});

router.put('/categories/:category', (req, res) => {
    const categoryId = req.params.category;
    const {name} = req.body;

    connection.query('UPDATE categories SET name = ? WHERE pk_category = ?', [name, roleId], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({"Role updated": results.affectedRows});
    });
});

module.exports = router;