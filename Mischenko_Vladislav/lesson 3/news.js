const request = require('request');
const cheerio = require('cheerio');

request('https://habr.com/ru/', (err, response, html) => {
    if (!err && response.statusCode === 200) {
        const $ = cheerio.load(html);

        $('.posts_list').each(function () {
            let news = {};
            news.time = $(this).find('.post__time').text();
            news.title = $(this).find('.post__title').text();
            news.description = $(this).find('.post__text').text();

            console.log(`Дата: ${news.time}\nЗаголовок: ${news.title}\nСодержание: ${news.description}\n`);
        });

    } else if (err) {
        console.log('Не удалось получить страницу из за следующей ошибки: ' + err);
    }
});