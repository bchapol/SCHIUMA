const express = require("express");
const app = express();
const dotenv = require ("dotenv");
const bcrypt = require('bcryptjs');
dotenv.config();


const {connection} = require("../config/config.db");

const getUsers = (request, response)=>{
    connection.query("SELECT * FROM users",
    (error, results) => {   
        if(error)
            throw error;
        response.status (200).json(results);
    });
};

const postUsers = (request, response) => {
    const {name, email, phone, image} = request.body;
    
    connection.query("INSERT INTO users (name, email, phone, image) VALUES (?,?,?,?) ",
    [name, email, phone, image],
    (error, results) => {
        if(error)
            throw error;
        response.status(201).json({"Usuario añadido correctamente.":
        results.affectedRows});
    });
    
};

const putUsers = (request, response) => {
    const {pk_user} = request.params;
    const {name, email, phone, image} = request.body;

    connection.query("UPDATE users SET name = ?, email = ?, phone = ?, image = ? WHERE pk_user = ?",
    [name, email, phone, image, pk_user],
    (error, results) => {
        if(error)
            throw error;
        response.status(201).json({"Usuario actualizado correctamente.":
        results.affectedRows});
    });
};

const deleteUsers = (request, response) => {
    const {pk_user} = request.params;

    connection.query("UPDATE users SET status = 0 WHERE pk_user = ?",
    [pk_user],
    (error, results) => {
        if(error)  
            throw error;
        response.status(201).json({"Usuario eliminado correctamente.":
        results.affectedRows});
    });
};


app.route("/users").get(getUsers);
app.route("/users").post(postUsers);
app.route("/users/:pk_user").put(putUsers);
app.route("/users/:pk_user").delete(deleteUsers);
module.exports = app;