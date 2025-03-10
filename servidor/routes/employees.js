const express = require("express"); //Llamamos a express
const app = express(); //Ejecutamos express
const dotenv = require ("dotenv"); //Llamamos a dotenv
const bcrypt = require('bcryptjs'); //Llamamos a bcrypt
const jwt = require("jsonwebtoken"); //Llamamos a jsonwebtoken
// express, dotenv, bcrypt, jwt son librerias instaladas en el package.json

// dotenv para configurar las variables de entorno
dotenv.config();


// conexion a la base de datos
const {connection} = require("../config/config.db");

//SELECT * FROM view_employees WHERE status = 1;

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

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Obtener todos los empleados
 *     tags: [Empleados]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de empleados
 *       401:
 *         description: No autorizado
 */
const getEmployees = (request, response) => {
    connection.query("SELECT * FROM user_employees WHERE status = 1", (error, results) => {
        if (error) throw error;
        response.status(200).json(results);
    });
};

/**
 * @swagger
 * /api/employees:
 *   post:
 *     summary: Agregar un nuevo empleado
 *     tags: [Empleados]
 *     description: Esta ruta agrega un nuevo empleado a la base de datos.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fk_user:
 *                 type: integer
 *               fk_role:
 *                 type: integer
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Empleado creado correctamente
 *       500:
 *         description: Error al encriptar la contraseña
 */
const postEmployees = async (request, response) => {
    const { fk_user, fk_role, password } = request.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
        connection.query("INSERT INTO employees (fk_user, fk_role, password) VALUES (?,?,?)",
            [fk_user, fk_role, hashedPassword], (error, results) => {
                if (error) throw error;
                response.status(201).json({ "Empleado añadido correctamente.": results.affectedRows });
            });
    } catch (error) {
        response.status(500).json({ error: "Error al encriptar la contraseña" });
    }
};

/**
 * @swagger
 * /api/employees/{pk_employee}:
 *   put:
 *     summary: Actualizar un empleado
 *     tags: [Empleados]
 *     description: Esta ruta actualiza los datos de un empleado específico.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pk_employee
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fk_user:
 *                 type: integer
 *               fk_role:
 *                 type: integer
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Empleado actualizado correctamente
 *       500:
 *         description: Error al encriptar la contraseña
 */
const putEmployees = async (request, response) => {
    const { pk_employee } = request.params;
    const { fk_user, fk_role, password } = request.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
        connection.query("UPDATE employees SET fk_user = ?, fk_role = ?, password = ? WHERE pk_employee = ?",
            [fk_user, fk_role, hashedPassword, pk_employee], (error, results) => {
                if (error) throw error;
                response.status(200).json({ "Datos de empleado actualizados correctamente.": results.affectedRows });
            });
    } catch (error) {
        response.status(500).json({ error: "Error al encriptar la contraseña" });
    }
};

/**
 * @swagger
 * /api/employees/{pk_employee}:
 *   delete:
 *     summary: Eliminar un empleado
 *     tags: [Empleados]
 *     description: Esta ruta elimina un empleado al actualizar su estado a 0.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pk_employee
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Empleado eliminado correctamente
 */
const deleteEmployees = (request, response) => {
    const { pk_employee } = request.params;
    connection.query("UPDATE employees SET status = 0 WHERE pk_employee = ?", [pk_employee], (error, results) => {
        if (error) throw error;
        response.status(200).json({ "Empleado eliminado correctamente.": results.affectedRows });
    });
};

// Inicio de sesión

/**
 * @swagger
 * /api/user_employees:
 *   post:
 *     summary: Inicio de sesión para un empleado
 *     tags: [Empleados]
 *     description: Esta ruta permite a un empleado iniciar sesión y obtener un JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso, token generado
 *       400:
 *         description: Email y contraseña son requeridos
 *       401:
 *         description: Credenciales incorrectas
 */
const user_Employees = (request, response) => {
    const { email, password } = request.body;

    if (!email || !password) {
        return response.status(400).json({ success: false, message: "Email y contraseña son requeridos" });
    }

    connection.query("SELECT * FROM user_employees WHERE email = ? AND password = ?", [email, password], (error, results) => {
        if (error) {
            return response.status(500).json({ success: false, message: "Error en el servidor". error });
        }

        if (results.length > 0) {
            const user = results[0];
            const token = jwt.sign(
                { id: user.pk_user, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
            return response.status(200).json({
                success: true,
                message: "Login exitoso",
                user: user,
                token: token
            });
        } else {
            return response.status(401).json({ success: false, message: "Credenciales incorrectas" });
        }
    });
};

/**/

/**
 * @swagger
 * /api/verificacion-token:
 *   post:
 *     summary: "Verificar el token"
 *     tags: [Empleados]
 *     description: "Esta ruta verifica la validez de un token JWT."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: "Token verificado exitosamente"
 *       401:
 *         description: "Token inválido o expirado"
 */

// Variables para comprobar el token
app.post("/api/verificacion-token", (req, res) => {
    const { token } = req.body; // Se captura el token

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => { // Se verifica el token
        if (err) { // Si hay un error
            return res.status(401).json({ message: "Token inválido o expirado" }); // 401 Unauthorized
        }
        return res.status(200).json({ message: "Token verificado", user: decoded }); // 200 OK
    });
    
});


const getEmployeesById = (request, response) => {
    response.send("El web socket se ha conectado");
};

// Rutas
app.route("/api/employees").get(verifyToken, getEmployees); 
app.route("/api/employees").post(verifyToken, postEmployees); 
app.route("/api/employees/:pk_employee").put(verifyToken, putEmployees); 
app.route("/api/employees/:pk_employee").delete(verifyToken, deleteEmployees);
app.route("/api/user_employees").post(user_Employees); // No requiere token

/*
app.route("/api/employees").get(getEmployees); // Ruta para obtener los datos de los empleados
app.route("/api/user_employees").post(user_Employees); // Ruta para hacer el inicio de sesion
app.route("/api/employees").post(postEmployees); // Ruta para ingresar los datos de un nuevo empleado
app.route("/api/employees/:pk_employee").put(putEmployees); // Ruta para actualizar los datos de un empleado
app.route("/api/employees/:pk_employee").delete(deleteEmployees); // Ruta para eliminar un empleado
app.route("/api/ws").get(getEmployeesById);*/

module.exports = app; // Se exporta la app

