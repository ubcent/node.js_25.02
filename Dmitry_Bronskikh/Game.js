const fs = require('fs');
const readline = require('readline');
const chalk = require('chalk');
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2), {
    alias: {
        logFile: 'f',
    },
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

class Game {
    constructor(logFile = 'gameLog.txt') {
        this.arrVal = ['1', '2'];
        this.logFile = logFile;
        this.run(this.arrVal, this.logFile);
    }

    run(arrVal, logFile) {
        console.log('Введите 1 (Орел), 2 (Решка) или exit (для выхода):');
        rl.on('line', function (cmd) {
            const rand = Math.floor(Math.random() * arrVal.length);
            if (cmd === 'exit') {
                rl.close();
            } else if (arrVal.indexOf(cmd) !== -1) {
                if (cmd === arrVal[rand]) {
                    console.log(chalk`{green вы выграли!}`);
                    fs.appendFile(logFile, `true\n`, function (err) {
                        if (err) throw err;
                    });
                } else {
                    console.log(chalk`{blue вы проиграли!}`);
                    fs.appendFile(logFile, `false\n`, function (err) {
                        if (err) throw err;
                    });
                }
            } else {
                console.log(chalk`{red Некорректное значение, повторите ввод}`);
            }
        });
    }
}

if (typeof (argv['f']) === 'string') {
    new Game(argv['f']);
} else {
    new Game();
}
