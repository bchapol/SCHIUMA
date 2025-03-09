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
    const token = req.headers["authorization"]; // Obtener el token del encabezado de la solicitud

    if (!token) {
        return res.status(403).json({ message: "Token requerido" }); // 403 Forbidden
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token inválido o expirado" }); // 401 Unauthorized
        }
        req.user = decoded; // Guardar los datos del usuario en la solicitud
        next(); // Continuar con la siguiente función
    });
};



// Variables para conseguir la informacion de los empleados
const getEmployees = (request, response)=>{
    //connection.query("SELECT fk_user, fk_role, status FROM employees WHERE status = 1", //Se hace una consulta para obtener los datos empleados
    connection.query("SELECT * FROM view_employees WHERE status = 1", //Se hace una consulta para obtener los datos empleados
    (error, results) => {    // Se ejecuta la consulta
        if(error) // Si hay un error
            throw error; // Se lanza el error
        response.status (200).json(results); // Se devuelve la informacion
    });
};

// Variables para capturar la informacion del empleado
const postEmployees = async(request, response) => {
    const {fk_user, fk_role, password} = request.body; // Se captura la informacion ingresada desde el front
    const salt = await bcrypt.genSalt(10); // Se genera un salto
    const hashedPassword = await bcrypt.hash(password, salt); // Se encripta la contraseña
    try{
        connection.query("INSERT INTO employees (fk_user, fk_role, password) VALUES (?,?,?)", // Se hace una consulta para insertar los datos
        [fk_user, fk_role, hashedPassword], // Se insertan los datos guardados en la bd 
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Empleado añadido correctamente.": // Se muestra un mensaje de exito
            results.affectedRows});
        });
    }catch (error){
        response.status(500).json({ error: "Error al encriptar la contraseña" }); // Se muestra un mensaje de error
    }
    
};

// Variables para actualizar la informacion del empleado
const putEmployees = async(request, response) => {
    const {pk_employee} = request.params; // Se obtiene el id
    const {fk_user, fk_role, password} = request.body; // Se captura la informacion ingresada desde el front
    const salt = await bcrypt.genSalt(10); // Se genera un salto
    const hashedPassword = await bcrypt.hash(password, salt); // Se encripta la contraseña
    try{
        // Se hace una consulta para actualizar los datos
        connection.query("UPDATE employees SET fk_user = ?, fk_role = ?, password = ? WHERE pk_employee = ?",
        [fk_user, fk_role, hashedPassword, pk_employee],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Datos de empleado actualizados correctamente.": // Se muestra un mensaje de exito
            results.affectedRows});
        });
    }catch (error){
        response.status(500).json({ error: "Error al encriptar la contraseña" }); // Se muestra un mensaje de error
    }
    
};

// Variables para eliminar la informacion del empleado
const deleteEmployees = (request, response) => {
    const {pk_employee} = request.params; // Se obtiene el id
    
    connection.query("UPDATE employees SET status = 0 WHERE pk_employee = ? ", // Se hace una consulta para eliminar los datos
        [pk_employee],
        (error, results) => {
            if(error)
                throw error;
        response.status(201).json({"Empleado eliminado correctamente.": // Se muestra un mensaje de error
        results.affectedRows});
    });
};


/*
const user_Employees = (request, response) => {
    const { email, password } = request.body;

    if (!email || !password) {
        return response.status(400).json({ success: false, message: "Email y contraseña son requeridos" });
    }

    connection.query("SELECT * FROM user_employees WHERE email = ?", [email], async (error, results) => {
        if (error) {
            console.error("Error en la consulta:", error);
            return response.status(500).json({ success: false, message: "Error en el servidor" });
        }
        
        if (results.length === 0) {
            return response.status(401).json({ success: false, message: "Credenciales incorrectas" });
        }

        const user = results[0];  
        const validPassword = await bcrypt.compare(password, user.password); 

        if (!validPassword) {
            return response.status(401).json({ success: false, message: "Credenciales incorrectas" });
        }

        const token = jwt.sign(
            { id: user.pk_user, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return response.status(200).json({ success: true, message: "Login exitoso", user, token });
    });
};
*/

// Variables para hacer el inicio de sesion
const user_Employees = (request, response) => {
    const { email, password } = request.body; // Se captura la informacion ingresada desde el front

    if (!email || !password) { // Si no se ingresan los datos
        return response.status(400).json({ success: false, message: "Email y contraseña son requeridos" }); // 400 Bad Request
    }

    connection.query("SELECT * FROM user_employees WHERE email = ?  AND password = ?", // Se hace una consulta para obtener los datos
        [email, password],
        (error, results) => {   
            if(error)
            {
                console.error("Error en la consulta:", error); // Error en la consulta
                return response.status(500).json({ success: false, message: "Error en el servidor ddd" }); // 500 Internal Server Error
            }
            else if (results.length > 0) {
                // Generar un JWT (Token)
                const user = results[0]; // Se obtiene el usuario
                const token = jwt.sign( // Se genera el token
                    { id: user.pk_user, email: user.email }, // Datos del usuario
                    process.env.JWT_SECRET, // Usa una clave secreta aquí
                    { expiresIn: "1h" } // Expiración del token (opcional)
                );
                console.log("Token generado:", token); // Se imprimira en la consola el Token generado
                return response.status(200).json({ // Se devuelve la informacion
                    success: true, 
                    message: "Login exitoso", 
                    user: user,
                    token: token }); //results array de usuario que coincide
            } else {
                // Credenciales incorrectas
                return response.status(401).json({ success: false, message: "Credenciales incorrectas" });
            }
        });
};
/**/

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

