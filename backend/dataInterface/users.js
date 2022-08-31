const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const fs = require('fs');

module.exports = {}

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}
// Find user info by user email
async function findByEmail(email){
  const query = {email: email};
  let user = await User.findOne(query);
  return user;
}
// Check user login 
module.exports.findByCredentials = asyncHandler(async (userObj) => {
  let user = await findByEmail(userObj.email)
  if (!user) {
    return {error: `No user found with email ${userObj.email}.`}
  } else {
    if(!user.password){ return {error: "User doesn't have password?"} }

    if(await bcrypt.compare(userObj.password, user.password)){
      return {
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        image: user.image,
        token: generateToken(user._id),
      }
    } else {
      return {error: "Password is incorrect!"}
    }
  }
})

// Create a new user
module.exports.create = asyncHandler(async (newObj) => {
  const { firstName, lastName, email, password, location } = newObj;
  // validate that the user doesn't already exist in the database
  let alreadyExists = await findByEmail(email)
  if(alreadyExists){return {error:"This email is already in use"}}
  
  if(!email || !password || !firstName || !lastName){
    // Invalid user object, shouldn't go in database.
    return {error: "Users must have a name, password, and email."}
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
    image: location
  })

  if (user) {
    return {
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      image: user.image,
      token: generateToken(user._id),
    }
  } else {
    return {error:'Invalid user data'}
  }
})

module.exports.updateUser = asyncHandler( async (userId, newObj) => {
  // Get updated user info from newObj
  const { email, password, oldPassword, location } = newObj;
  // Get old user data by userid
  const oldUser = await User.findById(userId);

  if (oldUser.email !== email) {
    // Check if the email exists or not
    const emailExists = await findByEmail(email)
    if (emailExists) {
      return {error: 'Email already exists.'}
    }
  }
  if ((oldPassword || password) && (!await bcrypt.compare(oldPassword, oldUser.password))) {
    return {error: 'Old password is incorrect!'}
  }

  // Delete the old image if it doesnot match the new one in images folder
  if (oldUser.image) {
    if (location && location !== oldUser.image) {
      fs.unlink(oldUser.image, (err) => {
        if (err) return {error: 'Image not found!'};
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
    newObj.password = hashedPassword;
  } else {
    newObj.password = oldUser.password;
  }
  // Update new image location for user's body data
  if (location) {
    newObj.image = location;
  }
  // Update user data to database
  const updatedUser = await User.findByIdAndUpdate(userId, newObj, {
    new: true,
  })

  return updatedUser
})