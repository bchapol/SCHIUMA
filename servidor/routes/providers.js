const express = require('express');
const router = express.Router();

// Middlewares
const verifyToken = require("../middlewares/verifyToken");
const uploadPhotos = require("../middlewares/uploadPhotos");

const uploadProductPhotos = uploadPhotos("images/users");

const {
    getProviders,
    getProvidersById,
    postProviders,
    putProviders
} = require("../controllers/providersController");

router.get('/api/providers', verifyToken, getProviders)

router.post("/api/providers", verifyToken, uploadProductPhotos.single('image'), postProviders);

router.get("/api/providers/:pk_provider", verifyToken, getProvidersById);

router.put("/api/providers/:pk_provider", verifyToken, uploadProductPhotos.single('image'), putProviders);


module.exports = router;