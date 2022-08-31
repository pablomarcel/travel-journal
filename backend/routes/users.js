const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler');

const { protect } = require('../middleware/authMiddleware')

const { upload } = require('../middleware/fileUpload')

const userData = require('../dataInterface/users');

// curl -X POST -H "Content-Type: application/json" -d '{"email":"test@uw.edu", "password":"secrets!"}' http://localhost:5000/api/users/login
router.post("/login", asyncHandler(async (req, res, next) => {
  let result = await userData.findByCredentials(req.body)

  if(result.error){
    res.status(400).send(result);
  } else {
    res.status(200).json(result);
  }

}));

// curl -X POST -H "Content-Type: multipart/form-data" -d '{"firstName":"test", "lastName":"lo", "email":"test@uw.edu","password":"secrets!"}' http://localhost:5000/api/users/register
router.post('/register', upload.single('image'), asyncHandler(async (req, res, next) => {
  const userInfo = {...req.body, ...req.file}
  let result = await userData.create(userInfo)
  if(result.error){
    res.status(400).send(result);
  } else {
    res.status(200).json(result);
  }

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

module.exports = router