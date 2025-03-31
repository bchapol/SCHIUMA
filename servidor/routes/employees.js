const express = require("express");
const app = express(); 
const dotenv = require ("dotenv"); 
const bcrypt = require('bcryptjs'); 
const jwt = require("jsonwebtoken"); 

const multer = require("multer");
const path = require("path");

dotenv.config();

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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "users_images/"); // Directorio donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para evitar duplicados
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Límite de 2MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Solo se permiten archivos de imagen (JPG, JPEG, PNG)"));
    }
});

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
    connection.query("SELECT * FROM view_employees WHERE status = 1", (error, results) => {
        if (error) throw error;

        const employees = results.map((employee) => {
            // Verificar si hay una imagen guardada
            if (employee.image) {
                // Si la imagen existe, obtenemos el archivo binario de la base de datos
                employee.image = `${employee.image.toString('base64')}`;
            }
            return employee;
        });

        response.status(200).json(employees);
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
    const { pk_employee } = request.params;
    const { name, email, phone, fk_role, password } = request.body;
    const image = request.file ? `users_images/${request.file.filename}` : null;

    if (!image) {
        return response.status(400).json({ error: "La imagen es obligatoria" });
    }
    
    connection.beginTransaction(async(err) =>{
        if(err){
            return request.status(500).json({error: err.message});
        }

        try{
            const salt = await bcrypt.genSalt(10);
            const encryPass = await bcrypt.hash(password, salt);

            connection.query(
                "INSERT INTO users (name, email, phone, image) VALUES (?, ?, ?, ?)",
                [name, email, phone, image],
                (error, results) => {
                    if(error){
                        return connection.rollback(() => {
                            results.status(500).json({error: error.message});
                        });
                    }

                    const fk_user = results.pk_user;

                    connection.query(
                        "INSERT INTO employees (fk_user, fk_role, password) VALUES (?, ?, ?)",
                        [fk_user, fk_role, encryPass],
                        (error, response) => {
                            if(error){
                                return connection.rollback(() =>{
                                    response.status(500).json({error: error.message});
                                });
                            }
                            connection.commit((err) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        response.status(500).json({ error: err.message });
                                    });
                                }
                                response.status(201).json({ message: "Empleado añadido correctamente" });
                            });
                        }
                    )
                }
            )
        }catch (error) {
            connection.rollback(() => {
                res.status(500).json({ error: error.message });
            });
        }
    });
};

/**
 * @swagger
 * /api/employees/{pk_employee}:
 *   put:
 *     summary: Actualizar un empleado
 *     tags: [Empleados]
 *     description: Esta ruta actualiza los datos de un empleado específico, incluyendo la actualización de datos personales en la tabla de usuarios.
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - fk_role
 *               - status
 *               - currentPassword
 *               - newPassword
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *               phone:
 *                 type: string
 *                 description: Teléfono del usuario
 *               fk_role:
 *                 type: integer
 *                 description: ID del rol del empleado
 *               status:
 *                 type: integer
 *                 description: Estado del empleado 1 o 0
 *               currentPassword:
 *                 type: string
 *                 description: Contraseña actual del empleado (necesaria para validar cambios)
 *               newPassword:
 *                 type: string
 *                 description: Nueva contraseña para el empleado (obligatoria)
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del empleado (obligatoria)
 *     responses:
 *       200:
 *         description: Empleado actualizado correctamente
 *       400:
 *         description: La imagen es obligatoria o algún otro campo falta
 *       401:
 *         description: Contraseña actual incorrecta, ningun cambio se ha guardado
 *       404:
 *         description: Empleado no encontrado
 *       500:
 *         description: Error interno del servidor
 */

const putEmployees = async (request, response) => {
    const { pk_employee } = request.params;
    const { name, email, phone, fk_role, status, currentPassword, newPassword } = request.body;
    const image = request.file ? `users_images/${request.file.filename}` : null;

    if (!image) {
        return response.status(400).json({ error: "La imagen es obligatoria" });
    }
    //console.log("Archivo recibido:", request.file);   !!!
    try {
        connection.query(
            "SELECT * FROM employees WHERE pk_employee = ?",
            [pk_employee], (error, results) => {
                if (error) throw error;

                if (results.length === 0) {
                    return response.status(404).json({ error: "Empleado no encontrado" });
                }

                //Password de bd
                const currentPass = results[0].password;
                //pk de user bd
                const fk_user = results[0].fk_user;

                bcrypt.compare(currentPassword, currentPass, (err, samePassword) => {
                    if (err) return response.status(500).json({ error: err.message });

                    if (!samePassword) {
                        return response.status(401).json({ error: "Contraseña actual incorrecta, ningún cambio se ha guardado." });
                    }

                    // Iniciar transacción
                    connection.beginTransaction((err) => { 
                        if (err) {
                            return response.status(500).json({ error: err.message });
                        }

                        bcrypt.genSalt(10, (err, salt) => {
                            if (err) return connection.rollback(() => response.status(500).json({ error: err.message }));

                            bcrypt.hash(newPassword, salt, (err, newPass) => {
                                if (err) return connection.rollback(() => response.status(500).json({ error: err.message }));

                                connection.query(
                                    "UPDATE users SET name = ?, email = ?, phone = ?, image = ? WHERE pk_user = ?",
                                    [name, email, phone, image, fk_user],
                                    (error) => {
                                        if (error) {
                                            return connection.rollback(() => {
                                                response.status(500).json({ error: error.message });
                                            });
                                        }

                                        connection.query(
                                            "UPDATE employees SET fk_role = ?, status = ?, password = ? WHERE pk_employee = ?",
                                            [fk_role, status, newPass, pk_employee],
                                            (error) => {
                                                if (error) {
                                                    return connection.rollback(() => {
                                                        response.status(500).json({ error: error.message });
                                                    });
                                                }

                                                connection.commit((err) => {
                                                    if (err) {
                                                        return connection.rollback(() => {
                                                            response.status(500).json({ error: err.message });
                                                        });
                                                    }
                                                    response.status(200).json({ message: "Empleado actualizado correctamente" });
                                                });
                                            }
                                        );
                                    }
                                );
                            });
                        });
                    });
                });
            }
        );
    } catch (error) {
        response.status(500).json({ error: error.message });
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
            return response.status(500).json({ success: false, message: "Error en el servidor", error });
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
app.route("/api/employees/:pk_employee").put(verifyToken, upload.single('image'), putEmployees);
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

