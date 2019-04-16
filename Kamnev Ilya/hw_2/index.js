const readline = require('readline');
const chalk = require('chalk');
const fs = require('fs');
var argv = require('minimist')(process.argv.slice(2), {
    alias: {
        start: 's',
        help: 'h',
    }
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

if (argv.help) {
  rl.write(
  `Запустить игру Блэкджек: 
  - npm start
  - node index.js --start / -s`);
  process.exit();
}

if (argv.start) {

  let dealer = [getCard()];
  let player = [getCard(), getCard()];
      
  if (getSum(player) == 21) {
    log('Black Jack на раздаче!','1:0');
  } else {
    console.log(getStatus());
    console.log(chalk.green('Хотите ещё карту? y - Да, n - нет '));

    rl.on('line', (answer) => {
        if (answer === 'y') {
          let cardUser = getCard();
          player.push(cardUser);

          console.log(`\nИгрок взял карту: ${cardUser} \nСумма карт у игрока: ${getSum(player)}\n`);

          //проверяем нет ли перебора или выигрыша
          sum = getSum(player);
          if (sum > 21) {
            log('Перебор\n' + getStatus(), '0:1');
          } else if (sum == 21) {
            log('Black Jack!\n' + getStatus(), '1:0');
          } else if (sum < 21) {
            console.log(getStatus() + '\nХотите ещё карту? y - Да, другое - нет ');
          }
        } else if (answer === 'n') {
          // игрок закончил брать карты
          // теперь карты берет дилер
          while (getSum(dealer) < 17) {
            dealer.push(getCard());
          }
          // проверяем результат
          const sumDealer = getSum(dealer);
          const sumPlayer = getSum(player);

          if (sumDealer == 21) {
            log('У дилера Black Jack!\n' + getStatus(), '0:1');
          } else if (sumDealer > 21) {
            log('У дилера Перебор!\n' + getStatus(), '1:0');
          } else if (sumDealer == sumPlayer) {
            log('Ничья!\n' + getStatus(), '0:0');
          } else if (sumPlayer > sumDealer) {
            log('Выигрышь\n' + getStatus(), '1:0');
          } else {
            log('Проигрышь\n' + getStatus(), '0:1');
          }
        } else {
          console.error('ERROR: Введите y или n');
        }
    });
  }

  function getStatus() {
    return (chalk.yellow(`Дилер: ${dealer.join(', ')} Всего: ${getSum(dealer)}\n` +
            `Игрок: ${player.join(', ')} Всего: ${getSum(player)}`));
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min +1)) + min;
}

function getCard() {
  const cards = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  return cards [getRandomInt(0, cards.length - 1)];
}

function getSum(hand) {
  let sum = hand.reduce((sum, card) => {
    if (card != 'A') {
      if (card == 'J' || card == 'Q' || card =='K') {
        sum = sum +10;
      } else {
        sum = sum + parseInt(card);
      }
    }
    if (card == 'A') {
      if (sum > 10) {
        sum = sum +1;
      } else {
        sum = sum + 11;
      }
    }
    return sum;
  }, 0);
  return sum;
}

function log(message, status) {
  fs.appendFile('./stat.txt', `${status};`, (err, _) => {
    if (err) throw err;
  });
  switch (status) {
    case '1:0': console.log(chalk.green.bold(message)); break;
    case '0:0': console.log(chalk.blue.bold(message)); break;
    case '0:1': console.log(chalk.red.bold(message)); break;
  }
  
  rl.close();
}