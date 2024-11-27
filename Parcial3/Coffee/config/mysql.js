const db = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const connection = db.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQLPORT
});

connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.message);
    } else {
        console.info('Conectado a la base de datos');
    }
});

module.exports = connection;


