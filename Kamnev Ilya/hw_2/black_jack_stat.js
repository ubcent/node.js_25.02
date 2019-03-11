/*
    не доделано
*/

const fs = require('fs');

const file = './stat.txt';

const stat = fs.readFile(file, (err, data) => {
    if(err) { throw err; }
  
    console.log(data.toString());
});