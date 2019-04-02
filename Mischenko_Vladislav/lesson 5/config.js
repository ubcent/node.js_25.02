const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    database: 'baza',
    user: 'uname',
    password: ''
})

module.exports = pool;