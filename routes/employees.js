const express = require("express");
const app = express();
const dotenv = require ("dotenv");
dotenv.config();

/* CONNECTION TO DB */
const {connection} = require("../config/config.db");

const getEmployees = (request, response)=>{
    connection.query("SELECT * FROM tbl_alumno",
    (error, results) => {   
        if(error)
            throw error;
        response.status (200).json(results);
    });
};
