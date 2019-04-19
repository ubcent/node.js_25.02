const express = require('express');
const router = express.Router();
const {User} = require('../../models');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
    const newUser = req.body;
    const user = await User.identify(newUser);
    if (user) {
        res.json({token: jwt.sign(user.id, 'superKey')});
    } else {
        res.json({message: 'Wrong credentials'});
    }
});

module.exports = router;
