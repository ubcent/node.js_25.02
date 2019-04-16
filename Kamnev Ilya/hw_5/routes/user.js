const mustBeAuthenticated = (req, res, next) => {
    if(req.user) {
        next();
    } else {
        res.redirect('/auth');
    }
}

exports.all = mustBeAuthenticated;

exports.get = (req, res) => {
    res.render('main', {
        authFlag: false,
        signFlag: false,
        contentFlag: true,
    });
};