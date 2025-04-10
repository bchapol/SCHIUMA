const bcrypt = require('bcryptjs'); 
const jwt = require("jsonwebtoken"); 
const { connection } = require("../config/config.db");

// Función que genera el número único
const generateUniqueNumber = async () => {
    let uniqueNumber;
    let exists = true;

    // Mientras el número exista en la base de datos, generamos uno nuevo
    while (exists) {
        uniqueNumber = Math.floor(1000 + Math.random() * 9000); // Generamos el número aleatorio
        exists = await checkIfNumberExists(uniqueNumber); // Verificamos si ya existe
    }
    //console.log("Número único generado:", uniqueNumber);
    return uniqueNumber;
};

// Función para verificar si el número ya existe en la base de datos
const checkIfNumberExists = async (uniqueNumber) => {
    try {
        const result = await connection.query('SELECT num_transaction FROM movements WHERE num_transaction = ?', 
        [uniqueNumber]);
        return result.length > 0; // Si hay resultados, el número ya existe
    } catch (error) {
        console.error('Error al verificar número:', error);
        throw error; // Si hay error en la consulta, lo lanzamos
    }
};

// Ruta para generar el número único
const numTransaction = async (req, res) => {
    try {
        const uniqueNumber = await generateUniqueNumber(); // Generamos el número único
        res.json({ salesNumber: uniqueNumber }); // Devolvemos el número único en la respuesta JSON
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al generar el número único' });
    }
};

// Controlador para insertar una venta con múltiples productos
const createSale = async (req, res) => {
    try {
        const salesData = req.body; // Recibe un array de ventas desde React

        if (!Array.isArray(salesData) || salesData.length === 0) {
            return res.status(400).json({ message: "Datos de venta inválidos." });
        }

        // Extraer el num_transaction del primer elemento (todos deben tener el mismo)
        const numTransaction = salesData[0].num_transaction;

        // Construir la consulta SQL para insertar múltiples filas
        const values = salesData.map(sale => [
            sale.fk_product,
            sale.fk_customer,
            sale.fk_employee,
            sale.quantity,
            sale.date,
            sale.total_price,
            numTransaction // Misma transacción para todos
        ]);

        const sql = `
            INSERT INTO sales (fk_product, fk_customer, fk_employee, quantity, date, total_price, num_transaction)
            VALUES ?`;

        // Ejecutar la consulta con múltiples valores
        connection.query(sql, [values], (error, results) => {
            if (error) {
                console.error("Error al insertar ventas:", error);
                return res.status(500).json({ message: "Error interno del servidor." });
            }
            res.status(201).json({ message: "Ventas registradas con éxito.", results });
        });

    } catch (error) {
        console.error("Error en createSale:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
};


module.exports = { 
    numTransaction,
    createSale
 };
