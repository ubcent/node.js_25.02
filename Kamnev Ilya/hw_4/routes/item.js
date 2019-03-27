const render = require('../libs/render');

exports.get = (req, res) => {
    render(req, res, req.cookies.portal, false);
}