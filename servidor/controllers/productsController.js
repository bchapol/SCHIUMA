const bcrypt = require('bcryptjs'); 
const jwt = require("jsonwebtoken"); 
const {connection} = require("../config/config.db");

const getProducts =  (req, res) => {
    connection.query('SELECT * FROM view_products', (error, results) => {
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
    const {fk_provider, fk_category, name, price, stock, description, image} = req.body;

    connection.query('INSERT INTO products (fk_provider, fk_category, name, price, stock, description, image) VALUES (?, ?, ?, ?, ?, ?, ?)', [fk_provider, fk_category, name, price, stock, description, image], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({"New product added": results.affectedRows});
    });
}

const getProductsById = (req, res) => {
    const productId = req.params.product;
    if (!connection) {
        return res.status(500).json({ error: 'Could not establish a connection to the database.' });
    }

    connection.query('SELECT * FROM products WHERE pk_product = ?', [productId], (error, results) => {
        if (error) {            
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json(results);
    });
};

const putProducts = (req, res) => {
    const productId = req.params.product;
    const {fk_provider, fk_category, name, price, stock, description, image} = req.body;

    connection.query('UPDATE products SET fk_provider = ?, fk_category = ?, name = ?, price = ?, stock = ?, description = ?, image = ? WHERE pk_product = ?', [fk_provider, fk_category, name, price, stock, description, image, productId], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({"Product updated": results.affectedRows});
    });
};



module.exports = {
    getProducts,
    postProducts,
    getProductsById,
    putProducts
};