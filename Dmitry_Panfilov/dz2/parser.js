const commander = require('commander'); // Разбор аргументов
const fs = require('fs');
const readline = require('readline');

commander
    .option('-p, --path <path>', 'Log file')
    .parse(process.argv);
    
if (!commander.path) {
    console.error('--path option required!');
    process.exit(-1);
}

const rl = readline.createInterface({
  input: fs.createReadStream(commander.path),
  crlfDelay: Infinity
});

const stats = {
    wins: 0,
    loses: 0,
    winSeq: 0,
    loseSeq: 0
};

let seqWin = 0;
let seqLose = 0;

rl.on('line', (line) => {
    const result = line.split(' ', 2).map(v => parseInt(v));
    if (result[0] === result[1]) {
        stats.wins++;
        seqWin++;
        seqLose = 0;
        stats.winSeq = stats.winSeq < seqWin ? seqWin : stats.winSeq;
    } else {
        stats.loses++;
        seqLose++;
        seqWin = 0;
        stats.loseSeq = stats.loseSeq < seqLose ? seqLose : stats.loseSeq;
    }
});

rl.on('close', () => {
    console.log('Всего игр:', stats.wins + stats.loses);
    console.log('Выигрышей:', stats.wins);
    console.log('Проигрышей:', stats.loses);
    console.log('Максимально выигрышей подряд:', stats.winSeq);
    console.log('Максимально проигрышей подряд:', stats.loseSeq);
});
