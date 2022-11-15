const {
  fetchArticles,
  fetchArticleById,
} = require("../models/articles.models.js");

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => res.send({ articles }))
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => res.send({ article }))
    .catch(next);
};
