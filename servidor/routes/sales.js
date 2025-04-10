const express = require('express');
const router = express.Router();

// Middlewares
const verifyToken = require("../middlewares/verifyToken");

const {
    numTransaction,
    createSale
} = require('../controllers/salesController');

router.get("/api/salesTransaction", verifyToken, numTransaction);
router.post("/api/sales", verifyToken, createSale);

module.exports = router;
