const request = require("supertest");
const server = require("../server");

jest.mock("../dataInterface/users");
const userData = require("../dataInterface/users");

jest.mock('../middleware/authMiddleware');
const authMock = require('../middleware/authMiddleware');

const multer = require('multer');


describe("/users routes", () => {
	beforeEach(() => {
		jest.clearAllMocks()
	});

	describe("POST /users/login", () =>{
		it("should return a user id on success", async () => {
			authMock.protect.mockImplementation(function(req, res, next) {
				req.user = "630ea30184c9d5dd0b5e50b7";
				return next();
			})

			userData.findByCredentials.mockResolvedValue([{
				_id: "630ea30184c9d5dd0b5e50b7",
				email: "example email"
			}]);

			const res = await request(server).post("/api/users/login");

			expect(res.statusCode).toEqual(200);
			expect(res.body.error).not.toBeDefined();
		});

		it("should return an error message", async () => {
			authMock.protect.mockImplementation(function(req, res, next) {
				req.user = "630ea30184c9d5dd0b5e50b7";
				return next();
			})

			userData.findByCredentials.mockResolvedValue({
				error: "Password is incorrect!"
			});

			const res = await request(server).post("/api/users/login");

			expect(res.statusCode).toEqual(400);
			expect(res.body.error).toBeDefined();
		});
	});

	describe("POST /users/register", () =>{
		it("should return an array of user data on success", async () => {
			userData.create.mockResolvedValue([{
				_id: "630ea30184c9d5dd0b5e50b7",
				firstName:"test",
				lastName:"test",
				email:"test@uw.edu",
				password:"test!"
			}]);

			const res = await request(server).post("/api/users/register");

			expect(res.statusCode).toEqual(200);
			expect(res.body.error).not.toBeDefined();
		});

		it("should return an error message", async () => {
			authMock.protect.mockImplementation(function(req, res, next) {
				req.user = "630ea30184c9d5dd0b5e50b7";
				return next();
			})

			userData.create.mockResolvedValue({
				error: "Password is incorrect!"
			});

			const res = await request(server).post("/api/users/register");

			expect(res.statusCode).toEqual(400);
			expect(res.body.error).toBeDefined();
		});
	});

	describe("PUT /users/:id", () =>{
		it("should return an array of posts on success", async () => {
			authMock.protect.mockImplementation(function(req, res, next) {
				req.user = "630ea30184c9d5dd0b5e50b7";
				return next();
			})

			userData.updateUser.mockResolvedValue([{
				_id: "630ea30184c9d5dd0b5e50b7",
				email: "example email"
			}]);

			const res = await request(server).put("/api/users/:id");

			expect(res.statusCode).toEqual(200);
			expect(res.body.error).not.toBeDefined();
		});
		it("should return an error message", async () => {
			authMock.protect.mockImplementation(function(req, res, next) {
				req.user = "630ea30184c9d5dd0b5e50b7";
				return next();
			})

			userData.updateUser.mockResolvedValue({
				error: "Password is incorrect!"
			});

			const res = await request(server).put("/api/users/:id");

			expect(res.statusCode).toEqual(400);
		});
	});

	describe("GET /me", () => {
		it("should return id of deleted post on success", async () => {

			authMock.protect.mockImplementation(function(req, res, next) {
				req.user = "630ea30184c9d5dd0b5e50b7";
				return next();
			})

			const res = await request(server).get("/api/users/me");

			expect(res.statusCode).toEqual(200);
		});
	});
})
