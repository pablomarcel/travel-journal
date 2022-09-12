const request = require("supertest");
const server = require("../server");

jest.mock("../dataInterface/favoriteposts");
const favoritePosts = require("../dataInterface/favoriteposts");

jest.mock('../middleware/authMiddleware');
const authMock = require('../middleware/authMiddleware');

describe("/favoriteposts routes", () => {

  beforeEach(() => {
    jest.clearAllMocks()
  });

	describe("GET /favoriteposts", () =>{
    it("should return an array of posts on success", async () => {

			authMock.protect.mockImplementation(function(req, res, next) {
        req.user = "630ea30184c9d5dd0b5e50b7";
        return next();
      })

			favoritePosts.getAllMyFavoritePosts.mockResolvedValue([{
				_id: "630ea30184c9d5dd0b5e50b7",
      	title: "example title"
			}]);

      const res = await request(server).get("/api/favoriteposts");

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();
    });

    it("should return an error message when no results returned", async () => {
      authMock.protect.mockImplementation(function(req, res, next) {
        req.user = "630ea30184c9d5dd0b5e50b7";
        return next();
      })

      favoritePosts.getAllMyFavoritePosts.mockResolvedValue(null);

      const res = await request(server).get("/api/favoriteposts")

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    });
  });

	describe("POST /favoriteposts", () => {
		it("should return the new post on success", async () => {

      authMock.protect.mockImplementation(function(req, res, next) {
        req.user = "630ea30184c9d5dd0b5e50b7";
        return next();
      })

      favoritePosts.createMyFavoritePost.mockResolvedValue({user:"630ea30184c9d5dd0b5e50b7", title:"631111a8c74bde475d900de9"});

      const res = await request(server).post("/api/favoriteposts")

      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });

    it("should return an error message if post fails to be created", async () => {
      
      authMock.protect.mockImplementation(function(req, res, next) {
        req.user = "630ea30184c9d5dd0b5e50b7";
        return next();
      })

      favoritePosts.createMyFavoritePost.mockResolvedValue({error: 'Invalid post data'});
      const res = await request(server).post("/api/favoriteposts")

      expect(res.body.error).toBeDefined();
      expect(res.statusCode).toEqual(400);
    });
	});

	describe("DELETE /favoriteposts", () => {
		it("should return id of deleted post on success", async () => {

      authMock.protect.mockImplementation(function(req, res, next) {
        req.user = "630ea30184c9d5dd0b5e50b7";
        return next();
      })

      favoritePosts.deleteMyFavoritePost.mockResolvedValue({
        id: '631278953f5182c20df045eb'
      })
      
      const res = await request(server).delete("/api/favoriteposts/:id")
			
      expect(res.statusCode).toEqual(200);
    });
    it("should return an error message if comment fails to be deleted", async () => {

      authMock.protect.mockImplementation(function(req, res, next) {
        req.user = "630ea30184c9d5dd0b5e50b7";
        return next();
      })

      favoritePosts.deleteMyFavoritePost.mockResolvedValue(
				{error: "sample error."}
			)
			
      const res = await request(server).delete("/api/favoriteposts/:id")

      expect(res.statusCode).toEqual(400);
    });
	});
});