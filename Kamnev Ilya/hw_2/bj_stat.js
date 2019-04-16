const fs = require('fs');

const file = './stat.txt';

const stat = fs.readFile(file, (err, data) => {
    if(err) { throw err; }
    
    let win = 0, loss = 0;
    const array = data.toString().split(';').slice(0, -1);

    let parties = array.length;

    let before, rowWin = 1, rowLoss = 1, maxWin = 1, maxLoss = 1;

    array.forEach(e => {
        let eArr = e.split(':');

        win += +eArr[0];
        loss += +eArr[1];

        if(eArr[0] !== 0 && eArr[1] !== 0) {

            if (before == undefined) {
                before = eArr[0];
            } else if (before == eArr[0]) {
                eArr[0] == 1 ? rowWin++ : rowLoss++;
            } else {
                before = eArr[0];
                rowWin = 1;
                rowLoss = 1;

            }
            if (rowWin > maxWin) maxWin = rowWin;
            if (rowLoss > maxLoss) maxLoss = rowLoss;
        }
    });

    console.log(`Всего партий: ${parties};\n` +
                `Кол-во побед/поражений: ${win}/${loss};\n` +
                `соотношение: ${win/loss};\n` +
                `побед/поражений подряд: ${maxWin}/${maxLoss}`);
});