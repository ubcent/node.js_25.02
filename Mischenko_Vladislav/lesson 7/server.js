const express = require(`express`);
const bodyParser = require(`body-parser`);
const consolidate = require(`consolidate`);
const path = require(`path`);
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');
const connection = require(`./connector.js`);
const Task = require('./models/task');
const User = require('./models/user');

const app = express();
const port = 8080;
const secret = 'JWT firts try';

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(
    path.resolve(__dirname, `public`)
));

function chiferWork(str, salt, type) {
    if (type === 'encode') {
        let key = crypto.createCipher('aes192', salt);
        let chifStr = key.update(str, 'utf8', 'hex');
        chifStr += key.final('hex');
        return chifStr;
    } else if (type === 'decode') {
        let key = crypto.createDecipher('aec192', salt);
        let chifStr = key.update(str, 'hex', 'utf8');
        chifStr += key.final('utf8');
        return chifStr;
    }
}

function identifyUser(req, res, next) {
    if (req.headers.authorization) {
        const [, token] = req.headers.authorization.split(' ');
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                return res.status(403).json({error: 'Wrong token'});
            }

            req.user = decoded;
            next();
        });
    } else {
        res.status(403).json({error: 'No token present'});
    }
}

app.post('/auth', async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({name: username});
    if (user) {
        if (username === user.name && chiferWork(password, 'salt', 'encode') === user.password) {
            const token = jwt.sign({
                id: user._id,
                username: user.name,
            }, secret);
            res.json({token});
        } else {
            res.json({error: 'Wrong credentials'})
        }
    } else {
        res.json({error: `Can't find user ${username}`})
    }
});

app.all('/users', identifyUser);
app.all('/users*', identifyUser);

app.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

app.get('/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
});

app.post('/users', async (req, res) => {
    let user = new User(req.body);
    user = await User.save();

    res.json(user);
});

app.put('/user/:id', async (req, res) => {
    const user = await User.update({_id: req.params.id}, req.body);

    res.json(user);
});

app.patch('/user/:id', async (req, res) => {
    const user = await User.update({_id: req.params.id}, {$set: req.body});

    res.json(user);
});

app.delete('/user/:id', async (req, res) => {
    const user = await User.remove({_id: req.params.id});

    res.json(user);
});

app.listen(port, () => {
    console.log(`Server has been started. Listening port ${port}`);
});