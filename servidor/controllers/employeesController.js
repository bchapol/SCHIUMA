const bcrypt = require('bcryptjs'); 
const jwt = require("jsonwebtoken"); 
const {connection} = require("../config/config.db");

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

const deleteEmployees = (request, response) => {
    const { pk_employee } = request.params;
    connection.query("UPDATE employees SET status = 0 WHERE pk_employee = ?", [pk_employee], (error, results) => {
        if (error) throw error;
        response.status(200).json({ "Empleado eliminado correctamente.": results.affectedRows });
    });
};

const userEmployees = (request, response) => {
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

const getEmployeesById = (request, response) => {
    response.send("El web socket se ha conectado");
};


module.exports = {
    getEmployees,
    postEmployees,
    putEmployees,
    deleteEmployees,
    userEmployees,
};