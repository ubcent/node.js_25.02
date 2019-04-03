const mysql = require('mysql');

const pool = mysql.createPool({
    host: '127.0.0.1',
    database: 'node',
    user: 'root',
    port: 3306,
    password: '',
});

const tableName = 'tasks';

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
                resolve(result);
                connection.release();
            })
        });
    });
};

class Task {

    static getAll() {
        return getQuery(`SELECT * FROM  ${tableName}`);
    }

    static async getOn(id) {
        const result = await getQuery(`SELECT * FROM  ${tableName} WHERE id = ?`, id);
        return result[0];
    }

    static async add(obj) {
        const result = await getQuery(`INSERT INTO ${tableName} SET ?`, obj);
        return result.insertId;
    }

    static async delete(id) {
        const result = await getQuery(`DELETE FROM ${tableName} WHERE  id = ?`, id);
        return result.affectedRows;
    }

    static update(obj) {
        return getQuery(`UPDATE ${tableName} SET ? WHERE id =?`, [obj, obj.id]);
    }
}

module.exports = Task;
