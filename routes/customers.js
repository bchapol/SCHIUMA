const express = require('express');
const router = express.Router();
const { connection } = require('../config/config.db'); // Asegúrate de que la ruta es correcta

router.get('/customers', (req, res) => {
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

router.get('/customers/:customer', (req, res) => {
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

router.post('/customers', (req, res) => {
    const {fk_user, rfc, address} = req.body;

    connection.query('INSERT INTO customers (fk_user, rfc, address) VALUES (?,?,?)', [fk_user, rfc, address], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({"New customer added": results.affectedRows});

    });
});

router.put('/customers/:customer', (req, res) => {
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