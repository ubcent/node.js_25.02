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

const fetchNews = async(url) => {
    const $newsPage = await sendRequest(url);
    const newsHeads = Array.prototype.slice.call($newsPage('.post__title_link'), 0)
        .map(item => ({ title: $newsPage(item).text().replace(/\n/g, '').trim(), href: $newsPage(item).attr('href') }));
    
    const news = await Promise.all(newsHeads.map(async item => {
        const $item = await sendRequest(item.href);
        const content = $item('.post__text-html').eq(0).text().replace(/\n/g, '').substring(0, 400).trim() + '...';
  
        return { ...item, content };
    }));
  
    return news;
};

module.exports = fetchNews;