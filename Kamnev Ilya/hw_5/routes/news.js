const renderPortal = require('../libs/renderPortal');
const renderUser = require('../libs/renderUser');
const portalNews = require('../config');

exports.get = (req, res) => {
    if(req.cookies.portal) {
        renderPortal(req, res, req.cookies.portal, true);
    } else {
        res.redirect('/');
    }
}

exports.post = (req, res) => {
    let portal;

    if(req.body.portal === 'my') {
        renderUser(req, res);
    } else {
        portal = portalNews[req.body.portal];
        portal.number = req.body.number;

        if(!isNumeric(portal.number)) {
            portal.number = 5;
        }
    
        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        renderPortal(req, res, portal, true);

        res.cookie('portal', { url: portal.url,
            name: portal.name,
            selectors: portal.selectors,
            number: portal.number,
        }, 
        {   maxAge: 900000, 
            httpOnly: true,
        });
    }
};
