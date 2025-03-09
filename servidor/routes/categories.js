const express = require('express');
const router = express.Router();
const { connection } = require('../config/config.db'); // Asegúrate de que la ruta es correcta
const jwt = require("jsonwebtoken"); // Importamos JWT

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(403).json({ message: "Token requerido" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token inválido o expirado" });
        }
        req.user = decoded;
        next();
    });
};

// Obtener todas las categorías
router.get('/api/categories', verifyToken, (req, res) => {
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

// Obtener una categoría por ID
router.get('/api/categories/:category', verifyToken, (req, res) => {
    const categoryId = req.params.category; // Corregido de req.params.role a req.params.category
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

// Agregar una nueva categoría
router.post('/api/categories', verifyToken, (req, res) => {
    const { name } = req.body;

    connection.query('INSERT INTO categories (name) VALUES (?)', [name], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({ "New category added": results.affectedRows });
    });
});

// Actualizar una categoría por ID
router.put('/api/categories/:category', verifyToken, (req, res) => {
    const categoryId = req.params.category;
    const { name } = req.body;

    connection.query('UPDATE categories SET name = ? WHERE pk_category = ?', [name, categoryId], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({ "Category updated": results.affectedRows });
    });
});

module.exports = router;
