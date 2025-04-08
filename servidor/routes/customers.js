const express = require('express');
const router = express.Router();

// Middlewares
const verifyToken = require("../middlewares/verifyToken");
const upload = require("../middlewares/uploadPhotos");

const uploadProductPhotos = upload("images/customers");

const { 
    getProducts,
    postProducts, 
    getProductsById,
    putProducts,
    putProductsAddStock,
    deleteProducts
} = require('../controllers/customersController');


module.exports = router;
