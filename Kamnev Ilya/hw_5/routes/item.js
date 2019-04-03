const render = require('../libs/renderPortal');

exports.get = (req, res) => {
    render(req, res, req.cookies.portal, false);
}