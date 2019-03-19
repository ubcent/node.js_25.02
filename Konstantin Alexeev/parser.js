const request = require('request');
const cheerio = require('cheerio');

request('http://luki.ru/news/572291.html', (err, response, html) => {
    if(!err && response.statusCode === 200) {
        const $ = cheerio.load(html);
        
        console.log('NEWS', $('.post_post_title').eq(0).text());
        console.log( $('time').eq(0).text());
        console.log( $('.body').eq(0).text());
    }
});