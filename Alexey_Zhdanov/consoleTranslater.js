/*
Домашняя работа 3
Консольный переводчик https://www.pravda.ru/news/
*/

const request = require('request');
const readline = require('readline');
const url = require('url');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const keyApi = 'trnsl.1.1.20190319T234303Z.6151ebc124a88ad3.3403921cc07c0d95fa85f93eafbb871fad2bba00';
const urlApi = 'https://translate.yandex.net/api/v1.5/tr.json/translate';

// функция перевода текста eng-ru
function translateText(inputText) {
    const params = url.parse(urlApi, true);
    params.query.key = keyApi;
    params.query.text = inputText;
    params.query.lang = 'en-ru';

    request(url.format(params), (err, res, body) => {
        if ((err)&&(res.statusCode !== 200)) {
            throw Error
        } else {
            console.log(JSON.parse(body).text[0] + '\n')
        }
    });
}

// основной цикл
console.log('===Яндекс.переводчик===' + '\n' + '(для выхода введите "exit")');
rl.on('line', function (cmd) {
    if (cmd === 'exit') {
        console.log("До свидания!");
        process.exit()
    } else {
        // подсмотрел решение у https://github.com/alenka777555
        if (/[a-zA-Z]/.test(cmd)) {
            translateText(cmd);
        }
        else {
            console.log('Введите слов на английском!' + '\n');
        }
    }
});