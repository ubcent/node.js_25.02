const mysql = require('mysql');
const config = require('../config');

class Task {
    static getAll(userid) {
        return new Promise((resolve, reject) => {
            config.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                }
                connection.query('SELECT * FROM `tasks` WHERE `userid` = ?', userid, (err, rows) => {
                    connection.release();
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
            });
        });
    }

    static getById(taskid) {
        return new Promise((resolve, reject) => {
            config.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                }

                connection.query('SELECT * FROM `tasks` WHERE `id` = ? LIMIT 1', taskid, (err, rows) => {
                    connection.release();

                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                    console.log(rows);
                });
            });
        });
    }

    static add(task) {
        return new Promise((resolve, reject) => {
            config.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                }

                connection.query('INSERT INTO `tasks` SET ?', task, (err, result) => {
                    connection.release();

                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                    console.log(result.insertId);
                });
            });
        });

    }

    static remove(taskid) {
        return new Promise((resolve, reject) => {
            config.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                }

                connection.query('DELETE FROM `tasks` WHERE `id` = ?', taskid, (err, result) => {
                    connection.release();

                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                    console.log(result);
                });
            });
        });
    }

    static update(task) {
        return new Promise((resolve, reject) => {
            config.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                }

                connection.query('UPDATE `tasks` SET `content` = ? WHERE `id` = ?', task, (err, result) => {
                    connection.release();

                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                    console.log(result);
                });
            });
        });
    }

    static complete(taskid) {
        return new Promise((resolve, reject) => {
            config.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                }

                connection.query('UPDATE `tasks` SET `status` = "done" WHERE `id` = ?', taskid, (err, result) => {
                    connection.release();

                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                    console.log(result);
                });
            });
        });
    }

    static prioritize(taskid) {
        return new Promise((resolve, reject) => {
            config.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                }

                connection.query('UPDATE `tasks` SET `priority` = "1" WHERE `id` = ?', taskid, (err, result) => {
                    connection.release();

                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                    console.log(result);
                });
            });
        });
    }
}

module.exports = Task;