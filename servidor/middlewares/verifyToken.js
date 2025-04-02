const jwt = require("jsonwebtoken"); 
require("dotenv").config();

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

module.exports = verifyToken;