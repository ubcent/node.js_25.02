const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/usernews', { useNewUrlParser: true });

const Schema = mongoose.Schema;

const newsSchema = new Schema({
  title: { type: String },
  href: { type: String },
  content: { type: String },
});

module.exports = mongoose.model('userNews', newsSchema, 'usernews');