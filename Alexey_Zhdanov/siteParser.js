/*
Домашняя работа 3
Парсер сайта https://www.pravda.ru/news/
*/

const request = require('request');
const cheerio = require('cheerio');

request('https://www.pravda.ru/news/', (err, response, html) => {
   if (!err && response.statusCode === 200) {
       const $ = cheerio.load(html);

       let parsed = 'АКТУАЛЬНЫЕ НОВОСТИ:' + '\n';
       for (let i = 0; i < 20; i++) {
           parsed += '+++++++++++++++++++++++++++++++++++++++' + '\n';
           parsed += $('.article').eq(i).text().replace(/\s{2,}/g, ' ') + '\n';
       }
       console.log(parsed);
   }
});