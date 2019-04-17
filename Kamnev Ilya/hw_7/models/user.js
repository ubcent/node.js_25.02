const mongoose = require('mongoose');
const crypto = require('crypto');
mongoose.connect('mongodb://localhost/user_tasks', { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    salt: { type: String },
    passwordHash: { type: String },
    refreshToken: [{
        device: String,
        id: {
            type: String,
            required: true,
        }, 
        time: {
            type: Date,
            default: Date.now,
            //TODO задать время жизни
        }
    }],
    tasks: [{
        idTask: Number,
        title: String,
        text: String,
        created: {
            type: Date,
            default: Date.now,
        },
    }],
});

function encryptPassword(salt, password) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt,100000, 64, 'sha512', (err, derivedKey) => {
            if (err) return reject(err);
            resolve(derivedKey.toString('hex'));
        });
    });
}

userSchema.methods.setPassword = async function setPassword(password) {
    this.salt = crypto.randomBytes(256).toString('hex');
    this.passwordHash = await encryptPassword(this.salt, password);
};

userSchema.methods.checkPassword = async function checkPassword(password) {
    if (!password) return false;

    const hash = await encryptPassword(this.salt, password);
    return hash === this.passwordHash;
};

userSchema.methods.setRefreshToken = async function setRefreshToken(device) {
    //TODO ограничить кол-во девайсов
    this.refreshToken.push({
        device,
        id: crypto.randomBytes(16).toString('hex'),
    });
};

userSchema.methods.updateRefreshToken = async function updateRefreshToken() {
    const newToken = crypto.randomBytes(16).toString('hex');

    return newToken;
};

module.exports = mongoose.model('User', userSchema, 'user_tasks');