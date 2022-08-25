const express = require('express')
const router = express.Router()
const {
  getCommentsByPost,
  createComment,
} = require('../controllers/commentController')

const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getCommentsByPost).post(protect, createComment)
module.exports = router
