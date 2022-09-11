const request = require("supertest");
const server = require("../server");

jest.mock("../dataInterface/posts");
const postData = require("../dataInterface/posts");

jest.mock('../middleware/authMiddleware');
const authMock = require('../middleware/authMiddleware');

// jest.mock('../middleware/fileUpload');
// const imgMock = require('../middleware/fileUpload');

describe("/posts routes", () => {

  beforeEach(() => {
    jest.clearAllMocks()
  });

  describe("GET /posts", () =>{
    it("should return an array of posts on success", async () => {
      postData.getAllPosts.mockResolvedValue([{_id: "631111a8c74bde475d900de9",
      title: "example title"}]);

      const res = await request(server).get("/api/posts");

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();

    });
    it("should return an error message when no results returned", async () => {
      postData.getAllPosts.mockResolvedValue(null);

      const res = await request(server).get("/api/posts")

      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBeDefined();
    });
  });
  describe("GET /posts/post/:id", () =>{
    it("should return a single post on success", async () => {
      postData.getPostByPostId.mockResolvedValue({_id: "631111a8c74bde475d900de9",
      title: "example title"});

      const res = await request(server).get("/api/posts/post/:id");

      expect(res.statusCode).toEqual(200);

      expect(res.body.error).not.toBeDefined();

    });
    it("should return an error message when no results returned", async () => {
        postData.getPostByPostId.mockResolvedValue(null);

      const res = await request(server).get("/api/posts/post/:id")

      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toBeDefined();
    });
  });
  describe("GET /posts/user", () =>{
    it("should return an array of posts on success", async () => {

      authMock.protect.mockImplementation(function(req, res, next) {
        req.user = "630ea30184c9d5dd0b5e50b7";
        return next();
      })

      postData.getPostsByUser.mockResolvedValue([{_id: "630ea30184c9d5dd0b5e50b7",
      title: "example title"}]);

      const res = await request(server).get("/api/posts/user");

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message when no results returned", async () => {

      authMock.protect.mockImplementation(function(req, res, next) {
        req.user = "630ea30184c9d5dd0b5e50b7";
        return next();
      })

      postData.getPostsByUser.mockResolvedValue(null);

      const res = await request(server).get("/api/posts/user")

      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toBeDefined();
   });
  });

  describe("POST /posts", () =>{
    it("should return the new post on success", async () => {

      authMock.protect.mockImplementation(function(req, res, next) {
        req.user = "630ea30184c9d5dd0b5e50b7";
        return next();
      })

      postData.createPost.mockResolvedValue({user:"630ea30184c9d5dd0b5e50b7", title:"631111a8c74bde475d900de9"});

      const res = await request(server).post("/api/posts")

      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });

    it("should return an error message if post fails to be created", async () => {
      
      authMock.protect.mockImplementation(function(req, res, next) {
        req.user = "630ea30184c9d5dd0b5e50b7";
        return next();
      })

      postData.createPost.mockResolvedValue({error: 'Invalid post data'});
      const res = await request(server).post("/api/posts")

      expect(res.body.error).toBeDefined();
      expect(res.statusCode).toEqual(400);
    });
  });

  // describe("PUT /posts/:id", () =>{
  //   it("should return the updated post on success", async () => {

  //     authMock.protect.mockImplementation(function(req, res, next) {
  //       req.user = "630ea30184c9d5dd0b5e50b7";
  //       return next();
  //     })

  //     // imgMock.upload.mockImplementation(function(req, res, next) {
  //     //   return next();
  //     // })

  //     postData.updatePost.mockResolvedValue({
  //       user:"630ea30184c9d5dd0b5e50b7", 
  //       title:"631111a8c74bde475d900de9"
  //     });

  //     const res = await request(server).post("/api/posts/:id")

  //     expect(res.statusCode).toEqual(200);
  //     expect(res.body.error).not.toBeDefined();
  //   });

  //   it("should return an error message if post fails to be created", async () => {

  //     authMock.protect.mockImplementation(function(req, res, next) {
  //       req.user = "630ea30184c9d5dd0b5e50b7";
  //       return next();
  //     })

  //     // imgMock.upload.mockImplementation(function(req, res, next) {
  //     //   return next();
  //     // })

  //     postData.updatePost.mockResolvedValue({ error: 'error'});
  //     const res = await request(server).post("/api/posts/:id")

  //     console.log(res)

  //     expect(res.statusCode).toEqual(400);
  //     expect(res.body.error).toBeDefined();
  //   });
  // });

  describe("DELETE /posts/:id", () =>{
    it("should return id of deleted post on success", async () => {

      authMock.protect.mockImplementation(function(req, res, next) {
        req.user = "630ea30184c9d5dd0b5e50b7";
        return next();
      })

      postData.deletePost.mockResolvedValue({
        id: '630ea30184c9d5dd0b5e50b7'
      })
      
      const res = await request(server).delete("/api/posts/:id")

      // console.log(res)

      expect(res.statusCode).toEqual(200);
    });
    it("should return an error message if comment fails to be deleted", async () => {

      authMock.protect.mockImplementation(function(req, res, next) {
        req.user = "630ea30184c9d5dd0b5e50b7";
        return next();
      })

      postData.deletePost.mockResolvedValue({error: "sample error."})

      const res = await request(server).delete("/api/posts/:id")

      expect(res.statusCode).toEqual(400);
    });
  });
});