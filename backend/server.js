// const path = require('path');
const express = require("express");
const colors = require('colors');
const routes = require("./routes");
const cors = require("cors")
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');

connectDB();

const server = express();
server.get("/") //delete if it does not work
server.use(express.json());
server.use(cors({origin: true}));
// const corsOptions = {
//     origin: "http://localhost:3000"
// }

// const corsOptions = {
//     origin: "https://willowy-sunflower-59d1f9.netlify.app"
// }

server.use(express.urlencoded({ extended: true }));
server.use(errorHandler);
server.use(routes);
server.use('/images', express.static('images'));

module.exports = server;
