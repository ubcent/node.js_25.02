const pool = require('./config');

class Task {
    static getAll() {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                }

                connection.query('SELECT * FROM `tasks` WHERE 1', (err, rows) => {
                    connection.release();
                    if (err) {
                        reject(err);
                    }

                    resolve(rows);
                });
            });
        });
    }

    static getById(id) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                }

                connection.query('SELECT * FROM `tasks` WHERE id = ?', id, (err, rows) => {
                    connection.release();
                    if (err) {
                        reject(err);
                    }

                    resolve(rows[0]);
                });
            });
        });
    }

    static remove(id) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                }

                connection.query('DELETE FROM tasks WHERE id = ?', id, (err, result) => {
                    connection.release();
                    if (err) {
                        reject(err);
                    }

                    resolve(results.affectedRows);
                })
            });
        });
    }

    static update(title, descr, datka, id) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                }

                connection.query('UPDATE tasks SET title = ?, descr = ?, datka = ? WHERE id = ?', {
                    title,
                    descr,
                    datka,
                    id
                }, (err, result) => {
                    connection.release();
                    if (err) {
                        reject(err);
                    }

                    resolve(result.changedRows);
                })
            });
        });
    }

    static add(task) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                }

                connection.query('INSERT INTO tasks SET ?', task, (err, result) => {
                    connection.release();
                    if (err) {
                        reject(err);
                    }

                    resolve(result.insertId);
                })
            });
        });
    }

    static complete() {

    }
}

module.exports = Task;