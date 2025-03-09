const express = require('express');
const router = express.Router();
const { connection } = require('../config/config.db'); // Asegúrate de que la ruta es correcta
const jwt = require("jsonwebtoken"); // Importa jsonwebtoken
const dotenv = require("dotenv"); 

dotenv.config(); // Carga las variables de entorno

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]; // Obtener el token del encabezado de la solicitud

    if (!token) {
        return res.status(403).json({ message: "Token requerido" }); // 403 Forbidden
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token inválido o expirado" }); // 401 Unauthorized
        }
        req.user = decoded; // Guardar los datos del usuario en la solicitud
        next(); // Continuar con la siguiente función
    });
};

router.get('/api/products', verifyToken, (req, res) => {
    if (!connection) {
        return res.status(500).json({ error: 'Could not establish a connection to the database.' });
    }

    connection.query('SELECT * FROM products', (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json(results);
    });
});

router.get('/api/products/:product', verifyToken, (req, res) => {
    const productId = req.params.product;
    if (!connection) {
        return res.status(500).json({ error: 'Could not establish a connection to the database.' });
    }

    connection.query('SELECT * FROM products WHERE pk_product = ?', [productId], (error, results) => {
        if (error) {            
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json(results);
    });
});

router.post('/api/products', verifyToken, (req, res) => {
    const {fk_provider, fk_category, name, price, stock, description, image} = req.body;

    connection.query('INSERT INTO products (fk_provider, fk_category, name, price, stock, description, image) VALUES (?, ?, ?, ?, ?, ?, ?)', [fk_provider, fk_category, name, price, stock, description, image], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({"New product added": results.affectedRows});
    });
});

router.put('/api/products/:product', verifyToken, (req, res) => {
    const productId = req.params.product;
    const {fk_provider, fk_category, name, price, stock, description, image} = req.body;

    connection.query('UPDATE products SET fk_provider = ?, fk_category = ?, name = ?, price = ?, stock = ?, description = ?, image = ? WHERE pk_product = ?', [fk_provider, fk_category, name, price, stock, description, image, productId], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({"Product updated": results.affectedRows});
    });
});

module.exports = router;
