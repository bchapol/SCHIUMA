const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();
app.use(express.json());

const { connection } = require("../config/config.db");

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

// Obtener usuarios activos
const getUsers = (req, res) => {
    connection.query("SELECT * FROM users WHERE status = 1", (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json(results);
    });
};

// Crear un nuevo usuario con contraseña cifrada
const postUsers = async (req, res) => {
    try {
        const { name, email, phone, image, password } = req.body;
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        connection.query(
            "INSERT INTO users (name, email, phone, image, password) VALUES (?, ?, ?, ?, ?)",
            [name, email, phone, image || null, hashedPassword],
            (error, results) => {
                if (error) {
                    return res.status(500).json({ error: error.message });
                }
                res.status(201).json({ message: "Usuario añadido correctamente", affectedRows: results.affectedRows });
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar usuario (incluyendo contraseña si se envía)
const putUsers = async (req, res) => {
    try {
        const { pk_user } = req.params;
        const { name, email, phone, image, password } = req.body;

        if (!pk_user) {
            return res.status(400).json({ error: "Se requiere el ID del usuario" });
        }

        let query = "UPDATE users SET name = ?, email = ?, phone = ?, image = ?";
        let params = [name, email, phone, image];

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            query += ", password = ?";
            params.push(hashedPassword);
        }

        query += " WHERE pk_user = ?";
        params.push(pk_user);

        connection.query(query, params, (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            res.status(200).json({ message: "Usuario actualizado correctamente", affectedRows: results.affectedRows });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar usuario (cambio de estado)
const deleteUsers = (req, res) => {
    const { pk_user } = req.params;

    if (!pk_user) {
        return res.status(400).json({ error: "Se requiere el ID del usuario" });
    }

    connection.query("UPDATE users SET status = 0 WHERE pk_user = ?", [pk_user], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json({ message: "Usuario eliminado correctamente", affectedRows: results.affectedRows });
    });
};

// Definición de rutas
app.get("/api/users", verifyToken, getUsers);
app.post("/api/users", postUsers);
app.put("/api/users/:pk_user", verifyToken, putUsers);
app.delete("/api/users/:pk_user", verifyToken, deleteUsers);

module.exports = app;
