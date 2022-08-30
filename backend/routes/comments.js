const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/authMiddleware');
const commentData = require('../dataInterface/comments');

// curl http://localhost:5000/api/comments/post/6304549cae0ccea9638cad1e
router.get('/post/:id', asyncHandler(async (req, res, next) => {
  const result = await commentData.getCommentsByPost(req.params.id);
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(400).send({error: `No comment found with the post id ${req.params.id}.`})
  }
}))

// curl -X POST -H "Content-Type: application/json" -d '{"userId":"63019debd198b257dfd0088b", "postId":"63019debd198b257dfd00ee4"}' http://localhost:5000/api/comments
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
