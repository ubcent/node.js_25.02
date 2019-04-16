const request = require('request');
const cheerio = require('cheerio');

request('https://news.ngs.ru/', (err, response, html) => {
    if(!err && response.statusCode === 200) {
        const $ = cheerio.load(html);

        const news = [];

        //через фукцию =>
        $('.ribbon-news-carousel li').each((i, elem) => {
            news[i] = $(elem).text();
        });
    /*
        //на основе примера из документации cheerio
        $('.ribbon-news-carousel li').each(function(i, elem) {
            news[i] = $(this).text();
        });
    */
        console.log('Лента новостей:\n', news.join('\n'));
    }
});