const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const fs = require('fs');
// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  // Assign user info to user's vars 
  const { firstName, lastName, email, password } = req.body;
  const image = req.file ? req.file.path : '';
  // Check if the mandatory fields are valid or not
  if (!firstName || !lastName || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  // Check if user exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists.')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    image
  })

  if (user) {
    res.status(201).json({
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      image: user.image,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Check for user email
  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      image: user.image,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Password is incorrect.')
  }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  // Get updated user info from request's body
  const { email, password, oldPassword } = req.body;
  const image = req.file ? req.file.path : '';
  // Get old user data by id
  const oldUser = await User.findById(req.params.id);
  

  if (oldUser.email !== email) {
    // Check if email has been existed or not
    const emailExists = await User.findOne({ email })
    if (emailExists) {
      res.status(400)
      throw new Error('Email already exists.')
    }
  }
  if ((oldPassword || password) && (!await bcrypt.compare(oldPassword, oldUser.password))) {
    res.status(401)
    throw new Error('Old password is incorrect!')
  }

  // Delete the old image if it doesnot match the new one in images folder
  if (oldUser.image) {
    if (image && image !== oldUser.image) {
      fs.unlink(oldUser.image, (err) => {
        if (err) throw new Error('Image not found!');
        // if no error, file has been deleted successfully
        // console.log('File deleted!');
      });      
    }
  }
  if (password) {
    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    // Update hashed password for user's body data
    req.body.password = hashedPassword;
  } else {
    req.body.password = oldUser.password;
  }
  // Update new image path for user's body data
  if (req.file) {
    req.body.image = req.file.path;
  }
  // Update user data to database
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
  res.status(200).json(updatedUser)
})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})

// @desc    Get user data by userId
// @route   GET /api/users/:id
// @access  public
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  res.status(200).json(user)
})

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  getMe,
  getUserById,
}