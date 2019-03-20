const fs = require('fs');
const minimist = require('minimist');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const argv = minimist(process.argv.slice(2), {
    alias: {
        log: 'l'
    }
});

// если лог-файл в аргументе прописан, используем путь к нему
if (typeof argv['log'] !== 'string') {
    argv['l'] = 'log.txt';
}

const PlayerChoice = {
    HEAD: 1,
    TAIL: 2,
    EXIT: 3,
};

const FellOut = {
    HEAD: 0,
    TAIL: 1,
};

const MatchResult = {
    WIN: 1,
    LOSE: 2,
};

// метод для красивого вывода текста
function showDesc(descText) {
    let outLineBorder = '';
    for (let i = 0; i < 30; i++) {
        outLineBorder += '=';
    }
    console.log(outLineBorder);
    console.log(descText);
    console.log(outLineBorder);
    console.log('Введите ответ:');
}

function roll() {
    return Math.round(Math.random());
}

function win() {
    showDesc(`Вы победили!`);
    updateLog(MatchResult.WIN);
}

function lose() {
    showDesc(`Вы проиграли!`);
    updateLog(MatchResult.LOSE);
}

// обновление статистики в логе
function updateLog(result) {
    const getLog = fs.readFile(argv['l'], (err, data) => {
        let json = {};
        if (err) {
             data = {
                games: 0,
                wins: 0,
                loses: 0,
                ratio: 0,
            };
             json = data;
        } else {json = JSON.parse(data.toString());}

        // изменим поля статистики
        json['games'] += 1;
        if (result === MatchResult.WIN) {json['wins'] += 1} else {
            json['loses'] += 1
        }
        // вычислим соотношение побед/поражений в блоке перехвата ошибок
        try {
            json['ratio'] = json['wins']/json['loses']
        }  catch (err1) {
            json['ratio'] = json['wins']
        }

        // перезапишем нашу изменённую статистику
        fs.writeFile(argv['l'], JSON.stringify(json), err2 => {
           if (err2) throw Error;
        });
    });
}

// основной метод игры
function game() {
    showDesc(`Добро пожаловать в сверхзанимательную игру "Орёл или Решка!
        1 - загадать орёл
        2 - загадать решку
        3 - выход`);
    rl.on('line', (cmd) => {
        console.log(`Вы ввели: ${cmd}`);
        switch (parseInt(cmd)) {
            case PlayerChoice.HEAD:
                console.log(`Вы загадали орла!`);
                if (roll() === FellOut.HEAD) {win()} else {lose()}
                break;
            case PlayerChoice.TAIL:
                console.log(`Вы загадали решку!`);
                console.log(FellOut.TAIL);
                if (roll() === FellOut.TAIL) {win()} else {lose()}
                break;
            case PlayerChoice.EXIT:
                console.log(`До свидания!`);
                process.exit();
                break;
        }
    });
}

game();

