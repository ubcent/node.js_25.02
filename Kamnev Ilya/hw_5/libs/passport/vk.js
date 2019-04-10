const VKontakteStrategy = require('passport-vkontakte').Strategy;
const {User} = require('../../models');

module.exports = new VKontakteStrategy({
    clientID:     6937221,
    clientSecret: 'yPUuRebA2uItekVDydoy',
    callbackURL:  "http://localhost:8888/auth/vkontakte/callback",
},
async (accessToken, refreshToken, params, profile, done) => {
    const email = params.email;
    let user = await User.findOne({email});

    if (user) {
        return done(null, user);
    } else {
        user = new User({
            username: profile.username,
            email,
            vkontakteId: profile.id,
        });
        user = await user.save();
        return done(null, user);
    }
});