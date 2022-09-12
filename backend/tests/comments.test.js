const request = require("supertest");
const server = require("../server");

jest.mock("../dataInterface/comments");
const commentData = require("../dataInterface/comments");

jest.mock('../middleware/authMiddleware');
const authMock = require('../middleware/authMiddleware');

describe("/comments routes", () => {

  beforeEach(() => {
    jest.clearAllMocks()
  });

  describe("GET comments/post/:id", () =>{
    
    it("should return an array of comments on success", async () => {
      commentData.getCommentsByPost.mockResolvedValue([{"userId":"63019debd198b257dfd0088b", "postId":"63019debd198b257dfd00ee4", "comment": "Hello!", "rating": 5}]);

      const res = await request(server).get("/api/comments/post/:id");

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();

    });

    it("should return an error message when no results returned", async () => {
      commentData.getCommentsByPost.mockResolvedValue(null);

      const res = await request(server).get("/api/comments/post/:id")

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("POST /comments", () =>{
    it("should return the new comment on success", async () => {

        authMock.protect.mockImplementation(function(req, res, next) {
          req.user = "630ea30184c9d5dd0b5e50b7";
          return next();
        })

        commentData.createComment.mockResolvedValue({"userId":"630ea30184c9d5dd0b5e50b7", "postId":"63019debd198b257dfd00ee4", "comment": "Hello!", "rating": 5});

        const res = await request(server).post("/api/comments/")

        expect(res.statusCode).toEqual(200);
        expect(res.body.error).not.toBeDefined();

    });

    it("should return an error message if comment fails to be created", async () => {

        authMock.protect.mockImplementation(function(req, res, next) {
          req.user = "630ea30184c9d5dd0b5e50b7";
          return next();
        })

        commentData.createComment.mockResolvedValue({error: 'Invalid comment data'});
        const res = await request(server).post("/api/comments")

        expect(res.body.error).toBeDefined();
        expect(res.statusCode).toEqual(400);
    });
  });

  describe("DELETE /comments/:id", () =>{

    it("should return id of deleted comment on success", async () => {

      authMock.protect.mockImplementation(function(req, res, next) {
        req.user = "630ea30184c9d5dd0b5e50b7";
        return next();
      })

      commentData.deleteComment.mockResolvedValue({
        id: '630ea30184c9d5dd0b5e50b7'
      })

      const res = await request(server).delete("/api/comments/:id")
      expect(res.statusCode).toEqual(200);

    });

    it("should return an error message if comment fails to be deleted", async () => {
      commentData.deleteComment.mockResolvedValue({error: `sample error.`})
      const res = await request(server).delete("/api/comments/:id")
      expect(res.statusCode).toEqual(400);
    });
  });
});