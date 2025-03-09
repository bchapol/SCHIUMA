const express = require('express');
const router = express.Router();
const { connection } = require('../config/config.db'); // Asegúrate de que la ruta es correcta
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

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

// Obtener todas las ventas
router.get('/api/sales', verifyToken, (req, res) => {
    if (!connection) {
        return res.status(500).json({ error: 'Could not establish a connection to the database.' });
    }

    connection.query('SELECT * FROM sales', (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json(results);
    });
});

// Obtener una venta por ID
router.get('/api/sales/:sale', verifyToken, (req, res) => {
    const saleId = req.params.sale;
    
    if (!connection) {
        return res.status(500).json({ error: 'Could not establish a connection to the database.' });
    }

    connection.query('SELECT * FROM sales WHERE pk_sale = ?', [saleId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Sale not found" });
        }
        res.status(200).json(results[0]);
    });
});

// Agregar una nueva venta
router.post('/api/sales', verifyToken, (req, res) => {
    const { fk_product, fk_customer, fk_employee, quantity, date, total_price } = req.body;

    if (!fk_product || !fk_customer || !fk_employee || !quantity || !date || !total_price) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    connection.query(
        'INSERT INTO sales (fk_product, fk_customer, fk_employee, quantity, date, total_price) VALUES (?, ?, ?, ?, ?, ?)',
        [fk_product, fk_customer, fk_employee, quantity, date, total_price],
        (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.status(201).json({ message: "New sale added", affectedRows: results.affectedRows });
        }
    );
});

// Actualizar una venta
router.put('/api/sales/:sale', verifyToken, (req, res) => {
    const saleId = req.params.sale;
    const { fk_product, fk_customer, fk_employee, quantity, date, total_price } = req.body;

    if (!fk_product || !fk_customer || !fk_employee || !quantity || !date || !total_price) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    connection.query(
        'UPDATE sales SET fk_product = ?, fk_customer = ?, fk_employee = ?, quantity = ?, date = ?, total_price = ? WHERE pk_sale = ?',
        [fk_product, fk_customer, fk_employee, quantity, date, total_price, saleId],
        (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Sale not found" });
            }
            res.status(200).json({ message: "Sale updated", affectedRows: results.affectedRows });
        }
    );
});

module.exports = router;
