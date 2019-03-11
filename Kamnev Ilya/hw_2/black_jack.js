const readline = require('readline');
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
  console.log('Параметры запуска: --start / --s');
  process.exit();
}

if (argv.start) {

  function getStatus() {
    return ('Дилер: ' + dealer.join('') + ' Игрок: ' + player.join(''));
  }

  let dealer = [getCard()];
  let player = [getCard(), getCard()];
      
  if (getSum(player) == 21) {
    console.log('Black Jack на раздаче! $_$');
    rl.close();
  } else {
    console.log('Текущая сумма карт у игрока: ' + getSum(player));
    console.log(getStatus() + ' Хотите ещё карту? y - Да, n - нет');

    rl.on('line', (answer) => {
        //сделаем карту игроку либо прекращаем
        if (answer === 'y') {
          let cardUser = getCard();
          player.push(cardUser);

          console.log('Игрок взял карту: ' + cardUser);
          console.log('Сумма карт у игрока: ' + getSum(player));

          //проверяем нет ли перебора или выигрыша
          sum = getSum(player);
          if (sum > 21) {
            log('Перебор ' + getStatus(), '0:1');
          } else if (sum == 21) {
            log('Black Jack! ' + getStatus(), '1:0');
          } else if (sum < 21) {
            console.log(getStatus() + ' Хотите ещё карту? y - Да, другое - нет');
          }
        } else if (answer === 'n') {
          // игрок закончил брать карты
          // теперь карты берет дилер
          while (getSum(dealer) < 17) {
            dealer.push(getCard());
          }
          // проверяем результат
          let sumDealer = getSum(dealer);
          let sumPlayer = getSum(player);

          if (sumDealer == 21) {
            log('У дилера Black Jack! ' + getStatus(), '0:1');
          } else if (sumDealer > 21) {
            log('У дилера Перебор! ' + getStatus(), '1:0');
          } else if (sumDealer == sumPlayer) {
            log('Ничья! ' + getStatus(), '0:0');
          } else if (sumPlayer > sumDealer) {
            log('Выигрышь :) ' + getStatus(), '1:0');
          } else {
            log('Проигрышь :( ' + getStatus(), '0:1');
          }
        } else {
          console.error('ERROR: Введите y или n. Хотите ещё карту? y - Да, n - нет');
        }
    });
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min +1)) + min;
}

function getCard() {
  let cards = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  return cards [getRandomInt(0, cards.length - 1)];
}

function getSum(hand) {
  let sum = 0;
// сначала считаем все карты кроме тузов
  for (let i = 0; i<hand.length; i++){
    let card = hand[i];
    if (card != 'A') {
      if (card == 'J' || card == 'Q' || card =='K') {
        sum = sum +10;
      } else {
        sum = sum + parseInt(card);
      }
    }
  }
  //туз — 1 или 11  
  for (let i = 0; i<hand.length; i++){
    let card = hand[i];
    if (card == 'A') {
      if (sum > 10) {
        sum = sum +1;
      } else {
        sum = sum + 11;
      }
    }
  }
  return sum;
}

function log(message, status) {
  fs.appendFile('./stat.txt', `${status} (${message})\n`, (err, _) => {
    if (err) throw err;
  });
  console.log(message);
  rl.close();
}