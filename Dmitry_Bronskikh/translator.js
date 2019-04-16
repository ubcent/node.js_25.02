const readline = require('readline');
const url = require('url');
const axios = require('axios');
const chalk = require('chalk');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log(chalk`{blue Введите текст для перевода | exit для выхода}`);
rl.on('line', function (cmd) {

    if (cmd === 'exit') {
        rl.close();
    }
    const params = url.parse('https://translate.yandex.net/api/v1.5/tr.json/translate', true);
    params.query = {
        key: 'trnsl.1.1.20190316T180929Z.9f6ed89fb6cd6dab.3715d2df5ca09ae36175411f491f14a0f3083df6',
        lang: 'ru-en',
        text: cmd,
    };

    axios.get(url.format(params))
        .then(function (resp) {
            console.log(chalk`{blue ${resp.data.text.toString()}}`);
        })
        .catch((err) => {
            console.error(chalk`{red ${err}}`);
        });
});
