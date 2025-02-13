const express = require("express");
const app = express();
const dotenv = require ("dotenv");
const bcrypt = require('bcryptjs');
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
    const hashedPassword = await bcrypt.hash(password, salt);
    try{
        connection.query("INSERT INTO employees (fk_user, fk_role, password, status) VALUES (?,?,?,1) ",
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


app.route("/employees").get(getEmployees);
app.route("/employees").post(postEmployees);
app.route("/employees/:pk_employee").put(putEmployees);
app.route("/employees/:pk_employee").delete(deleteEmployees);
module.exports = app;