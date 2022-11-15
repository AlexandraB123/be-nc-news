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
