const {UserNews} = require('../models');

module.exports = async function render(req, res) {
    const news = await UserNews.find();
    
    res.render('main', {
        authFlag: false,
        signFlag: false,
        contentFlag: true,
        headline: `Новости с портала`,
        newsFlag: false,
        item: false,
        userNews: true,
        news,
    });
}