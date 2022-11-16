const { fetchUsers } = require("../models/users.models.js");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => res.send({ users }))
    .catch(next);
};