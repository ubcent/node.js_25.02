const minimist = require('minimist')(process.argv.slice(2));

switch (minimist.game) {
    case 'bj':
        const gameBJ = require('./local_modules/gameBlackJack');
        gameBJ.startGame();
        break;

    case 'cf':
        const gameCF = require('./local_modules/gameCoinFlip');
        gameCF.startGame();
        break;

    default:
        console.log('use parameter \'--game\' with \'bj\' or \'cf\' arguments to play BlackJack or CoinFlip game.');
}
