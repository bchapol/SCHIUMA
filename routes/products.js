const express = require('express');
const router = express.Router();
const { connection } = require('../config/config.db'); // Asegúrate de que la ruta es correcta

router.get('/products', (req, res) => {
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

router.get('/products/:product', (req, res) => {
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

router.post('/products', (req, res) => {
    const {fk_provider, fk_category, name, price, stock, description, image} = req.body;

    connection.query('INSERT INTO products (fk_provider, fk_category, name, price, stock, description, image) VALUES (?, ?, ?, ?, ?, ?, ?)', [fk_provider, fk_category, name, price, stock, description, image], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({"New product added": results.affectedRows});

    });
});

router.put('/products/:product', (req, res) => {
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