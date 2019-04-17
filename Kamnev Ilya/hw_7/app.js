const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { passport, authJWTHandler } = require('./libs/passport');
const User = require('./models/user');

const app = express();

app.engine('hbs', hbs({ 
    extname: 'hbs', 
    defaultLayout: 'main', 
    layoutsDir: __dirname + '/views/',
    partialsDir: __dirname + '/views/partials/',
}));
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(passport.initialize());
//app.use(cors({ origin: '*.domain.com' }));

app.get('/', (req, res) => {
    res.render('main', {
        startFlag: true,
    });
});

app.get('/auth', (req, res) => {
    res.render('main', {
        startFlag: false,
        authFlag: true,
    });
});
app.post('/auth', async (req, res ) => {
    const { username, password } = req.body;
    let user = await User.findOne({username});

    if(user) {
        const isValidPassword = await user.checkPassword(password);

        if (!isValidPassword) {
            res.redirect('auth');
            //res.json({ message: 'Wrong credentials' });
        } else {
            const userId = user._id;

            res.json({ 
                accessToken: jwt.sign({userId}, 'secret', { expiresIn: '5s' }),
                refreshToken: user.refreshToken[0].id,
            });
        }
    } else {
        res.redirect('auth');
    }
});

app.post('/signUp', async (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
    });

    await user.setPassword(req.body.password);
    await user.setRefreshToken('-');
    await user.save();

    const userId = user._id;
    res.json({ 
        accessToken: jwt.sign({userId}, 'secret', { expiresIn: '5s' }),
        refreshToken: user.refreshToken[0].id,
    });
});
app.get('/signUp', (req, res) => {
    res.render('main', {
        startFlag: false,
        authFlag: false,
        signFlag: true,
    });
});

app.use('/tasks', authJWTHandler);
app.get('/tasks', (reg, res) => {
    res.render('main', {
        startFlag: false,
        signFlag: false,
        authFlag: false,
        taskFlag: true,
    });
});

app.post('/refresh', async (req, res) => {
    const refresh = req.headers.authorization;
    const user = await User.findOne({ 'refreshToken.id': refresh});
    const newRefreshToken = await user.updateRefreshToken();
    const userId = user._id;

    //TODO добавить выборку токенов по девайсам
    await User.updateOne({ '_id': user._id, 'refreshToken._id': user.refreshToken[0]._id}, 
        { $set: {'refreshToken.$.id':  newRefreshToken}
    });

    res.json({ 
        accessToken: jwt.sign({userId}, 'secret', { expiresIn: '5s' }),
        refreshToken: newRefreshToken,
    });
});

app.listen(8888);