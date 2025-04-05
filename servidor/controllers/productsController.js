const bcrypt = require('bcryptjs'); 
const jwt = require("jsonwebtoken"); 
const {connection} = require("../config/config.db");

const getProducts =  (req, res) => {
    connection.query('SELECT * FROM view_products WHERE status = 1', (error, results) => {
        if (error) throw error;

        const products = results.map((product) => {
            if (product.image) {
                try {
                    product.image = product.image.toString('base64');
                } catch (err) {
                    console.error("Error al convertir imagen:", err);
                }
            }
            return product;
        });

        res.status(200).json(products);
    });
};

const postProducts = (req, res) => {
    const {fk_provider, fk_category, expiration, name, price, stock, description} = req.body;
    
    connection.query('SELECT image FROM products WHERE pk_product = ?', [pk_product], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const existingProduct = results[0]; // Producto encontrado
        const image = req.file ? `/${req.file.filename}` : existingProduct.image; // Si no se sube nueva imagen, usamos la actual

        if (!image) {
            return res.status(400).json({ error: "La imagen es obligatoria" });
        }
        // Validar el formato de la fecha y convertirlo a YYYY/MM/DD si es necesario
        const formattedExpiration = expiration ? expiration.split("/").join("-") : null;

        // Validación del formato de fecha de expiración (YYYY-MM-DD)
        if (formattedExpiration && isNaN(new Date(formattedExpiration).getTime())) {
            return res.status(400).json({ error: "El formato de la fecha de expiración es incorrecto. Debe ser YYYY/MM/DD." });
        }

        connection.query(
            'INSERT INTO products (fk_provider, fk_category, expiration, name, price, stock, description, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [fk_provider, fk_category, formattedExpiration, name, price, stock, description, image],
            (error, results) => {
                if (error) {
                    console.error("Error en la consulta:", error);
                    return res.status(500).json({ error: error.message });
                }
                console.log("Datos del body:", req.body);
        console.log("Archivo de imagen:", req.file);

                res.status(200).json({ "New product added": results.affectedRows });
        })
    });
    
};

const getProductsById = (req, res) => {
    const pk_product = req.params.pk_product;
    console.log("El id es: " + pk_product);
    connection.query('SELECT * FROM view_products WHERE status = 1 AND pk_product = ?', 
        [pk_product],
        (error, results) => {
        if (error) throw error;
        if (results.length === 0) {
            //console.log("Producto no encontrado");
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        const products = results.map((product) => {
            if (product.image) {
                try {
                    product.image = product.image.toString('base64');
                } catch (err) {
                    console.error("Error al convertir imagen:", err);
                }
            }
            return product;
        });
        console.log("Producto encontrado:", products);
        res.status(200).json(products);
    });
};

const putProducts = (req, res) => {
    const pk_product = req.params.product;
    const { fk_provider, fk_category, expiration, name, price, stock, description } = req.body;
    
    // Primero, obtenemos el producto actual para verificar su imagen
    connection.query('SELECT image FROM products WHERE pk_product = ?', [pk_product], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const existingProduct = results[0]; // Producto encontrado
        const image = req.file ? `/${req.file.filename}` : existingProduct.image; // Si no se sube nueva imagen, usamos la actual

        if (!image) {
            return res.status(400).json({ error: "La imagen es obligatoria" });
        }

        // Ahora, actualizamos el producto
        connection.query('UPDATE products SET fk_provider = ?, fk_category = ?, expiration = ?, name = ?, price = ?, stock = ?, description = ?, image = ? WHERE pk_product = ?', 
            [fk_provider, fk_category, expiration, name, price, stock, description, image, pk_product], 
            (error, results) => {
                if (error) {
                    return res.status(500).json({ error: error.message });
                }
                return res.status(200).json({ "Product updated": results.affectedRows });
            });
    });
};

const deleteProducts = (req, res) => {
    const pk_product = req.params.pk_product;

    connection.query('UPDATE products SET status = 0 WHERE pk_product = ?', 
        [ pk_product], 
        (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({"Product eliminado": results.affectedRows});
    });
};

module.exports = {
    getProducts,
    postProducts,
    getProductsById,
    putProducts,
    deleteProducts
};