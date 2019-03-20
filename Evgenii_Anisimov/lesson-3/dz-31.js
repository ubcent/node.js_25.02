//Консольная программа для получения информации о последних новостей с выбранного вами сайта в структурированном виде

//Запуск парсера -> npm start
const request = require('request');
const cheerio = require('cheerio');

console.log("================================================");
console.log("Программа для получения информации о последних новостях сайта РБК запущена");

function myReq(host, desc){
    request(host, (err, response, html) => {
        if (!err && response.statusCode === 200) {     
            const $ = cheerio.load(html);      
            $(desc).each((i, element) => {
                let title = $(desc).eq(i).text().trim();
                let link = $(desc).eq(i).attr('href');    
                myReqContent(title, link);                
            });
        }
    });    
}

function myReqContent(title, link){    
    request(link, (err, response, html) => {
        if (!err && response.statusCode === 200) {      
            const $ = cheerio.load(html);    
            console.log('-------------');
            console.log(title);
            console.log($('.article__text__overview').eq(0).text().trim());
            console.log("Это все последние новости сайта РБК на настоящий момент");
            console.log("================================================");
        }
    });    
}

myReq('https://www.rbc.ru', '.main__feed.js-main-reload-item > a');
