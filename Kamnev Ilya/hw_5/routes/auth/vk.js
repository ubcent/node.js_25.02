const {passport} = require('../../libs/passport');

exports.get = passport.authenticate('vkontakte', { scope: ['email'] });
exports.callback = passport.authenticate('vkontakte', { failureRedirect: '/auth' });