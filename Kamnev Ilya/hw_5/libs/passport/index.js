const passport = require('passport');
const {User} = require('../../models');
const LocalStrategy = require('./local');
const VkStrategy = require('./vk');

passport.use(LocalStrategy);
passport.use(VkStrategy);

passport.serializeUser((user, done) => {
done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
user = await User.findById(id);

done(null, user._id);
});

const authHandler = passport.authenticate('local', {
successRedirect: '/user',
failureRedirect: '/auth',
});

module.exports = { passport, authHandler };