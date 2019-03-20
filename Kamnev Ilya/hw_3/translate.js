const key = require('./config');
const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const prompt = {
    exit: 'Для выхода введите: q',
    translate: 'Для перевода наберите текст:',
}

const urlYandex = 'https://translate.yandex.net/api/v1.5/tr.json/translate?';

const params = new URLSearchParams({
    key: key.yandex,
    text: '',
    lang: 'ru-en',
    format: 'plain',
});

console.log(`${prompt.exit}\n${prompt.translate}`);

rl.on('line', (word) => {
    if (word === 'q') {
        rl.close();
    } else {
        params.set('text', word);

        https.get(`${urlYandex}${params.toString()}`, (res) => {
            res.on('data', (d) => {
                const data = JSON.parse(d);

                if (data.code !== 200) {
                    console.log(`${data.message}\n${prompt.exit}\n${prompt.translate}`);
                } else {
                    console.log(`Перевод: ${data.text[0]}`);
                }                
            });
        }).on('error', (e) => {
            console.log(`Got error ${e.message}`);
        });
    }
});