const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/api/health-check", () => {
  it("GET:200. Responds with message 'connection ok'", () => {
    return request(app)
      .get("/api/health-check")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          message: "connection ok",
        });
      });
  });
});

describe("/api/topics", () => {
  test("GET:200. Sends an array of topics to the client", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(res.body.topics).toEqual(expect.any(Array));
        expect(res.body.topics.length).toBeGreaterThan(0);
        res.body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("/api/articles", () => {
  test("GET:200. Sends an array of articles to the client", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toEqual(expect.any(Array));
        expect(res.body.articles.length).toBeGreaterThan(0);
        res.body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            author: expect.any(String),
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("GET: 200. Default sorts by descending date created", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET:200. Sends a single article to the client", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article).toMatchObject({
          article_id: 1,
          author: expect.any(String),
          title: expect.any(String),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
  test("GET:404 sends an appropriate and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article does not exist");
      });
  });
  test("GET:400 sends an appropriate and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-article")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid id");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET:200. Sends an array of comments belonging to a single article to the client", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual(expect.any(Array));
        expect(body.comments.length).toBeGreaterThan(0);
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            article_id: 1,
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });
  test("GET: 200. Default sorts by descending date created", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });
  test("GET: 200. Sends empty array when article has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("GET:404 sends an appropriate and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("GET:400 sends an appropriate and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-article/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid id");
      });
  });

  test("POST:201. Inserts a new comment to the db and sends the new comment back to the client", () => {
    const newComment = {
      username: "lurker",
      body: "comment for testing",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toMatchObject({
          comment_id: expect.any(Number),
          article_id: 1,
          created_at: expect.any(String),
          votes: 0,
          author: "lurker",
          body: "comment for testing",
        });
      });
  });
  test("POST:201. Inserts a new comment to the db and sends the new comment back to the client", () => {
    const newComment = {
      username: "lurker",
      body: "comment for testing",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toMatchObject({
          comment_id: expect.any(Number),
          article_id: 1,
          created_at: expect.any(String),
          votes: 0,
          author: "lurker",
          body: "comment for testing",
        });
      });
  });
  test("POST:400. Responds with an appropriate error message when provided with a bad comment (no username)", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ body: "comment for testing" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("POST:400. Responds with an appropriate error message when provided with a bad comment (no body)", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "new_user" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("POST:404. Sends an appropriate error message when given a valid but non-existent id", () => {
    const newComment = {
      username: "lurker",
      body: "comment for testing",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("POST:400. Sends an appropriate error message when given an invalid id", () => {
    const newComment = {
      username: "lurker",
      body: "comment for testing",
    };
    return request(app)
      .post("/api/articles/not-an-article/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid id");
      });
  });
  test("POST:404. Sends an appropriate error message when given an invalid username", () => {
    const newComment = {
      username: "not_a_valid_username",
      body: "comment for testing",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Username not found");
      });
  });
});
