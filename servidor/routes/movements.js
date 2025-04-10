const express = require('express');
const router = express.Router();

// Middlewares
const verifyToken = require("../middlewares/verifyToken");

const {
    getMovements
} = require('../controllers/movementsController');

router.get("/api/movements", verifyToken, getMovements);

module.exports = router;
