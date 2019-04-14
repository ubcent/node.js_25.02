const crypto = require('crypto');
const mysql = require('mysql');
const config = require('../config');

class User {
    constructor(username, password, id) {
        this._id = id;
        this.username = username;
        this.password = password;
    }

    static findOne(username) {
        return new Promise((resolve, reject) => {
            config.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                }

                connection.query('SELECT * FROM `users` WHERE `username` = ? LIMIT 1', username, (err, rows) => {
                    connection.release();

                    if (err) {
                        reject(err);
                    }
                    resolve({...rows[0]});
                });
            });
        });
    }

    static findById(userid) {
        return new Promise((resolve, reject) => {
            config.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                }

                connection.query('SELECT * FROM `users` WHERE `_id` = ? LIMIT 1', userid, (err, rows) => {
                    connection.release();

                    if (err) {
                        reject(err);
                    }
                    resolve({...rows[0]});
                });
            });
        });
    }

    static encryptPass(password) {
        const mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
        const mystr = mykey.update(password, 'utf8', 'hex');
        return mystr + mykey.final('hex');
    }
}

module.exports = User;