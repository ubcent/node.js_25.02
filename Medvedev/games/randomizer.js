const array = ['head', 'tail'];

function random() {
  return array[Math.floor(Math.random()*2)]
}

exports.random = () => random();