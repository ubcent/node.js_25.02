const hmac = require('hmac');
const mysql = require('mysql');
var createHmac = require('create-hmac')


const pool = mysql.createPool({
    host: 'localhost',
    database: 'tasks',
    user: 'root',
    password: '12345678',
  });


class User {
	constructor(username, password, id) {
		this.id = id;
    	this.username = username;
    	this.password = password;
  	}

  	static findOne(username){
  		return new Promise((resolve, reject) => {
			pool.getConnection((err, connection) => {
				if(err){
					reject(err);
				}

				connection.query('SELECT * FROM `users` WHERE `username` = ? LIMIT 1', username, (err, rows) => {

					if(err){
						reject(err);
                    }
                   connection.release();	
					resolve(rows);
				});
			});
		});
  	}

  	static findById(userid){
  		return new Promise((resolve, reject) => {
			pool.getConnection((err, connection) => {
				if(err){
					reject(err);
				}

				connection.query('SELECT * FROM `users` WHERE `id` = ? LIMIT 1', userid, (err, rows) => {

					if(err){
						reject(err);
                    }	
                    connection.release();
					resolve(rows);
				});
			});
		});
  	}

  	static encryptPass(password){
        var mystr = createHmac('sha224', password).digest('hex');
		return mystr;
  	}
}

module.exports = User;