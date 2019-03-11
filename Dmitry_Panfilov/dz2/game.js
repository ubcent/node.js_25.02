const commander = require('commander'); // Разбор аргументов
const fs = require('fs');
const readline = require('readline');
const os = require("os");

const resultCode = {
    WIN: 1,
    LOSE: 0,
    ERROR: -1,
    EXIT: 2
};

commander
    .option('-l, --log <path>', 'Log file')
    .parse(process.argv);
    
if (!commander.log) {
    console.error('--log option required!');
    process.exit(resultCode.ERROR);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// The Game
const game = (choice) => {
    const choiceCode = {
        ODD: 1,
        EVEN: 2,
        EXIT: 3
    };

    const random = () => Math.floor(Math.random() * 2 + 1);
    const number = random();
    const result = {
        coin: number,
        choice: choice,
        result: resultCode.ERROR
    };

    switch(choice) {
        case choiceCode.ODD:
        case choiceCode.EVEN:
            result.result = (number === choice) ? resultCode.WIN : resultCode.LOSE;
            break;
        case choiceCode.EXIT:
            result.result = resultCode.EXIT;
            break;
    }
    return result;
}

// Write log
const writeLog = result => {
    const log = result.coin + ' ' + result.choice + os.EOL;
    
    fs.appendFile(commander.log, log, err => {
        if (err)
            console.error(err.message);
    });
};

// Draw menu
const renderMenu = () => {
    console.log('Игра "Орел - Решка"');
    console.log('1 - Орел');
    console.log('2 - Решка');
    console.log('3 - Выход');
    console.log('Удачи!');
};

// Read answers
rl.on('line', cmd => {
    const result = game(parseInt(cmd));
    
    switch(result.result) {
        case resultCode.WIN:
            console.log('Вы победили :)');
            writeLog(result);
            break;
        case resultCode.LOSE:
            console.log('Вы проиграли :(');
            writeLog(result);
            break;
        case resultCode.EXIT:
            console.log('До встречи!');
            rl.close();
            break;
        case resultCode.ERROR:
            console.log('Некорректный ввод.');
    }
});

// Begin
renderMenu();
