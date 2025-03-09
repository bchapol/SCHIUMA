const express = require('express');
const app = express();
const dotenv = require ("dotenv");
dotenv.config();

const { connection } = require('../config/config.db'); // Asegúrate de que la ruta es correcta

const getRoles = (req, res) => {
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
};

const getRoleById = (req, res) => {
    const pk_role = req.params.pk_role;
    if (!connection) {
        return res.status(500).json({ error: 'Could not establish a connection to the database.' });
    }

    connection.query('SELECT * FROM roles WHERE pk_role = ?', [pk_role], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json(results);
    });
};

const postRoles = (req, res) => {
    const {name} = req.body;

    connection.query('INSERT INTO roles (name) VALUES (?)', [name], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({"Nuevo rol añadido": results.affectedRows});

    });
};

const putRoles = (req, res) => {
    const roleId = req.params.pk_role;
    const {name} = req.body;

    connection.query('UPDATE roles SET name = ? WHERE pk_role = ?', [name,  roleId], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({"Rol actualizado correctamente": results.affectedRows});
    });
};

const deleteRoles = (req, res) => {
    const roleId = req.params.pk_role;
    connection.query('UPDATE roles SET status = 0  WHERE pk_role = ?', [roleId], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({"Rol eliminado correctamente": results.affectedRows});
    });
};

app.route("/api/roles").get(getRoles);
app.route("/api/roles/:pk_role").get(getRoleById);
app.route("/api/roles").post(postRoles);
app.route("/api/roles/:pk_role").put(putRoles);
app.route("/api/roles/:pk_role").delete(deleteRoles);

module.exports = app;