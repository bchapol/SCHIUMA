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
    getCustomersById,
    deleteCustomer,
    //userCustomers,
    //getPKCustomers,
} = require("../controllers/customersController");

router.get("/api/customers", verifyToken, getCustomers);

router.post("/api/customers", verifyToken, uploadProductPhotos.single('image'), postCustomers);

router.get("/api/customers/:pk_customer", verifyToken, getCustomersById);

router.put("/api/customers/:pk_customer", verifyToken, uploadProductPhotos.single('image'), putCustomers);

router.delete("/api/customers/:pk_customer", verifyToken, deleteCustomer);

module.exports = router;
