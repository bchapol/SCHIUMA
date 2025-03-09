const express = require('express');
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

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

// Obtener todos los roles activos
router.get("/api/roles", verifyToken, (req, res) => {
    if (!connection) {
        return res.status(500).json({ error: 'Could not establish a connection to the database.' });
    }

    connection.query('SELECT * FROM roles WHERE status = 1', (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json(results);
    });
});

// Obtener un rol por ID
router.get("/api/roles/:pk_role", verifyToken, (req, res) => {
    const roleId = req.params.pk_role; // Corregido pk_role -> roleId
    if (!connection) {
        return res.status(500).json({ error: 'Could not establish a connection to the database.' });
    }

    connection.query('SELECT * FROM roles WHERE pk_role = ?', [roleId], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json(results);
    });
});

// Agregar un nuevo rol
router.post("/api/roles", verifyToken, (req, res) => {
    const { name } = req.body;

    connection.query('INSERT INTO roles (name) VALUES (?)', [name], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(201).json({ "Nuevo rol añadido": results.affectedRows });
    });
});

// Actualizar un rol por ID
router.put("/api/roles/:pk_role", verifyToken, (req, res) => {
    const roleId = req.params.pk_role;
    const { name } = req.body;

    connection.query('UPDATE roles SET name = ? WHERE pk_role = ?', [name, roleId], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({ "Rol actualizado correctamente": results.affectedRows });
    });
});

// Eliminar un rol (borrado lógico)
router.delete("/api/roles/:pk_role", verifyToken, (req, res) => {
    const roleId = req.params.pk_role;

    connection.query('UPDATE roles SET status = 0 WHERE pk_role = ?', [roleId], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({ "Rol eliminado correctamente": results.affectedRows });
    });
});

module.exports = router;
