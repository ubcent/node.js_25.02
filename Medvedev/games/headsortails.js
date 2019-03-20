const prompt = require('prompt');
const colors = require('colors/safe');

const throwCoin = require("./randomizer");

prompt.message = colors.yellow("Choose!");

prompt.start();

const guess = {
  name: 'ht',
  message: colors.rainbow('head or tail?'),
  validator: /h[ead]*|t[ail]?/,
  warning: 'Must respond h or head and t or tail',
  default: 'head'
};

prompt.get(guess, (err, result) => {
  let throwCoinResult = throwCoin.random();
  console.log(`Coin shows: ${colors.red.underline(throwCoinResult)}`);
  console.log(`Your answer was: ${colors.yellow(result.ht)}`);
  if (throwCoinResult[0] === result.ht[0]) {
    console.log(colors.rainbow('Congratulations, you guessed!'))
  } else {
    console.log('Sorry, Better luck next time')
  }
});