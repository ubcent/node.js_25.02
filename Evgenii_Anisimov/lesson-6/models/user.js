const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, default: 'Ivan Ivanov', required: true},
    username: {type: String, required: true},    
    age: {type: Number},
    password: {type: String, required: true} //@TODO: Сделать шифрование пароля с salt/digest (Hmac в Crypto)
});

module.exports = mongoose.model('User', userSchema, 'users');
