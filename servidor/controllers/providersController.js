const bcrypt = require('bcryptjs'); 
const jwt = require("jsonwebtoken"); 
const {connection} = require("../config/config.db");


const getProviders =  (req, res) => {
    connection.query('SELECT * FROM view_providers WHERE status = 1', (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }

        const providers = results.map((provider) => {
            // Verificar si hay una imagen guardada
            if (provider.image) {
                // Si la imagen existe, obtenemos el archivo binario de la base de datos
                provider.image = `${provider.image.toString('base64')}`;
            }
            return provider;
        });

        res.status(200).json(providers);
    });
};

const getProvidersById = (req, res) => {
    const providerId = req.params.pk_provider;
    if (!connection) {
        return res.status(500).json({ error: 'Could not establish a connection to the database.' });
    }

    connection.query('SELECT * FROM view_providers WHERE pk_provider = ?', [providerId], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json(results);
    });
};

const postProviders = (req, res) => {
    const { name, email, phone } = req.body;
    const image = req.file ? `users/${req.file.filename}` : null;
  
    if (!image) {
      return res.status(400).json({ error: "La imagen es obligatoria" });
    }
  
    // Insertar en tabla users
    connection.query(
      "INSERT INTO users (name, email, phone, image) VALUES (?, ?, ?, ?)",
      [name, email, phone, image],
      (error1, result1) => {
        if (error1) {
          return res.status(500).json({ error: error1.message });
        }
  
        const fk_user = result1.insertId;
  
        // Insertar en tabla employees
        connection.query(
          "INSERT INTO providers (fk_user) VALUES (?)",
          [fk_user],
          (error2) => {
            if (error2) {
              return res.status(500).json({ error: error2.message });
            }
  
            return res.status(201).json({ message: "Empleado añadido correctamente" });
          }
        );
      }
    );
  };
  

  const putProviders = (req, res) => {
    const { pk_provider } = req.params; // Obtener el ID del proveedor desde los parámetros
    const { name, email, phone } = req.body;
    const image = req.file ? `users/${req.file.filename}` : null; // Verificar si se subió una nueva imagen
  
    // Validación si el proveedor existe en la base de datos
    connection.query(
      "SELECT * FROM providers WHERE pk_provider = ?",
      [pk_provider],
      (error, results) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ error: "Proveedor no encontrado" });
        }
  
        // Iniciar transacción
        connection.beginTransaction((err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
  
          // Actualizar la tabla users si se proporciona una nueva imagen
          let queryUser = "UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?";
          let queryParams = [name, email, phone, results[0].fk_user];
  
          if (image) {
            queryUser = "UPDATE users SET name = ?, email = ?, phone = ?, image = ? WHERE id = ?";
            queryParams = [name, email, phone, image, results[0].fk_user];
          }
  
          connection.query(queryUser, queryParams, (error1) => {
            if (error1) {
              return connection.rollback(() => {
                res.status(500).json({ error: error1.message });
              });
            }
  
            // Actualizar la tabla providers si es necesario
            connection.query(
              "UPDATE providers SET fk_user = ? WHERE pk_provider = ?",
              [results[0].fk_user, pk_provider],
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
  
                  return res.status(200).json({ message: "Proveedor actualizado correctamente" });
                });
              }
            );
          });
        });
      }
    );
  };
  
  module.exports = {
    putProviders
  };
  

module.exports = {
    getProviders,
    getProvidersById,
    postProviders,
    putProviders
};