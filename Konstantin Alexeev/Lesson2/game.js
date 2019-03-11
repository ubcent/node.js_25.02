const readline = require('readline');  // встроенный модуль перехвата потоков ввода/вывода

// создаем метод перехвата потоков
const rl = readline.createInterface({
  input: process.stdin,  // ввод у нас будет из консоли
  output: process.stdout  // вывод тоже на консоль
});

const correctCoinSidesName = ['orel', 'reshka'];

console.log('я хочу сыграть с тобой в игру!', correctCoinSidesName);
// постоянно прослушиваем событие консоли 'line'.
// line - это все введенное в консоли до нажатия enter.
rl.on('line', function(line){

    let coinSide = line;
    // проверяем кооректность введенной стороы монетки
    let isCorrectCoinSide = checkCorrectCoinSice(coinSide);
    // если кооректно введено название стороны монетки, 
    // проверяем, угадал ли игрок
    if (isCorrectCoinSide === true) {
      let isRightCoinSide = checkRightCoinSide();
      // в зависимости от результата - выводим овтет
      showResult(isRightCoinSide);
    }
    else {
      console.log('ты меня не обманешь! Вводи правильное значение')
    }

})

function checkCorrectCoinSice(coinSide){
  // если введенное значение есть в массиве correctCoinSidesName, то всё ок
  if (correctCoinSidesName.includes(coinSide)) return true;
}

function checkRightCoinSide(){
  // генерируем рандом от 0.5, угадал или нет
  if (Math.random() < 0.5) return true;
}

function showResult(result){
  if (result === true) console.log('о угадал!');
    else console.log('не угадал)');
    console.log('заного угадывай!')
}