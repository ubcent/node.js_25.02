var fs = require('fs');

var readStream = fs.createReadStream('./demofile.txt');

/*Write to the console when the file is opened:*/
readStream.on('open', function () {
    console.log('The file is open');
});

let fileContent = fs.readFileSync("./demofile.txt", "utf8");
console.log(fileContent);