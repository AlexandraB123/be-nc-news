const { fetchTopics, fetchArticles } = require("../models/topics.model.js");

exports.checkConnection = (req, res) => {
  res.send({ message: "connection ok" });
};

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => res.send({ topics }))
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => res.send({ articles }))
    .catch(next);
};
