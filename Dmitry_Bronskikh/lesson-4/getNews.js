const cheerio = require('cheerio');
const axios = require('axios');

const getNews = (link, cssTag, idx) => {
    return axios.get(link)
        .then(function (resp) {
            const $ = cheerio.load(resp.data);
            const news = [];
            $(cssTag)
                .each(function () {
                    news.push({title: $(this).text()});
                });
            return (idx) ? news[idx] : news;
        })
        .catch((err) => {
            console.error(err);
        })
};

module.exports = getNews;
