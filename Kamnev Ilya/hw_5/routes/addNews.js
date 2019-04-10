const {UserNews} = require('../models');

exports.post = async (req, res) => {
    let userNews = new UserNews(req.body);
    userNews = await userNews.save();
}