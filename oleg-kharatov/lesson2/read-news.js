const request = require('request');
const cheerio = require('cheerio');
const colors = require('colors');

request('https://habr.com/ru/', (error, response, html)=>{
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        const textArray = $('.post__text');

        $('.post__title_link').each(function (i, element) {
            console.log(
                element.childNodes[0].data.bold
            );
            const post = textArray[i].childNodes.reduce((acc, item)=>{
                if (item.data != undefined){
                    acc = acc +  item.data.trim();
                }
                return acc;
            }, [])
            console.log(post.italic);
            console.log("#############################################".rainbow);

        });
    } else {
        console.log(error);
    }
});