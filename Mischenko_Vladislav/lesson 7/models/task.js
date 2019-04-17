const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoListSchema = new Schema({
    text: String,
    completed: {type: Boolean, default: false},
});

module.exports = mongoose.model('todolist', todoListSchema);