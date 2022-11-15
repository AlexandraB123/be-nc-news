const db = require("../db/connection");
const { checkUserExists } = require("../utils/utils.js");

exports.fetchArticles = () => {
  const queryString = `
    SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, CAST(COUNT(comments.comment_id) AS INT) AS comment_count 
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
  `;
  return db.query(queryString).then((result) => result.rows);
};

exports.fetchArticleById = (article_id) => {
  const queryString = `
    SELECT users.username AS author, articles.title, articles.article_id, articles.topic, articles.body, articles.created_at, articles.votes
    FROM articles
    LEFT JOIN users ON articles.author = users.username
    WHERE article_id = $1;
  `;
  return db.query(queryString, [article_id]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "article does not exist" });
    } else {
      return result.rows[0];
    }
  });
};

exports.fetchArticleComments = (article_id) => {
  const queryString = `SELECT * FROM comments WHERE article_id = $1`;
  return this.fetchArticleById(article_id)
    .then(() => {
      return db.query(queryString, [article_id]);
    })
    .then((result) => result.rows);
};

exports.addArticleComment = (article_id, body) => {
  if (!body.username || !body.body)
    return Promise.reject({ status: 400, msg: "Bad request" });
  return this.fetchArticleById(article_id)
    .then(() => checkUserExists(body.username))
    .then(() => {
      const queryString = `
        INSERT INTO comments (article_id, author, body, votes)
        VALUES ($1, $2, $3, 0)
        RETURNING *;`;
      return db.query(queryString, [article_id, body.username, body.body]);
    })
    .then((result) => {
      return result.rows[0];
    });
};

exports.updateArticle = (article_id, body) => {
  if (typeof body.inc_votes !== "number")
    return Promise.reject({ status: 400, msg: "Bad request" });
  return this.fetchArticleById(article_id)
    .then(() => {
      const queryString = `
      UPDATE articles
      SET votes = votes + $2
      WHERE article_id = $1
      RETURNING *;`;
      return db.query(queryString, [article_id, body.inc_votes]);
    })
    .then((result) => {
      return result.rows[0];
    });
};
