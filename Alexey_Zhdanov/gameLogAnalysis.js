const minimist = require('minimist');
const fs = require('fs');

argv = minimist(process.argv.slice(2), {
    alias: {
        log: 'l',
    },
});

if (typeof argv['l'] !== 'string') {
    argv['l'] = 'log.txt'
}

fs.readFile(argv['l'], (err, data) => {
    if (err) {
        console.log("Файд не найден!");
        throw Error;
    }
    /* Структура Log-файла игровой статистики представляет собой JSON
    Парсим и читаем статистику по полям
     */
    records = JSON.parse(data.toString());
    console.log(`Статистика игры:
    Сыграно партий: ${records['games']}
    Количество побед: ${records['wins']}
    Количество проигрышей: ${records['loses']}
    Соотношение побед/проигрышей: ${records['ratio']}
    `)
});
