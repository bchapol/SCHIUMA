const express = require ("express");
const app = express();
const cors = require('cors');
const socketio = require('socket.io');
const http = require('http');

app.use(express.json());
app.use(express.urlencoded({extended: true}));



/* ROUTES *//*
app.use(require('./routes/roles'));
app.use(require('./routes/users'));*/
app.use(require('./routes/employees'));

const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*'
    }
});

var ahora = new Date();

io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado a las' + ahora);

    socket.on('post', (usuario) => {
        console.log('Un usuario se ha conectado a las' + ahora);
        console.log('El usuario es: ' + usuario);
        socket.broadcast.emit('post', usuario);
    })
    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado');
    });
});

const PORT = process.env.PORT;
app.listen (PORT, () => {
    console.log('El servidor escucha en el puerto: ' + PORT);
});

module.exports = app;