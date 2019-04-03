const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  title: { type: String },
  href: { type: String },
  content: { type: String },
});

module.exports = mongoose.model('userNews', userSchema);