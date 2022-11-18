const { fetchEndpoints } = require("../models/api.models.js");

exports.getEndpoints = (req, res, next) => {
  fetchEndpoints()
    .then((endpoints) => res.send({ endpoints }))
    .catch(next);
};
