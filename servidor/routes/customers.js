const express = require('express');
const router = express.Router();

// Middlewares
const verifyToken = require("../middlewares/verifyToken");
const uploadPhotos = require("../middlewares/uploadPhotos");

const uploadProductPhotos = uploadPhotos("images/users");

const {
    getCustomers,
    postCustomers,
    putCustomers,
    getCustomersById
    //deleteCustomers,
    //userCustomers,
    //getPKCustomers,
} = require("../controllers/customersController");

router.get("/api/customers", verifyToken, getCustomers);

router.post("/api/customers", verifyToken, uploadProductPhotos.single('image'), postCustomers);

module.exports = router;
