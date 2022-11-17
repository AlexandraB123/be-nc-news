const db = require("../db/connection.js");

exports.checkUserExists = (username) => {
  return db
    .query(`SELECT *  FROM users WHERE username = $1`, [username])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Username not found" });
      }
    });
};

exports.checkTopicExists = (topic) => {
  return db
    .query(`SELECT *  FROM topics WHERE slug = $1`, [topic])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "topic not found" });
      }
    });
};
