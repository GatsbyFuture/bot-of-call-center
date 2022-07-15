const mysql = require('mysql2/promise')
require('dotenv').config({ path: "./environment/.env" });
const config = require('config');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: "Jop13_2001!",
    database: "callcenter",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})
module.exports = {
    pool
}