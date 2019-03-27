const request = require('request');
const cheerio = require('cheerio');

function sendRequest(url) {
    return new Promise((resolve, reject) => {
        request(url, (err, req, body) => {
            if(err) {
                reject(err);
            }

            resolve(cheerio.load(body));
        });
    });
}

module.exports = async function fetchNews(url, selector, number) {
    const $newsPage = await sendRequest(url, selector);
    const newsHeads = Array.prototype.slice
                           .call($newsPage(selector[0]), 0)
                           .map(item => ({ 
                               title: $newsPage(item).text().replace(/\n/g, '').trim(), 
                               href: $newsPage(item).attr('href'),
                               }));

    const news = await Promise.all(newsHeads.map(async item => {
        const $item = await sendRequest(item.href);
        const content = $item(selector[1]).eq(0).text().replace(/\n/g, '').trim();
    
        return { ...item, content };
    }));

    return news;
}