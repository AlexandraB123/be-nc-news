const db = require("../db/connection");

exports.fetchArticles = () => {
  const queryString = `SELECT users.username AS author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comments.comment_id) as comment_count 
    FROM articles
    LEFT JOIN users ON articles.author = users.username
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY users.username, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes
    ORDER BY articles.created_at DESC;`;
  return db.query(queryString).then((result) => result.rows);
};

exports.fetchArticleById = (article_id) => {

  if (!/^\d+$/.test(article_id)) {
    return Promise.reject({ status: 400, msg: "Invalid id" });
  }

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
