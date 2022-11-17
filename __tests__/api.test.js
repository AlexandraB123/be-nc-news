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
  describe("GET - queries", () => {
    test("GET: 200. Filters by topic if given valid search topic", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toEqual(expect.any(Array));
          expect(body.articles.length).toBeGreaterThan(0);
          body.articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              author: expect.any(String),
              title: expect.any(String),
              topic: "mitch",
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            });
          });
        });
    });
    test("GET: 200. Returns empty array if given valid search topic when no articles are on that topic", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toEqual([]);
        });
    });
    test("GET: 400. Sends appropriate error message if given invalid search topic", () => {
      return request(app)
        .get("/api/articles?topic=not_a_topic")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("topic not found");
        });
    });
    test("GET: 200. Sorts by column if given valid search sort_by column", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSorted({ key: "title", descending: true });
        });
    });
    test("GET: 200. Default sorts by date_created if given invalid search sort_by column", () => {
      return request(app)
        .get("/api/articles?sort_by=not_a_column")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSorted({
            key: "created_at",
            descending: true,
          });
        });
    });
    test("GET: 200. Sorts by ascending if given search order of asc", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSorted({ key: "created_at" });
        });
    });
    test("GET: 200. Sorts by descending if given search order of desc", () => {
      return request(app)
        .get("/api/articles?order=desc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSorted({
            key: "created_at",
            descending: true,
          });
        });
    });
    test("GET: 200. Default sorts by descending if given invalid search order", () => {
      return request(app)
        .get("/api/articles?order=not_asc_or_desc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSorted({
            key: "created_at",
            descending: true,
          });
        });
    });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
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
            comment_count: 11,
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
  describe("PATCH", () => {
    test("PATCH: 200. Responds with newly updated article when given votes to add", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 1,
            author: expect.any(String),
            title: expect.any(String),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: 101,
          });
        });
    });
    test("PATCH: 200. Responds with newly updated article when given votes to take away", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -10 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 1,
            author: expect.any(String),
            title: expect.any(String),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: 90,
          });
        });
    });
    test("PATCH: 404. Sends an appropriate error message when given a valid but non-existent id", () => {
      return request(app)
        .patch("/api/articles/999")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article does not exist");
        });
    });
    test("PATCH:400. Sends an appropriate error message when given an invalid id", () => {
      return request(app)
        .patch("/api/articles/not-an-article")
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid id");
        });
    });
    test("PATCH: 400. Sends an appropriate error message when given an invalid request (no inc_votes key)", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ not_an_inc_votes_key: 1 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("PATCH: 400. Sends an appropriate error message when given an invalid request (incVotes value is not a number)", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "hi" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
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

describe("/api/users", () => {
  test("GET:200. Sends an array of users to the client", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toEqual(expect.any(Array));
        expect(body.users.length).toBeGreaterThan(0);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test('DELETE: 204. Deletes comment and returns no content', () => {
    return request(app)
    .delete("/api/comments/1")
    .expect(204)
    .then(() => {
      return db.query("SELECT * FROM comments WHERE comment_id = 1")
    })
    .then((result) => [
      expect(result.rows.length).toBe(0)
    ])
  });
  test('DELETE: 400. Sends appropriate error message if invalid id given', () => {
    return request(app)
    .delete("/api/comments/not_a_valid_id")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid id")
    })
  });
  test('DELETE: 404. Sends appropriate error message if given valid but non-existent id', () => {
    return request(app)
    .delete("/api/comments/999")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Id not found")
    })
  });
});
