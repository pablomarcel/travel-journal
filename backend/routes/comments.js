const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/authMiddleware');
const commentData = require('../dataInterface/comments');

// curl http://localhost:3001/api/comments/post/6304549cae0ccea9638cad1e
router.get('/post/:id', asyncHandler(async (req, res, next) => {
  const result = await commentData.getCommentsByPost(req.params.id);
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(400).send({error: `No comment found with the post i d ${req.params.id}.`})
  }
}))

// curl -X POST -H "Content-Type: application/json" -d '{"user":"6311118ac74bde475d900ddc", "postId":"631111a8c74bde475d900de9"}' http://localhost:3001/api/comments
router.post('/', protect, asyncHandler(async (req, res, next) => {
  let result = await commentData.createComment(req.user.id, req.body);
  if (result.error) {
    res.status(400).send(result);
  } else {
    res.status(200).json(result);
  }
}))

// curl -X DELETE http://localhost:5000/api/comments/6304549cae0ccea9638cad1e
router.delete('/:id', protect, asyncHandler(async(req, res, next) => {
  const result = await commentData.deleteComment(req.params.id)
  if (result.error) {
    res.status(400).send(result);
  } else {
    res.status(200).json(result);
  }
}))

module.exports = router
