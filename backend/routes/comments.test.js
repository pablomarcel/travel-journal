const request = require("supertest");
const server = require("../server");


jest.mock("../dataInterface/comments");
const commentData = require("../dataInterface/comments");

describe("/comments routes", () => {

    beforeEach(() => {
  
    });
  
    describe("GET comments/post/:id", () =>{
      it("should return an array of comments on success", async () => {
        commentData.getCommentsByPost.mockResolvedValue([{_id: "5553a998e4b02cf715119a97",
        comment: "example comment"}]);
  
        const res = await request(server).get("/api/comments/post/:id");
  
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toEqual(true);
        expect(res.body.error).not.toBeDefined();
     
        //check status code == 200
        //check if result is Array
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
          commentData.createComment.mockResolvedValue({user:"6311118ac74bde475d900ddc", postId:"631111a8c74bde475d900de9"});
  
          const res = await request(server).post("/api/comments")
  
          expect(res.statusCode).toEqual(200);
          expect(Object.isObject(res.body)).toEqual(true);
          expect(res.body.error).not.toBeDefined();
          
  
        //check status code == 200
      });
  
      it("should return an error message if comment fails to be created", async () => {
          commentData.createComment.mockResolvedValue(null);
          const res = await request(server).post("/api/comments")
  
          expect(res.body.error).toBeDefined();
          expect(res.statusCode).toEqual(400);
      });
  });
  describe("DELETE /comments/:id", () =>{
    it("should return id of deleted comment on success", async () => {
      commentData.deleteComment.mockResolvedValue({id: '631128bbe08491e28587f13f'
      })
      const res = await request(server).delete("/api/comments/:id")
      expect(res.statusCode).toEqual(200);
      expect(Object.isObject(res.body)).toEqual(true);

      // check status code 200
    });
    it("should return an error message if comment fails to be deleted", async () => {
      commentData.deleteComment.mockResolvedValue({error: `sample error.`})
      const res = await request(server).delete("/api/comments/:id")
      expect(res.statusCode).toEqual(400);
    });
  });
  });
  

