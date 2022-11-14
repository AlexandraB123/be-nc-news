const { writeFile } = require("fs/promises")

writeFile(".env.test", "PGDATABASE=nc_news_test")
writeFile(".env.development", "PGDATABASE=nc_news")
writeFile("query.sql", "\\c nc_news;")

