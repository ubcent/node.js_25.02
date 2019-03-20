const cheerio = require('cheerio');
const axios = require('axios');

let x = 1;
axios.get('https://meduza.io')
    .then(function (resp) {
        const $ = cheerio.load(resp.data);
        $('div.TopicBlock-content span.BlockTitle-first')
            .each(function () {
                console.log(`${x++} | ${$(this).text()}`);
            });
    })
    .catch((err) => {
        console.error(err);
    });
