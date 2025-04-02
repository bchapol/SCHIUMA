const express = require('express');
const router = express.Router();

// Middlewares
const verifyToken = require("../middlewares/verifyToken");
const uploadPhotos = require("../middlewares/uploadPhotos");

const { 
    getProducts,
    postProducts,
    getProductsById,
    putProducts,
    deleteProducts
} = require('../controllers/productsController');

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos
 *       401:
 *         description: No autorizado
 */
router.get('/api/products', verifyToken, getProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Agregar un nuevo producto
 *     tags: [Productos]
 *     description: Esta ruta agrega un nuevo producto a la base de datos. La imagen es obligatoria.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fk_provider:
 *                 type: integer
 *               fk_category:
 *                 type: integer
 *               name:
 *                 type: string
 *               expiration:
 *                 type: string
 *                 format: date
 *               price:
 *                 type: number
 *                 format: float
 *               stock:
 *                 type: integer
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Producto añadido correctamente
 *       400:
 *         description: La imagen es obligatoria o faltan datos
 *       500:
 *         description: Error en la transacción
 */
router.post('/api/products', verifyToken, uploadPhotos.single('image'), postProducts);

/**
 * @swagger
 * /api/products/{product}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: product
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Información del producto
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: No autorizado
 */
router.get('/api/products/:product', verifyToken, getProductsById);

/**
 * @swagger
 * /api/products/{product}:
 *   put:
 *     summary: Actualizar un producto
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: product
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fk_provider:
 *                 type: integer
 *               fk_category:
 *                 type: integer
 *               name:
 *                 type: string
 *               expiration:
 *                 type: string
 *                 format: date
 *               price:
 *                 type: number
 *                 format: float
 *               stock:
 *                 type: integer
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error en la transacción
 */
router.put('/api/products/:product', verifyToken, putProducts);

/**
 * @swagger
 * /api/products/{product}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: product
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error en la transacción
 */
router.delete('/api/products/:product', verifyToken, deleteProducts);

module.exports = router;
