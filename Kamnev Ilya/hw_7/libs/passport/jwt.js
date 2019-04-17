const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../../models/user');

module.exports = new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret',
    //issuer: 'accounts.examplesoft.com',
    //audience: 'yoursite.net',
}, async (jwt_payload, done) => {
    const userId = jwt_payload.userId;
    const user =  await User.findOne({_id: userId});

    if (user) {
        return done(null, user);
    } else {
        return done(null, false);
        // or you could create a new account
    }
});