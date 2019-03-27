exports.get = async (req, res) => {
    res.render('main', {headline: 'Добро пожаловать'});
}