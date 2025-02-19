const express = require ("express");
const app = express();
const cors = require('cors');
const socketio = require('socket.io');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

/* ROUTES */
app.use(require('./routes/roles'));
app.use(require('./routes/users'));
app.use(require('./routes/employees'));


const PORT = process.env.PORT;
app.listen (PORT, () => {
    console.log('El servidor escucha en el puerto: ' + PORT);
});

module.exports = app;