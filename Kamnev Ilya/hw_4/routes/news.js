const render = require('../libs/render');
const portalNews = require('../config');

exports.get = (req, res) => {
    if(req.cookies.portal) {
        render(req, res, req.cookies.portal, true);
    } else {
        res.redirect('/');
    }
}

exports.post = (req, res) => {
    let portal = portalNews[req.body.portal];
    portal.number = req.body.number;

    if(!isNumeric(portal.number)) {
        portal.number = 5;
    }

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    render(req, res, portal, true);

    res.cookie('portal', { url: portal.url,
                           name: portal.name,
                           selectors: portal.selectors,
                           number: portal.number,
                         }, 
                         { maxAge: 900000, 
                           httpOnly: true,
                         });
};
