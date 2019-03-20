// Задание 2

var readline = require('readline');
var request = require('request');

var rl = readline.createInterface({
    input: process.stdin, // ввод из стандартного потока
    output: process.stdout // вывод в стандартный поток
});

function start() {
    console.log('Введите слово на анлийском языке или нажмите q (выход):');
}

start();

rl.on('line', function (cmd) {

    if (cmd === 'q') {
        this.close();
    } else {
        if (/[a-zA-Z]/.test(cmd)) {
            translate(cmd);
        }
        else {
            console.log("Введите слов на английском!");
        }  
    }
});


function translate(text) {
    request('https://translate.yandex.net/api/v1.5/tr.json/translate?'
        + 'key=trnsl.1.1.20160505T191746Z.34dc4dd9c27b1897.e27acf0b35410b8882ecab6c36fc361b4c87a855&'
        + 'lang=en-ru&text=' + text,
        function (err, res, body) {
            if (err) {
                console.log('Ошибка в запросе');
            } else {
                if (res.statusCode === 200) {
                    var data = JSON.parse(body);
                    if (/[а-яА-Я]/.test(data.text[0]) == true) {
                        console.log(data.text[0]);
                    } else {  console.log("Указанное слово не имеет перевода на русский язык."); }
                    start();
                } else {
                    console.log("Ошибка подключения к api");
                }
            }
        }) 
}