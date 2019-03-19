const request = require('request');
const urlutils = require('url');
const readline = require('readline');

const apiUrl = 'https://translate.yandex.net/api/v1.5/tr.json/translate';
const apiKey = 'trnsl.1.1.20190319T192737Z.841f1d82df12e68d.311b97dc37c6a7502ed11e738ba884cfd0b6ab21';
const lang = ['ru-en', 'en-ru'];
var workMode = 0;
var changeMode = false;

console.log(
    'Для выхода из программы введите qqq\n' +
    'Для смены режима введите chlang\n'
);

// Создаем основу URL
const url = urlutils.parse(apiUrl, true);
//Добавляем ключ API
url.query.key = apiKey;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
//Для выхода из программы надо ввести qqq
//Для смены режима chlang
const askPhrase = () => {
    process.stdout.write(`${lang[workMode]}: `)
    rl.on('line', (answ) => {
        if (changeMode) {
            const intAnsw = parseInt(answ);

            if (!isNaN(intAnsw) &&
                0 <= intAnsw &&
                lang.length > intAnsw) {
                changeMode = false;
                workMode = intAnsw;
                process.stdout.write(`${lang[workMode]}: `);
            } else {
                console.error('Выбран неверный режим работы\nЗакрываюсь');
                process.exit();
            }

        } else if (answ == 'chlang') {
            changeMode = true;
            const question = `Укажите режим работы\n`;
            lang.forEach((element, i) => {
                question += `  ${i}: ${element}\n`;
            });
            console.log(question)
        } else if (answ == 'qqq') {
            process.exit();
        } else {
            url.query.lang = lang[workMode];
            url.query.text = answ;

            request(urlutils.format(url), (err, res) => {
                if (!err && res.statusCode == 200){
                    console.log(JSON.parse(res.body).text.toString());
                } else {
                    console.error(err);
                }
                process.stdout.write(`${lang[workMode]}: `);
            })
        }
    })
}


askPhrase();


