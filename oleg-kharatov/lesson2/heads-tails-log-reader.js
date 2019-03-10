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
    var total = 0, wins = 0, lose = 0, seqWins = 0, seqLose = 0;
    var is_win, lastResult, curSeq = 0;

    fs.readFile(argv.log, (err, data) => {
        if (err) { console.error(err) };

        data.toString().split('\n').forEach(r => {
            if (r.length > 0) {
                total += 1;

                is_win = r.split(';')[0] == r.split(';')[1];
                if (lastResult != is_win) { seqIsFinish(); }
                curSeq += 1;

                if (is_win) {
                    wins += 1;
                } else {
                    lose += 1;
                }
            }
        });
        seqIsFinish();
        console.log(`Всего игр: ${total}\n` +
            `Выигранных/проигранных: ${wins}/${lose}\n` +
            `Процент побед: ${wins / (wins + lose) * 100}%\n` +
            `Побед/проигрышей подряд: ${seqWins}/${seqLose}`)
    });
}

var seqIsFinish = () => {
    if (lastResult) { seqWins = Math.max(seqWins, curSeq); }
    else { seqLose = Math.max(seqLose, curSeq); }
    lastResult = is_win;
    curSeq = 0;
}