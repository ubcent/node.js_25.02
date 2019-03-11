require('colors');
const readLine = require('readline');
const fs = require('fs');
const lineReader = require('line-reader');

const LOG_FILE_NAME = './local_modules/gameBlackJack/log.txt';

class  Game {
    constructor() {
        this.machineCards = [];
        this.userCards = [];
    }

    /*
        Начинаем новую игру
     */
    startGame() {
        console.log('Welcome to the Black Jack game!\nExit game: q\nGet new card: +\nHold cards: -\n'.blue);
        this.getUserAnswer();
        this.shuffleGame();
    }

    /*
        Начинаем новый раунд игры
     */
    shuffleGame() {
        this.machineCards.length = 0;
        this.userCards.length = 0;

        this.machineCards.push(Game.getCard());
        this.userCards.push(Game.getCard());

        console.log(this.getSituation().message);
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
            let state;
            switch (line) {
                case 'q':
                    rl.close();
                    this.logGetResults();
                    break;

                case '+':
                    this.userCards.push(Game.getCard());

                    state = this.getSituation();
                    console.log(state.message);

                    if (state.playerSum >= 21) {
                        this.dealerGame();
                    }
                    break;

                case '-':
                    this.dealerGame();
                    break;

                default:
                    console.log('Your type incorrect key! Try another...'.yellow);
            }
        });
    }

    /*
        Получить новую карту из бесконечной колоды
    */
    static getCard() {
        const deck = {
                names: ['2','3','4','5','6','7','8','9','T','J','Q','K','A'],
                values: [2,3,4,5,6,7,8,9,10,10,10,10,11],
            };
        const i = deck.names.length * Math.random() << 0;
        return {
            name: deck.names[i],
            value: deck.values[i],
        };
    }

    /*
        Отобразить ситуацию за столом. У кого какие карты.
     */
    getSituation() {
        let dealer = this.machineCards.reduce( (prev, curr) => {
            return {m: prev.m + ' ' + curr.name.red, s: prev.s + curr.value};
        }, {m: '', s: 0});

        let player = this.userCards.reduce( (prev, curr) => {
            return {m: prev.m + ' ' + curr.name.green, s: prev.s + curr.value};
        }, {m: '', s: 0});

        let message = `Dealer cards: ${dealer.m}. Total: ${dealer.s.toString().red}. ` +
                      `Player cards: ${player.m}. Total: ${player.s.toString().green}.`;

        return {
            message: message,
            playerSum: player.s,
            dealerSum: dealer.s,
        }
    }

    /*
        Диллер берёт карты.
     */
    dealerGame() {
        this.machineCards.push(Game.getCard());

        let state = this.getSituation();
        console.log(state.message);

        if(state.playerSum <= 21) {
            while (state.dealerSum < 17) {
                this.machineCards.push(Game.getCard());
                state = this.getSituation();
                console.log(state.message);
            }
        }

        let message = 'Your win!';
        let w = 'u';

        if(state.playerSum === state.dealerSum) {
            message = 'Draw game!';
            w = 'd';
        }

        if(state.playerSum > 21) {
            message = 'Your lose!';
            w = 'u';
        }

        if ( (state.dealerSum > state.playerSum) && (state.dealerSum <= 21) ){
            message = 'Your lose!';
            w = 'm';
        }

        message += ' New Game begins...';
        console.log(message.blue);

        this.logSetResults(w);
        this.shuffleGame();
    }

    /*
        Записываем результаты игры в лог
     */
    logSetResults(w) {
        const flip = {
            u: this.userCards,
            m: this.machineCards,
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
        let drawCounter = 0;

        lineReader.eachLine(LOG_FILE_NAME, (line, last) => {
            let flip = JSON.parse(line);

            if(flip.w === 'u') {
                winnerCounter++;
            } else if (flip.w === 'd') {
                drawCounter++;
            }

            totalCounter++;

            if(last){
                console.log('Your won %s times and got draw %s times at %s games.', winnerCounter, drawCounter, totalCounter);

                fs.unlink(LOG_FILE_NAME, (err) => {
                    if(err) throw err;
                });
            }
        });
    }
}

module.exports = new Game();