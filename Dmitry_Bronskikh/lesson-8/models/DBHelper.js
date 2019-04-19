const mysql = require('mysql');

const pool = mysql.createPool({
    host: '127.0.0.1',
    database: 'node',
    user: 'root',
    port: 3306,
    password: '',
});

const getQuery = (sql, params) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            }
            connection.query(sql, params, (err, result) => {
                if (err) {
                    reject(err);
                }
                connection.release();
                resolve(result);
            })
        });
    });
};

module.exports = getQuery;
