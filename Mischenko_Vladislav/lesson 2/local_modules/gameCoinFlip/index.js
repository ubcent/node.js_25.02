require('colors');
const readLine = require('readline');
const fs = require('fs');
const lineReader = require('line-reader');

const LOG_FILE_NAME = './local_modules/gameCoinFlip/log.txt';

class  Game {
    constructor() {
        this.machineCoin = Math.floor(Math.random() * 2).toString();
        this.userCoin = '0';
        this.winner = 'machine';
    }

    /*
        Начинаем новую игру
     */
    startGame() {
        console.log('In every moment type \'q\' to exit game. And you will see the statistics of the game.'.blue);
        console.log('Try to guess coin orientation (0/1/q)? '.blue);
        this.getUserAnswer();
    }

    /*
        Начинаем новый раунд игры
     */
    shuffleGame() {
        this.machineCoin = Math.floor(Math.random() * 2).toString();
    }

    /*
        Запрашиваем ответ от пользователя
     */
    getUserAnswer() {
        const rl = readLine.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.on('line', (line) => {
            switch (line) {
                case 'q':
                    rl.close();
                    this.logGetResults();
                    break;
                case '1':
                case '0':
                    this.userCoin = line;
                    this.revealWinner();
                    console.log('Your try %s. Coin was %s. Winner is %s. \n', this.userCoin, this.machineCoin ,this.winner);
                    this.shuffleGame();
                    console.log('Try to guess coin orientation (0/1/q)? '.blue);
                    break;
                default:
                    console.log('Your type incorrect key! Try another...'.red)
            }
        });
    }

    /*
        Определяем победителя раунда
     */
    revealWinner() {
        this.winner = (this.userCoin === this.machineCoin) ? 'user'.green : 'machine'.yellow;
        this.logSetResults();
    }

    /*
        Записываем результаты игры в лог
     */
    logSetResults() {
        const w = (this.winner === 'user'.green) ? 'u' : 'm';
        const flip = {
            u: this.userCoin,
            m: this.machineCoin,
            w: w
        };

        const data = JSON.stringify(flip);
        fs.appendFile(LOG_FILE_NAME, data + '\n', (err) => {
            if(err) throw err;
        });
    }

    /*
        Выводим статистику игр
     */
    logGetResults() {
        let totalCounter = 0;
        let winnerCounter = 0;

        lineReader.eachLine(LOG_FILE_NAME, (line, last) => {
            const flip = JSON.parse(line);

            if(flip.w === 'u') {
                winnerCounter++;
            }
            totalCounter++;

            if(last){
                const winrate = parseFloat(winnerCounter*100/totalCounter).toFixed(2);
                console.log('Your won %s times at %s flips. Your winrate is %s%!', winnerCounter, totalCounter, winrate);

                fs.unlink(LOG_FILE_NAME, (err) => {
                    if(err) throw err;
                });
            }
        });
    }
}

module.exports = new Game();