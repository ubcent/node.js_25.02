const UserNews = require('../models');

module.exports = async function render(req, res) {
    const news = await UserNews.find();
    
    res.render('main', {
        headline: `Новости с портала`,
        newsFlag: false,
        item: false,
        userNews: true,
        news,
    });
}