const express = require('express')
const router = express.Router()
const {
  getAllPosts,
  getPostsByUser,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController')

const { upload } = require('../middleware/fileUpload')
const { protect } = require('../middleware/authMiddleware')

router.route('/').get(getAllPosts).post(protect, upload.single('image'), createPost)
router.route('/:id').delete(protect, deletePost).put(protect, updatePost)
router.route('/:userId').get(protect, getPostsByUser)
module.exports = router
