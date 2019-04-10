exports.get = (req, res) => {
    res.render('main', {        
        authFlag: false,
        signFlag: false,
        contentFlag: true,
        headline: 'Добро пожаловать'});
}