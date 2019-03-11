const readline = require('readline');
const fs = require('fs');

fs.readFile('stat.txt', function(err, data) {
    if (err) {
        return;
    }
    var arr = data.toString().split(';');
    parties = 0, w = 0, l = 0, maxCountW = 0, countW = 0,  maxCountL = 0, countL = 0
    parties= arr.length - 1
    for (var res in arr) {
        if (arr[res] === 'w') {
            countL = 0;
            w++;
            countW++;
            if (maxCountW < countW) {
                maxCountW = countW;
            }
        }
        if (arr[res] === 'l') {
            countW = 0;
            l++;
            countL++;
            if (maxCountL < countL) {
                maxCountL = countL;
            }            
        }
    }
    
    console.log('Общее кол-во партий: ' + parties);
    console.log('Кол-во выигранных/проигранных партий: ' + w + "/" + l);
    console.log('Макс. число побед/поражений подряд: ' + maxCountW + '/' + maxCountL);   

    
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('Введите 1 (Орел), 2 (Решка):');

rl.on('line', (cmd) => {
    console.log('Вы ввели: ' + cmd);
    var rand = Math.round(0.5 + Math.random() * (2));
    console.log('ПК загадал: ' + rand);    
    if (cmd == rand) {
        data = "w;";
        console.log('Вы выиграли!');
    } 
    else {
        data = "l;";
        console.log('Вы проиграли(');
     
    }    
    fs.appendFile('stat.txt', data, function(err){
        if (err) {
            throw err;
        }
    });
});
