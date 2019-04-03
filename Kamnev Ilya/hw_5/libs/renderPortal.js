const fetchNews = require('./fetchNews');

module.exports = async function render(req, res, portal, newsFlag) {
    const news = await fetchNews(portal.url, portal.selectors);

    news.length = portal.number;
    
    res.render('main', {
        headline: `Новости с портала - ${portal.name}`,
        newsFlag,
        item: !newsFlag,
        news: newsFlag ? news.map((item, idx) => ({ ...item, idx: idx + 1 })) :
                         news[req.params.id - 1],
        userNews: false,
    });
}