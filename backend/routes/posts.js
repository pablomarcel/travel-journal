const express = require('express')
const router = express.Router()
const {
  getAllPosts,
  getPostsByUser,
  getPostByPostId,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController')

const { upload } = require('../middleware/fileUpload')
const { protect } = require('../middleware/authMiddleware')

router.route('/').get(getAllPosts).post(protect, upload.single('image'), createPost)
router.route('/post/:id').get(getPostByPostId)
router.route('/:id').delete(protect, deletePost).put(protect, upload.single('image'), updatePost)
router.get('/user', protect, getPostsByUser)
module.exports = router
