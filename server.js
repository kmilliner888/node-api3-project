const express = require('express');
const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');
const helmet = require('helmet');
const morgan = require('morgan');
const server = express();

server.use(express.json());
server.use(helmet());
server.use(morgan('dev'));
server.use(logger);
server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`${req.method} Request`);
  next();
}

module.exports = server;
