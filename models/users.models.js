const db = require("../db/connection");

exports.fetchUsers = () => {
  return db.query("SELECT * FROM Users;").then((result) => result.rows);
};