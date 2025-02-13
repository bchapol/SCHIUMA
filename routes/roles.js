const express = require('express');
const router = express.Router();
const { connection } = require('../config/config.db'); // Asegúrate de que la ruta es correcta

router.get('/roles', (req, res) => {
    if (!connection) {
        return res.status(500).json({ error: 'Could not establish a connection to the database.' });
    }

    connection.query('SELECT * FROM roles', (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json(results);
    });
});

router.get('/roles/:role', (req, res) => {
    const roleId = req.params.role;
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

router.post('/roles', (req, res) => {
    const {name} = req.body;

    connection.query('INSERT INTO roles (name) VALUES (?)', [name], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({"New role added": results.affectedRows});

    });
});

router.put('/roles/:role', (req, res) => {
    const roleId = req.params.role;
    const {name, status} = req.body;

    connection.query('UPDATE roles SET name = ?, status = ? WHERE pk_role = ?', [name, status, roleId], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({"Role updated": results.affectedRows});
    });
});

router.delete('/roles/:role', (req, res) => {
    const roleId = req.params.role;
    connection.query('UPDATE roles SET status = 0  WHERE pk_role = ?', [roleId], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({"Role deleted": results.affectedRows});
    });
});

module.exports = router;