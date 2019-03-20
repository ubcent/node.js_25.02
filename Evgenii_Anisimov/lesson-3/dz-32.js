//Консольная программа для перевода слов с английского на русский
//Запуск программы -> node dz=32.js 
const readline = require('readline');
const request = require('request');

console.log("================================================");
console.log("Программа для перевода английиских слов запущена");
console.log("Введите Ваше слово для перевода...");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (cmd) => {

let strRequest = 'https://translate.yandex.net/api/v1.5/tr.json/translate?'
    + 'key=trnsl.1.1.20190320T052823Z.660df3f14688aadb.b94160c883bdbc7a38d4dd136d74b9a35be3e1c9&'
    + 'lang=en-ru&text=' + cmd;

    request(strRequest, (err, response, body) => {
        if(!err && response.statusCode == 200) {           
            console.log("Ваш перевод - слово: " + JSON.parse(body).text[0]);
            console.log("------------------------------------------------");
            console.log("Переведено сервисом «Яндекс.Переводчик»");
            console.log("https://translate.yandex.ru");
            console.log("================================================");
        }
    });
});
