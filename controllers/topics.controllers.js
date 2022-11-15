const { fetchTopics } = require("../models/topics.models.js");

exports.checkConnection = (req, res) => {
  res.send({ message: "connection ok" });
};

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => res.send({ topics }))
    .catch(next);
};

