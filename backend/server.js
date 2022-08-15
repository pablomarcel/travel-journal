// const path = require('path');
const express = require("express");
const colors = require('colors');
const routes = require("./routes");
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');

connectDB();

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(errorHandler);
server.use(routes);
server.use('/images', express.static('images'));
// server.use('/images', express.static(path.join(__dirname, 'images')));
// const port = process.env.PORT || 5000;

// server.listen(port, () =>
//   console.log(`Server is listening on http://localhost:${port}`)
// );
module.exports = server;