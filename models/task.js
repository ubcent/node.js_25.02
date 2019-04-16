const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  database: 'tasks',
  user: 'root',
  password: 'root',
});

class Task {
  static getAll() {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if(err) {
          reject(err);
        }
        connection.query('SELECT * FROM `tasks` WHERE 1', (err, rows) => {
          if(err) {
            reject(err);
          }

          resolve(rows);
          connection.release();
        });
      });
    });
  }

  static add(task) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if(err) {
          reject(err);
        }
        connection.query('INSERT INTO `tasks` SET ?', task, (err, result) => {
          if(err) {
            reject(err);
          }

          resolve(result.insertId);
        });
      });
    });
  }

  static update() {}

  static complete() {}

  static delete() {}
}

module.exports = Task;