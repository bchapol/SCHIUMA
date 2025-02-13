const express = require ("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


/* ROUTES */
app.use(require('./routes/'));

const PORT = process.env.PORT;
app.listen (PORT, () => {
    console.log('El servidor escucha en el puerto: ' + PORT);
});

module.exports = app;