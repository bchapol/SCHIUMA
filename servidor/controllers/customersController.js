const bcrypt = require('bcryptjs'); 
const jwt = require("jsonwebtoken"); 
const {connection} = require("../config/config.db");


const getCustomers =  (req, res) => {
    connection.query('SELECT * FROM view_customers WHERE status = 1', (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json(results);
    });
};

// Obtener un cliente por ID
const getCustomersById = (req, res) => {
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
};

// Agregar un nuevo cliente
const postCustomers = (req, res) => {
    const {fk_user, rfc, address} = req.body;

    connection.query('INSERT INTO customers (fk_user, rfc, address) VALUES (?,?,?)', [fk_user, rfc, address], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({"New customer added": results.affectedRows});
    });
};

// Actualizar un cliente por ID
const putCustomers = (req, res) => {
    const customerId = req.params.customer;
    const {fk_user, rfc, address} = req.body;

    connection.query('UPDATE customers SET fk_user = ?, rfc = ?, address = ? WHERE pk_customer = ?', [fk_user, rfc, address, customerId], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({"Customer updated": results.affectedRows});
    });
};

module.exports = {
    getCustomers,
    getCustomersById,
    postCustomers,
    putCustomers
};
