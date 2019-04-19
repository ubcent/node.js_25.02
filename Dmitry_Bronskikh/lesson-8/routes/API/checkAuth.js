const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
    const auth = req.headers.authorization || '';
    const [, token] = auth.split(' ');
    if (token) {
        jwt.verify(token, 'superKey', (err, decoded) => {
            if (err) {
                return res.json({message: 'Wrong token'});
            }
            req.user = decoded;
            next();
        })
    } else {
        return res.json({message: 'No token present'});
    }
}

module.exports = checkAuth;
