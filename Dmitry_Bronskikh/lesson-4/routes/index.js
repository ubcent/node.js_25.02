const express = require('express');
const router = express.Router();
const arrLink = require('../arrLink');

router.get('/', (req, res) => {
    const content = {
        header: `Новости`,
        content: arrLink,
    };
    res.render('index', content);
});

module.exports = router;
