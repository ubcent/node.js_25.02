const passport = require('passport');
const JWTStrategy = require('./jwt');

passport.use(JWTStrategy);

const authJWTHandler = passport.authenticate('jwt', { session: false });

module.exports = { passport, authJWTHandler };