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
