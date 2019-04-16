const fs = require('fs');
const minimist = require('minimist');
const chalk = require('chalk');

const argv = minimist(process.argv.slice(2), {
    alias: {
        logFile: 'f',
    },
});

if (typeof (argv['f']) !== 'string') {
    argv['f'] = 'gameLog.txt';
}

fs.stat(argv['f'], (err) => {
    if (err) {
        console.error(chalk`{red Файл '${argv['f']}' не найден}`);
    } else {
        fs.readFile(argv['f'], (err, data) => {
            if (err) throw err;
            const array = (data.toString().split('\n'));
            let win = 0, loss = 0;
            array.pop();
            for (el of array) {
                (el === 'true') ? win++ : loss++;
            }
            console.log(chalk`
файл: {bold ${argv['f']}}
Проведено игр: {bold ${array.length}}
Побед: {blue ${win}}
Поражений: {red ${loss}}`);
        });
    }
});
