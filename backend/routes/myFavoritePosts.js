const express = require('express')
const router = express.Router()
const {
  getAllMyFavoritePosts,
  createMyFavoritePost,
  deleteMyFavoritePost,
} = require('../controllers/myFavoritePostController');
const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getAllMyFavoritePosts).post(protect, createMyFavoritePost)
router.route('/:id').delete(protect, deleteMyFavoritePost)
module.exports = router