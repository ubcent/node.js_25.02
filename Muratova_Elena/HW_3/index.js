// Задание 1

var request = require('request');
var cheerio = require('cheerio');

var iconv = require('iconv-lite');

request('https://ok-inform.ru/tags/%D0%9C%D1%83%D1%80%D0%B8%D0%BD%D0%BE.html', function (error, response, html){
    if (!error && response.statusCode === 200) {
        var $ = cheerio.load(html);
        $('.ok-articles-wide-list li').each(function () {
            var title = $(this).find('a').text();
            var anons = $(this).find('p').text();
            console.log(title, '\n'); 
            console.log(anons, '-------------------------------------\n');
        })
    }
});