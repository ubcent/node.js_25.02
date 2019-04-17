const passport = require('passport');
const LocalStategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.use('local', new LocalStategy(async (username, password, done) => {
    let user = await User.findOne(username);
    let parsedstring = JSON.stringify(user);

    if (!user) {
        return done(null, false);
        console.log('User Not Found with username ' + username);
    }

    if (User.encryptPass(password) === user.password) {
        delete user.password;
        return done(null, user);
    }

    return done(null, false);
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

const authHandler = passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/auth',
});

module.exports = {
    passport: passport,
    authHandler: authHandler
}