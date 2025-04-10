const {connection} = require("../config/config.db");

const getMovements =  (req, res) => {
    connection.query('SELECT * FROM view_movements', (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json(results);
    });
};

module.exports ={
    getMovements
};