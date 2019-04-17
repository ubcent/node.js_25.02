const mysql = require('mysql');
const jsdom = require ( 'jsdom') ;   
const { JSDOM } =  jsdom ;   


const pool = mysql.createPool({
  host: 'localhost',
  database: 'tasks',
  user: 'root',
  password: '12345678',
});

class Task {
  static getAll() {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if(err) {
          reject(err);
        } else {
          connection.query('SELECT * FROM `tasks`', (err, rows) => {
            if(err) {
              reject(err);
            }
            connection.release();
            resolve(rows);
          });
        }
      });
    });
  }
 

  static add(task) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if(err) {
          reject(err);
        }
        connection.query('INSERT INTO `tasks`.`tasks` (`tasks`.`task`,`tasks`.`done`) VALUES ("' + task + '", "Нет");',  (err, result) => {
          if(err) {
            reject(err);
          }
          connection.release();
          resolve(result.insertId);
        });
      });
    });
  }

  static update(task) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if(err) {
          reject(err);
        }
        connection.query('UPDATE `tasks`.`tasks` SET `task` = "' + task.newText +  '" WHERE `id` = ' + task.id + ';',  (err, result) => {
          if(err) {
            reject(err);
          }
          connection.release();
          resolve(result);
        });
      });
    });
  }

  static complete(check) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if(err) {
          reject(err);
        } 
        if(check.Check == 'true') {
          connection.query('UPDATE `tasks`.`tasks` SET `done` = "Да" WHERE (`id` = ' + check.id + ');',  (err, result) => {
            if(err) {
              reject(err);
            }
            connection.release();
            resolve(result.insertId);
          });
        } else {
          connection.query('UPDATE `tasks`.`tasks` SET `done` = "Нет" WHERE (`id` = ' + check.id + ');',  (err, result) => {
            if(err) {
              reject(err);
            }
            connection.release();
            resolve(result);
          });
        }
      });
    });
  };


  static delete(action) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if(err) {
          reject(err);
        }
        connection.query('DELETE FROM `tasks`.`tasks` WHERE `id` = ' + action.id + ';',  (err, result) => {
          if(err) {
            reject(err);
          }
          connection.release();
          resolve(result);
        });
      });
    });
  }
}

module.exports = Task;