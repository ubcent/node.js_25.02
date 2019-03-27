const express = require('express');
const router = express.Router();
const arrLink = require('../arrLink');
const getNews = require('../getNews');

router.get('/:id', async (req, res) => {
    if (!arrLink[req.params.id]) {
        res.redirect('/');
    }
    const param = arrLink[req.params.id];
    const news = {
        header: `Новости ${param.title}`,
        news: await getNews(param.link, param.cssTag),
    };
    res.render('news', news);
});

module.exports = router;
