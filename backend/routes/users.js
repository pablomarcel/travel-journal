const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getMe,
  getUserById,
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

const { upload } = require('../middleware/fileUpload')

// router.post('/', upload.array('images'), registerUser);
router.post('/', upload.single('image'), registerUser);
// router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.get('/:id', getUserById)

module.exports = router