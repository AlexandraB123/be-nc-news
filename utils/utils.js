const db = require("../db/connection.js");

exports.checkItemExists = (item, item_type, table_to_search, column_to_search) => {
  return db
    .query(`SELECT *  FROM ${table_to_search} WHERE ${column_to_search} = $1`, [item])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: `${item_type} not found` });
      }
    });
};
