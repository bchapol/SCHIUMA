const express = require('express');
const router = express.Router();

// Middlewares
const verifyToken = require("../middlewares/verifyToken");
const uploadPhotos = require("../middlewares/uploadPhotos");

const { getProducts, getProductsById, postProducts, putProducts } = require('../controllers/productsController');


router.get('/api/products', verifyToken, getProducts);

router.get('/api/products/:product', verifyToken, getProductsById);

router.post('/api/products', verifyToken, postProducts);

router.put('/api/products/:product', verifyToken, putProducts);

module.exports = router;
