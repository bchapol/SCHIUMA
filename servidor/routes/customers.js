const express = require('express');
const router = express.Router();
const { connection } = require('../config/config.db'); // Asegúrate de que la ruta es correcta
const jwt = require("jsonwebtoken"); // Importamos JWT

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

// Obtener todos los clientes
router.get('/api/customers', verifyToken, (req, res) => {
    if (!connection) {
        return res.status(500).json({ error: 'Could not establish a connection to the database.' });
    }

    connection.query('SELECT * FROM customers', (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json(results);
    });
});

// Obtener un cliente por ID
router.get('/api/customers/:customer', verifyToken, (req, res) => {
    const customerId = req.params.customer;
    if (!connection) {
        return res.status(500).json({ error: 'Could not establish a connection to the database.' });
    }

    connection.query('SELECT * FROM customers WHERE pk_customer = ?', [customerId], (error, results) => {
        if (error) {            
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json(results);
    });
});

// Agregar un nuevo cliente
router.post('/api/customers', verifyToken, (req, res) => {
    const {fk_user, rfc, address} = req.body;

    connection.query('INSERT INTO customers (fk_user, rfc, address) VALUES (?,?,?)', [fk_user, rfc, address], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({"New customer added": results.affectedRows});
    });
});

// Actualizar un cliente por ID
router.put('/api/customers/:customer', verifyToken, (req, res) => {
    const customerId = req.params.customer;
    const {fk_user, rfc, address} = req.body;

    connection.query('UPDATE customers SET fk_user = ?, rfc = ?, address = ? WHERE pk_customer = ?', [fk_user, rfc, address, customerId], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({"Customer updated": results.affectedRows});
    });
});

module.exports = router;
