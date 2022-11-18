const db = require("../db/connection");
const { readFile } = require("fs/promises")

exports.fetchEndpoints = () => {
    return readFile(`${__dirname}/../endpoints.json`)
    .then((response) => {
        return JSON.parse(response)
    })
};
