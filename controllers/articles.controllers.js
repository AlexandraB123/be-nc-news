const {
  fetchArticles,
  fetchArticleById,
  fetchArticleComments,
  addArticleComment,
  updateArticle
} = require("../models/articles.models.js");

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  fetchArticles(sort_by, order, topic)
    .then((articles) => res.send({ articles }))
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => res.send({ article }))
    .catch(next);
};

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleComments(article_id)
    .then((comments) => res.send({ comments }))
    .catch(next);
};

exports.postArticleComment = (req, res, next) => {
  const { article_id } = req.params;
  const body = req.body;
  addArticleComment(article_id, body)
    .then((comment) => res.status(201).send({ comment }))
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const body = req.body;
  updateArticle(article_id, body)
    .then((article) => res.status(200).send({ article }))
    .catch(next);
};
