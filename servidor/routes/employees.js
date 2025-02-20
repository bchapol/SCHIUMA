const express = require("express");
const app = express();
const dotenv = require ("dotenv");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

dotenv.config();


/* CONNECTION TO DB */
const {connection} = require("../config/config.db");
/* connection.query("SELECT * FROM employees" */
const getEmployees = (request, response)=>{
    connection.query("SELECT fk_user, fk_role, status FROM employees",
    (error, results) => {   
        if(error)
            throw error;
        response.status (200).json(results);
    });
};

const postEmployees = async(request, response) => {
    const {fk_user, fk_role, password} = request.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    try{
        connection.query("INSERT INTO employees (fk_user, fk_role, password) VALUES (?,?,?)",
        [fk_user, fk_role, hashedPassword],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Empleado añadido correctamente.":
            results.affectedRows});
        });
    }catch (error){
        response.status(500).json({ error: "Error al encriptar la contraseña" });
    }
    
};

const putEmployees = async(request, response) => {
    const {pk_employee} = request.params;
    const {fk_user, fk_role, password} = request.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    try{
        connection.query("UPDATE employees SET fk_user = ?, fk_role = ?, password = ? WHERE pk_employee = ?",
        [fk_user, fk_role, hashedPassword, pk_employee],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Datos de empleado actualizados correctamente.":
            results.affectedRows});
        });
    }catch (error){
        response.status(500).json({ error: "Error al encriptar la contraseña" });
    }
    
};

const deleteEmployees = (request, response) => {
    const {pk_employee} = request.params;
    
    connection.query("UPDATE employees SET status = 0 WHERE pk_employee = ? ",
        [pk_employee],
        (error, results) => {
            if(error)
                throw error;
        response.status(201).json({"Empleado eliminado correctamente.":
        results.affectedRows});
    });
};

const user_Employees = (request, response) => {
    const { email, password } = request.body;

    if (!email || !password) {
        return response.status(400).json({ success: false, message: "Email y contraseña son requeridos" });
    }

    connection.query("SELECT * FROM user_employees WHERE email = ?  AND password = ?",
        [email, password],
        (error, results) => {   
            if(error)
            {
                console.error("Error en la consulta:", error);
                return response.status(500).json({ success: false, message: "Error en el servidor" }); // 500 Internal Server Error
            }
            else if (results.length > 0) {
                // Generar un JWT (Token)
                const user = results[0];
                const token = jwt.sign(
                    { id: user.pk_user, email: user.email },
                    process.env.JWT_SECRET, // Usa una clave secreta aquí
                    { expiresIn: "1h" } // Expiración del token (opcional)
                );
                return response.status(200).json({ 
                    success: true, 
                    message: "Login exitoso", 
                    user: user,
                    token: token }); //results array de usuario que coincide
            } else {
                return response.status(401).json({ success: false, message: "Credenciales incorrectas" });
            }
        });
};

app.post("/verificacion-token", (req, res) => {
    const { token } = req.body;

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token inválido o expirado" });
        }
        return res.status(200).json({ message: "Token verificado", user: decoded });
    });
    
});


const getEmployeesById = (request, response) => {
    response.send("El web socket se ha conectado");
};

app.route("/employees").get(getEmployees);
app.route("/user_employees").post(user_Employees);
app.route("/employees").post(postEmployees);
app.route("/employees/:pk_employee").put(putEmployees);
app.route("/employees/:pk_employee").delete(deleteEmployees);
app.route("/ws").get(getEmployeesById);
module.exports = app;