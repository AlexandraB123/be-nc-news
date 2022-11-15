const { fetchArticles } = require("../models/articles.models.js");

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => res.send({ articles }))
    .catch(next);
};
