const db = require("../db/connection");

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
