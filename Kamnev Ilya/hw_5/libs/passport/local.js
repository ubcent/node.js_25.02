const LocalStrategy = require('passport-local');
const {User} = require('../../models');

module.exports = new LocalStrategy({
    usernameField: 'email',
    },
    async (email, password, done) => {
        let user = await User.findOne({email});

        if(user) {
            const isValidPassword = await user.checkPassword(password);

            if (!isValidPassword) {
                return done(null, false);
            }

            return done(null, user._id);
        } else {
            return done(null, false);
        }
    }
);