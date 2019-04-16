const cheerio = require('cheerio');
const axios = require('axios');

const getNews = (link, cssTag) => {
    return axios.get(link)
        .then(function (resp) {
            const $ = cheerio.load(resp.data);
            const news = [];
            $(cssTag)
                .each(function () {
                    console.log($(this).text());
                });
        })
        .catch((err) => {
            console.error(err);
        })
};

getNews('https://meduza.io', 'div.TopicBlock-content span.BlockTitle-first');
