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
    const image = request.file ? `products/${request.file.filename}` : null;

    if (!image) {
        return response.status(400).json({ error: "La imagen es obligatoria" });
    }

    connection.query('INSERT INTO products (fk_provider, fk_category, expiration, name, price, stock, description, image) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [fk_provider, fk_category, expiration, name, price, stock, description, image], 
        (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({"New product added": results.affectedRows});
    });
};

const getProductsById = (req, res) => {
    const pk_product = req.params.product;
    connection.query('SELECT * FROM view_products WHERE status = 1 AND pk_product = ?', 
        [pk_product],
        (error, results) => {
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

const putProducts = (req, res) => {
    const pk_product = req.params.product;
    const {fk_provider, fk_category, expiration, name, price, stock, description} = req.body;
    const image = request.file ? `products/${request.file.filename}` : null;

    if (!image) {
        return response.status(400).json({ error: "La imagen es obligatoria" });
    }
    connection.query('UPDATE products SET fk_provider = ?, fk_category = ?, expiration = ?, name = ?, price = ?, stock = ?, description = ?, image = ? WHERE pk_product = ?', 
        [fk_provider, fk_category,expiration, name, price, stock, description, image, pk_product], 
        (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({"Product updated": results.affectedRows});
    });
};

const deleteProducts = (req, res) => {
    const pk_product = req.params.product;
    const {status} = req.body;

    connection.query('UPDATE products SET status = ? WHERE pk_product = ?', 
        [status, pk_product], 
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