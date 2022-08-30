const path = require('path');
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

// Serve frontend
if (process.env.NODE_ENV === 'production') {
  server.use(express.static(path.join(__dirname, '../frontend/build')));

  server.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  );
} else {
  server.get('/', (req, res) => res.send('Please set to production'));
}

module.exports = server;