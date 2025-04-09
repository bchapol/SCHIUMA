const express = require('express');
const router = express.Router();

// Middlewares
const verifyToken = require("../middlewares/verifyToken");
const upload = require("../middlewares/uploadPhotos");

const uploadProductPhotos = upload("images/customers");

const { 
    getCustomers
} = require('../controllers/customersController');

router.get('/api/customers', verifyToken, getCustomers);

module.exports = router;
