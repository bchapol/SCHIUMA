const express = require('express'); // Llamamos a express
const router = express.Router(); // Ejecutamos express router
const dotenv = require("dotenv"); // Llamamos a dotenv
dotenv.config(); // Configuración de variables de entorno

const { connection } = require('../config/config.db'); // Conexion a la base de datos
const jwt = require("jsonwebtoken"); // Llamamos a jsonwebtoken

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
    let token = req.headers["authorization"]; // Obtener el token del header
    
    if (!token) {
        return res.status(403).json({ message: "Token requerido" });
    }

    // Asegurar que el token tiene el formato correcto "Bearer TOKEN_AQUI"
    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length); // Remover "Bearer " para obtener solo el token
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token inválido o expirado" });
        }
        req.user = decoded; // Guardar datos del usuario en la request
        next(); // Continuar con la siguiente función
    });
};

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Obtener todos los roles activos
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles activos
 *       403:
 *         description: Token requerido
 *       401:
 *         description: Token inválido o expirado
 */
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

/**
 * @swagger
 * /api/roles/{pk_role}:
 *   get:
 *     summary: Obtener un rol por ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pk_role
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rol encontrado
 *       404:
 *         description: Rol no encontrado
 *       401:
 *         description: Token inválido o expirado
 */
router.get("/api/roles/:pk_role", verifyToken, (req, res) => {
    const roleId = req.params.pk_role;

    if (!connection) {
        return res.status(500).json({ error: 'Could not establish a connection to the database.' });
    }

    connection.query('SELECT * FROM roles WHERE pk_role = ?', [roleId], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Rol no encontrado" });
        }
        res.status(200).json(results);
    });
});

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Agregar un nuevo rol
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rol creado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token inválido o expirado
 */
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

/**
 * @swagger
 * /api/roles/{pk_role}:
 *   put:
 *     summary: Actualizar un rol por ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pk_role
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rol actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token inválido o expirado
 */
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

/**
 * @swagger
 * /api/roles/{pk_role}:
 *   delete:
 *     summary: Eliminar un rol por ID (borrado lógico)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pk_role
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rol eliminado correctamente
 *       401:
 *         description: Token inválido o expirado
 */
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
