const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/authMiddleware');

const favpostData = require('../dataInterface/favoriteposts');

// curl http://localhost:5000/api/favoriteposts
router.get('/', protect, asyncHandler(async (req, res, next) => {
  const result = await favpostData.getAllMyFavoritePosts(req.user.id);
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(400).send({error: `No favorite found with the user id ${req.user.id}.`})
  }
}))

// curl -X POST -H "Content-Type: application/json" -d '{"userId":"63019debd198b257dfd0088b", "postId":"63019debd198b257dfd00ee4"}' http://localhost:5000/api/favoriteposts
router.post('/', protect, asyncHandler(async(req, res, next) => {
  let result = await favpostData.createMyFavoritePost(req.user.id, req.body.id);
  if (result.error) {
    res.status(400).send(result);
  } else {
    res.status(200).json(result);
  }
}))

// curl -X DELETE http://localhost:5000/api/favoriteposts/63019debd198b257dfd0088b
router.delete('/:id', protect, asyncHandler(async(req, res, next) => {
  const result = await favpostData.deleteMyFavoritePost(req.params.id)
  if (result.error) {
    res.status(400).send(result);
  } else
    res.status(200).json(result);
}))


module.exports = router