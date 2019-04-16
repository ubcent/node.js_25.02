const mongoose = require('mongoose');
const crypto = require('crypto');
mongoose.connect('mongodb://localhost/users', { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  salt: { type: String },
  passwordHash: { type: String },
  vkontakteId: { type: String },
});

function generatePassword(salt, password) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt,100000, 64, 'sha512', (err, derivedKey) => {
        if (err) return reject(err);
        resolve(derivedKey.toString('hex'));
      }
    );
  });
}

userSchema.methods.setPassword = async function setPassword(password) {
  this.salt = crypto.randomBytes(256).toString('hex');
  this.passwordHash = await generatePassword(this.salt, password);
};

userSchema.methods.checkPassword = async function checkPassword(password) {
  if (!password) return false;

  const hash = await generatePassword(this.salt, password);
  return hash === this.passwordHash;
};

module.exports = mongoose.model('User', userSchema, 'users');