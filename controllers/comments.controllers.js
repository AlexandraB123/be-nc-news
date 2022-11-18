const { removeComment } = require("../models/comments.models.js");

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
        res.sendStatus(204)})
    .catch(next);
};
