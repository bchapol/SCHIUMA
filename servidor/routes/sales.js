const express = require('express');
const router = express.Router();
const { connection } = require('../config/config.db'); // Asegúrate de que la ruta es correcta

router.get('/sales', (req, res) => {
    if (!connection) {
        return res.status(500).json({ error: 'Could not establish a connection to the database.' });
    }

    connection.query('SELECT * FROM sales', (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json(results);
    });
});

router.get('/sales/:sale', (req, res) => {
    const saleId = req.params.sale;
    if (!connection) {
        return res.status(500).json({ error: 'Could not establish a connection to the database.' });
    }

    connection.query('SELECT * FROM sales WHERE pk_sale = ?', [saleId], (error, results) => {
        if (error) {            
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json(results);
    });
});

router.post('/sales', (req, res) => {
    const {fk_product, fk_customer, fk_employee, quantity, date, total_price, token} = req.body;

    connection.query('INSERT INTO sales (fk_product, fk_customer, fk_employee, quantity, date, total_price, token) VALUES (?,?,?,?,?,?,?)', [fk_product, fk_customer, fk_employee, quantity, date, total_price, token], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({"New sale added": results.affectedRows});

    });
});

router.put('/sales/:sale', (req, res) => {
    const saleId = req.params.sale;
    const {fk_product, fk_customer, fk_employee, quantity, date, total_price, token} = req.body;

    connection.query('UPDATE sales SET fk_product = ?, fk_customer = ?, fk_employee = ?, quantity = ?, date = ?, total_price = ?, token = ?  WHERE pk_sale = ?', [fk_product, fk_customer, fk_employee, quantity, date, total_price, token, saleId], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({"Sale updated": results.affectedRows});
    });
});


module.exports = router;