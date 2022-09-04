const request = require("supertest");
const server = require("../server");


jest.mock("../dataInterface/posts");
const postData = require("../dataInterface/posts");

describe("/posts routes", () => {

    beforeEach(() => {
  
    });
  
    describe("GET /posts", () =>{
      it("should return an array of posts on success", async () => {
        postData.getAllPosts.mockResolvedValue([{_id: "631111a8c74bde475d900de9",
        title: "example title"}]);
  
        const res = await request(server).get("/api/posts");
  
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toEqual(true);
        expect(res.body.error).not.toBeDefined();
     
        //check status code == 200
        //check if result is Array
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
   
      //check status code == 200
      //check if result is Array
    });
    it("should return an error message when no results returned", async () => {
        postData.getPostByPostId.mockResolvedValue(null);

      const res = await request(server).get("/api/posts/post/:id")

      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toBeDefined();
  });
});
// describe("GET /posts/:user", () =>{
//     it("should return an array of posts on success", async () => {
//       postData.getPostsByUser.mockResolvedValue([{_id: "631111a8c74bde475d900de9",
//       title: "example title"}]);

//       const res = await request(server).get("/api/posts/user");

//       expect(res.statusCode).toEqual(200);
//       expect(Array.isArray(res.body)).toEqual(true);
//       expect(res.body.error).not.toBeDefined();
   
//       //check status code == 200
//       //check if result is Array
//     });
//     it("should return an error message when no results returned", async () => {
//         postData.getPostsByUser.mockResolvedValue(null);

//       const res = await request(server).get("/api/posts/user")

//       expect(res.statusCode).toEqual(400);
//       expect(res.body.error).toBeDefined();
//   });
// });

//     describe("POST /posts", () =>{
//       it("should return the new post on success", async () => {
//           postData.createPost.mockResolvedValue({user:"6311118ac74bde475d900ddc", title:"631111a8c74bde475d900de9"});
  
//           const res = await request(server).post("/api/posts")
  
//           expect(res.statusCode).toEqual(200);
//           expect(res.body.error).not.toBeDefined();
          
  
//         //check status code == 200
//       });
  
//       it("should return an error message if post fails to be created", async () => {
//           postData.createPost.mockResolvedValue(null);
//           const res = await request(server).post("/api/posts")
  
//           expect(res.body.error).toBeDefined();
//           expect(res.statusCode).toEqual(400);
//       });
//   });
//   describe("PUT /posts/:id", () =>{
//     it("should return the updated post on success", async () => {
//         postData.updatePost.mockResolvedValue({user:"6311118ac74bde475d900ddc", title:"631111a8c74bde475d900de9"});

//         const res = await request(server).post("/api/posts/:id")

//         expect(res.statusCode).toEqual(200);
//         expect(res.body.error).not.toBeDefined();
        

//       //check status code == 200
//     });

//     it("should return an error message if post fails to be created", async () => {
//         postData.updatePost.mockResolvedValue(null);
//         const res = await request(server).post("/api/posts/:id")

//         expect(res.body.error).toBeDefined();
//         expect(res.statusCode).toEqual(400);
//     });
// });
// describe("DELETE /posts/:id", () =>{
//   it("should return id of deleted post on success", async () => {
//     postData.updatePost.mockResolvedValue({id: '631128bbe08491e28587f13f'
//     })
//     const res = await request(server).delete("/api/comments/:id")
//     expect(res.statusCode).toEqual(200);
//     expect(Object.isObject(res.body)).toEqual(true);

//     // check status code 200
//   });
//   it("should return an error message if comment fails to be deleted", async () => {
//     commentData.deleteComment.mockResolvedValue({error: `sample error.`})
//     const res = await request(server).delete("/api/comments/:id")
//     expect(res.statusCode).toEqual(400);
//   });
// });
});
  

