const bcrypt = require('bcryptjs'); 
const jwt = require("jsonwebtoken"); 
const {connection} = require("../config/config.db");


const getCustomers =  (req, res) => {
    connection.query('SELECT * FROM view_customers WHERE status = 1', (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }

        const customers = results.map((customer) => {
            // Verificar si hay una imagen guardada
            if (customer.image) {
                // Si la imagen existe, obtenemos el archivo binario de la base de datos
                customer.image = `${customer.image.toString('base64')}`;
            }
            return customer;
        });

        res.status(200).json(customers);
    });
};

// Obtener un cliente por ID
const getCustomersById = (req, res) => {
    const customerId = req.params.customer;
    if (!connection) {
        return res.status(500).json({ error: 'Could not establish a connection to the database.' });
    }

    connection.query('SELECT * FROM customers WHERE pk_customer = ?', [customerId], (error, results) => {
        if (error) {            
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json(results);
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
    const customerId = req.params.customer;
    const {fk_user, rfc, address} = req.body;

    connection.query('UPDATE customers SET fk_user = ?, rfc = ?, address = ? WHERE pk_customer = ?', [fk_user, rfc, address, customerId], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({"Customer updated": results.affectedRows});
    });
};

module.exports = {
    getCustomers,
    getCustomersById,
    postCustomers,
    putCustomers
};
