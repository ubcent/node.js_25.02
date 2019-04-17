const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const consolidate = require('consolidate');
const path = require('path');

const mongoose = require('mongoose');
const { Task, User } = require('./models');

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

mongoose.connect('mongodb://127.0.0.1:3001/test', { useNewUrlParser: true });

app.get('/users', jsonParser, async (req, res) => {
    const users = await User.find();
    res.render('userList', { users});
});

app.post('/users', urlencodedParser, async (req, res) => {
    let user = new User(req.body);
    user = await user.save();
    const users = await User.find();
    res.render('userList', { users });
});

app.get('/users/del/:id', async (req, res) => {
    const user = await User.findOne({ "_id": req.params.id });
    res.render('userDel', { user });
});

app.post('/users/del/:id', urlencodedParser, async (req, res) => {
    const user = await User.deleteOne({ "_id": req.params.id });
    const users = await User.find();
    res.render('userList', { users });
});

app.get('/users/edit/:id', async (req, res) => {
    const user = await User.findOne({ "_id": req.params.id });
    res.render('userEdit', { user });
});

app.post('/users/edit/:id', urlencodedParser, async (req, res) => {
    const user = await User.updateOne({ "_id": req.params.id}, { $set: req.body });
    const users = await User.find();
    res.render('userList', { users });
});

app.listen(5000);
