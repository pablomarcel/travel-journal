const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler');
// const {
//   // registerUser,
//   // loginUser,
//   // getMe,
//   getUserById,
//   updateUser,
// } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

const { upload } = require('../middleware/fileUpload')

const userData = require('../dataInterface/users');

// curl -X POST -H "Content-Type: application/json" -d '{"email":"test@uw.edu", "password":"secrets!"}' http://localhost:5000/api/users/login
router.post("/login", asyncHandler(async (req, res, next) => {
  // let resultStatus;

  let result = await userData.findByCredentials(req.body)

  if(result.error){
    // resultStatus = 404;
    res.status(400).send(result);
  } else {
    // resultStatus = 200;
    res.status(200).json(result);
  }
  // if(result.error){
  //   resultStatus = 404;
  // } else {
  //   resultStatus = 200;
  // }

  // res.status(resultStatus).send(result);

}));

// curl -X POST -H "Content-Type: multipart/form-data" -d '{"firstName":"test", "lastName":"lo", "email":"test@uw.edu","password":"secrets!"}' http://localhost:5000/api/users/register
router.post('/register', upload.single('image'), asyncHandler(async (req, res, next) => {
  const userInfo = {...req.body, ...req.file}
  // let resultStatus;
  let result = await userData.create(userInfo)
  if(result.error){
    // resultStatus = 404;
    res.status(400).send(result);
  } else {
    // resultStatus = 200;
    res.status(200).json(result);
  }

  // res.status(resultStatus).send(result);
}))

// curl -X PUT -H "Content-Type: multipart/form-data" -d '{"firstName":"test", "lastName":"lo", "email":"test@uw.edu","password":"secrets!"}' http://localhost:5000/api/users/573a13a3f29313caabd0e77b
router.put("/:id", protect, upload.single('image'), asyncHandler( async (req, res, next) => {
  
  const userInfo = {...req.body, ...req.file}
  
  const result = await userData.updateUser(req.params.id, userInfo)
  if (!result) {
    res.status(500).send({error: "Something went wrong. Please try again."});
  } else {
    if(result.error){
      res.status(400).send(result);
    } else {
      res.status(200).json(result);
    }
  }
}));


// curl http://localhost:5000/api/users/me
router.get('/me', protect, asyncHandler(async (req, res, next) => {
  res.status(200).json(req.user)
}))

// router.post('/', upload.array('images'), registerUser);
// router.post('/', upload.single('image'), registerUser);
// router.post('/login', loginUser);
// router.get('/me', protect, getMe);
// router.get('/:id', getUserById);
// router.route('/:id').put(protect, upload.single('image'), updateUser);
module.exports = router