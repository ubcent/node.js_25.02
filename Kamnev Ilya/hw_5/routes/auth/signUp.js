const {User} = require('../../models');

exports.post = async (req, res) => {
    let user = {
        username: req.body.username,
        email: req.body.email,
    };

    user = new User(user);

    await user.setPassword(req.body.password);
    await user.save();
}

exports.get = (req, res) => {
    res.render('main', {
        authFlag: false,
        signFlag: true,
        contentFlag: false,
    });
};