const express = require("express");
const router = express.Router();
// Middlewares
const verifyToken = require("../middlewares/verifyToken");

const uploadPhotos = require("../middlewares/uploadPhotos");

const uploadProductPhotos = uploadPhotos("images/users");

const {
    getEmployees,
    postEmployees,
    putEmployees,
    deleteEmployees,
    userEmployees,
    getPKEmployee,
} = require("../controllers/employeesController");

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Obtener todos los empleados
 *     tags: [Empleados]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de empleados
 *       401:
 *         description: No autorizado
 */
router.get("/api/employees", verifyToken, getEmployees);

/**
 * @swagger
 * /api/employees/{pk_employee}:
 *   post:
 *     summary: Agregar un nuevo empleado
 *     tags: [Empleados]
 *     description: Esta ruta agrega un nuevo empleado a la base de datos. La imagen es obligatoria.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pk_employee
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               fk_role:
 *                 type: integer
 *               password:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Empleado añadido correctamente
 *       400:
 *         description: La imagen es obligatoria
 *       500:
 *         description: Error en la transacción o al encriptar la contraseña
 */
router.post("/api/employees", verifyToken, uploadProductPhotos.single('image'), postEmployees);

/**
 * @swagger
 * /api/employees/{pk_employee}:
 *   put:
 *     summary: Actualizar un empleado
 *     tags: [Empleados]
 *     description: Esta ruta actualiza los datos de un empleado específico, incluyendo la actualización de datos personales en la tabla de usuarios.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pk_employee
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - fk_role
 *               - status
 *               - currentPassword
 *               - newPassword
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *               phone:
 *                 type: string
 *                 description: Teléfono del usuario
 *               fk_role:
 *                 type: integer
 *                 description: ID del rol del empleado
 *               status:
 *                 type: integer
 *                 description: Estado del empleado 1 o 0
 *               currentPassword:
 *                 type: string
 *                 description: Contraseña actual del empleado (necesaria para validar cambios)
 *               newPassword:
 *                 type: string
 *                 description: Nueva contraseña para el empleado (obligatoria)
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del empleado (obligatoria)
 *     responses:
 *       200:
 *         description: Empleado actualizado correctamente
 *       400:
 *         description: La imagen es obligatoria o algún otro campo falta
 *       401:
 *         description: Contraseña actual incorrecta, ningun cambio se ha guardado
 *       404:
 *         description: Empleado no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/api/employees/:pk_employee", verifyToken, uploadProductPhotos.single('image'), putEmployees);

/**
 * @swagger
 * /api/employees/{pk_employee}:
 *   delete:
 *     summary: Eliminar un empleado
 *     tags: [Empleados]
 *     description: Esta ruta elimina un empleado al actualizar su estado a 0.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pk_employee
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Empleado eliminado correctamente
 */
router.delete("/api/employees/:pk_employee", verifyToken, deleteEmployees);

/**
 * @swagger
 * /api/user_employees:
 *   post:
 *     summary: Inicio de sesión para un empleado
 *     tags: [Empleados]
 *     description: Esta ruta permite a un empleado iniciar sesión y obtener un JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso, token generado
 *       400:
 *         description: Email y contraseña son requeridos
 *       401:
 *         description: Credenciales incorrectas
 */
router.post("/api/user_employees", userEmployees);

router.get("/api/userdata",  verifyToken, getPKEmployee);

module.exports = router;