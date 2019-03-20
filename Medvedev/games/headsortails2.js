const readline = require('readline');
const colors = require('colors/safe');
const randomizer = require('./randomizer');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let score = 0;
let tries = 0;
const inputInstruction = `
input: ${colors.blue('yes')} or ${colors.blue('y')} to play one more time, ${colors.blue('score')} for score, 
${colors.blue('no')} or ${colors.blue('n')} or ${colors.blue('exit')} to leave the game`;

console.log(colors.rainbow('Hi, Shall we play head or tail game?'));
console.log('possible answers: yes or y, no or n, exit');

rl.on('line', (cmd) => {
  if (cmd === 'exit' || cmd === 'no' || cmd === 'n') {
    console.log('goodbye');
    score = 0;
    fs.writeFile('score.txt', score, err => {
      if (err) {
        console.log('file score.txt writing error')
      }
    })
    rl.close();
  } else if (cmd === 'yes' || cmd === 'y') {
    const guess =
      `    ${colors.rainbow('What does the coin says?)) Head or tail?')} 
    Just input: ${colors.red('head')} or ${colors.red('h')}, ${colors.green('tail')} or ${colors.green('t')} and check your luck
    `;
    rl.question(guess, (answer) => {
      const coinFlipResult = randomizer.random();
      if (answer[0] === coinFlipResult[0]) {
        score++;
        tries++;
        let data = `Wins: ${score}. Tries: ${tries}. Percentage of wins: ${score/tries*100}%`
        fs.writeFile('score.txt', data, err => {
          if (err) {
            console.log('file score.txt writing error')
          }
        })
        console.log(`${colors.rainbow('Congratulations.')} Coin shows: ${coinFlipResult} Your answer: ${answer}`)
        console.log(inputInstruction);
      } else {
        tries++;
        let data = `Wins: ${score}. Tries: ${tries}. Percentage of wins: ${score/tries*100}%`
        fs.writeFile('score.txt', data, err => {
          if (err) {
            console.log('file score.txt writing error')
          }
        })
        console.log(`${colors.red('Sorry((')} Coin shows: ${coinFlipResult} Your answer: ${answer}`)
        console.log(inputInstruction);
      }
    })
  } else if (cmd === 'score') {
    fs.readFile('score.txt', (err, data) => {
      if (err) {
        throw err("you either haven't guessed yet, or file doesn't exist")
      }
      console.log(colors.rainbow(data.toString()));
      console.log(inputInstruction);
    })
  }
});