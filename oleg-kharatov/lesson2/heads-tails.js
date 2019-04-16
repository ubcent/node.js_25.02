const readline = require('readline');
const fs = require('fs');
var argv = require('minimist')(process.argv.slice(2), {
    alias: {
        log: 'l',
        help: 'h',
    }
});

if (argv.help) {
    help();
}

if (argv.log) {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    
    gameProcess(argv.log);
}

function gameProcess(log) {
    rl.question('Отгадайте 1 или 0. Для выхода введите q\n', (answ) => {
        var predict = parseInt(answ);

        if (predict == 0 || predict == 1) {
            if (play(predict, log)) {
                rl.write('Поздравляем с победой!\n');
            } else {
                rl.write('Вы не выйграли, но поробуйте еще раз...\n');
            }
        } else if (answ == "q") {
            process.exit();
        }
        else {
            rl.write('Вы ввели некорретное значение!\n');
        }

        gameProcess(log);
    });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function play(predict, log) {
    var fact = getRandomInt(0, 2);
    fs.appendFile(log, `${predict};${fact}\n`,(err, _) => {
        if (err){console.error(err)};
    });
    return predict == fact
}

function help() {
    console.log('Параметры запуска:\n --log=[имя лог файла]');
    process.exit();
}