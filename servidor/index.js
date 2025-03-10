const express = require("express");
const app = express();
const cors = require('cors');
const socketio = require('socket.io');

// Importar configuración de Swagger
const swaggerSetup = require('./swagger/swagger.js');
swaggerSetup(app);
app.use(cors()); // Habilitar CORS para todas las rutas

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ROUTES */

app.use(require('./routes/roles'));
app.use(require('./routes/users'));
app.use(require('./routes/providers'));
app.use(require('./routes/categories'));
app.use(require('./routes/employees'));

// Agregar la ruta para la documentación de Swagger

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log('El servidor escucha en el puerto: ' + PORT);
});

module.exports = app;
