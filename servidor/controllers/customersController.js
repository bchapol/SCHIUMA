const { connection } = require("../config/config.db");

// Obtener todos los clientes
const getCustomers = (req, res) => {
    connection.query('SELECT * FROM view_customers WHERE status = 1', (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        const customers = results.map((customer) => {
            if (customer.image) {
                customer.image = `${customer.image.toString('base64')}`;
            }
            return customer;
        });

        res.status(200).json(customers);
    });
};

// Obtener un cliente por ID
const getCustomersById = (req, res) => {
    const customerId = req.params.pk_customer;

    if (isNaN(customerId)) {
        return res.status(400).json({ error: 'ID de cliente inválido.' });
    }

    connection.query('SELECT * FROM user_customer WHERE pk_customer = ?', [customerId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado.' });
        }

        res.status(200).json(results[0]);
    });
};

// Agregar un nuevo cliente
const postCustomers = (req, res) => {
    const { name, email, phone, rfc, address } = req.body;
    const image = req.file ? `users/${req.file.filename}` : null;

    if (!image) {
        return res.status(400).json({ error: "La imagen es obligatoria" });
    }

    connection.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Insertar en tabla users
        connection.query(
            "INSERT INTO users (name, email, phone, image) VALUES (?, ?, ?, ?)",
            [name, email, phone, image],
            (error1, result1) => {
                if (error1) {
                    return connection.rollback(() => {
                        res.status(500).json({ error: error1.message });
                    });
                }

                const fk_user = result1.insertId;

                // Insertar en tabla customers
                connection.query(
                    "INSERT INTO customers (fk_user, rfc, address) VALUES (?, ?, ?)",
                    [fk_user, rfc, address],
                    (error2) => {
                        if (error2) {
                            return connection.rollback(() => {
                                res.status(500).json({ error: error2.message });
                            });
                        }

                        connection.commit((commitErr) => {
                            if (commitErr) {
                                return connection.rollback(() => {
                                    res.status(500).json({ error: commitErr.message });
                                });
                            }

                            return res.status(201).json({ message: "Cliente añadido correctamente" });
                        });
                    }
                );
            }
        );
    });
};

// Actualizar un cliente por ID
const putCustomers = (req, res) => {
    const { pk_customer } = req.params;
    const { name, email, phone, rfc, address } = req.body;
    const image = req.file ? `users/${req.file.filename}` : null;

    connection.query(
        "SELECT * FROM customers WHERE pk_customer = ?",
        [pk_customer],
        (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: "Cliente no encontrado" });
            }

            connection.beginTransaction((err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                let queryUser = "UPDATE users SET name = ?, email = ?, phone = ? WHERE pk_user = ?";
                let queryParams = [name, email, phone, results[0].fk_user];

                if (image) {
                    queryUser = "UPDATE users SET name = ?, email = ?, phone = ?, image = ? WHERE pk_user = ?";
                    queryParams = [name, email, phone, image, results[0].fk_user];
                }

                connection.query(queryUser, queryParams, (error1) => {
                    if (error1) {
                        return connection.rollback(() => {
                            res.status(500).json({ error: error1.message });
                        });
                    }

                    connection.query(
                        "UPDATE customers SET rfc = ?, address = ? WHERE pk_customer = ?",
                        [rfc, address, pk_customer],
                        (error2) => {
                            if (error2) {
                                return connection.rollback(() => {
                                    res.status(500).json({ error: error2.message });
                                });
                            }

                            connection.commit((commitErr) => {
                                if (commitErr) {
                                    return connection.rollback(() => {
                                        res.status(500).json({ error: commitErr.message });
                                    });
                                }

                                return res.status(200).json({ message: "Cliente actualizado correctamente" });
                            });
                        }
                    );
                });
            });
        }
    );
};

const deleteCustomer = (req, res) => {
  const pk_customer = req.params.pk_customer;

  connection.query('UPDATE users SET status = 0 WHERE pk_user = ?', 
      [ pk_customer], 
      (error, results) => {
      if (error) {
          res.status(500).json({ error: error.message });
          return;
      }
      res.status(200).json({"Product eliminado": results.affectedRows});
  });
};

module.exports = {
    getCustomers,
    getCustomersById,
    postCustomers,
    putCustomers,
    deleteCustomer
};
