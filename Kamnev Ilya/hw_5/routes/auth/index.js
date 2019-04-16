const {authHandler} = require('../../libs/passport');

exports.get = (req, res) => {
    res.render('main', {
        authFlag: true,
        signFlag: false,
        contentFlag: false,
    });
};

exports.post = authHandler;