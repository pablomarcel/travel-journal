const asyncHandler = require('express-async-handler')
const fs = require('fs');
const Post = require('../models/postModel')
const User = require('../models/userModel')

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({})

  res.status(200).json(posts)
})

// @desc    Get posts by userId
// @route   GET /api/posts/:userId
// @access  Private
const getPostsByUser = asyncHandler(async (req, res) => {
  const posts = await Post.find({ user: req.user.id })

  res.status(200).json(posts)
})

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  // Check if title and content fields are filled or not
  if (!req.body.title || !req.body.content) {
    res.status(400)
    throw new Error('Post title or content is missing. Please add these mandatory fields!')
  }
  // Get image path from uploaded file
  const image = req.file ? req.file.path : '';
  // Create a new post
  const post = await Post.create({
    user: req.user.id,
    title: req.body.title,
    city: req.body.city,
    country: req.body.country,
    content: req.body.content,
    airBnBPrice: req.body.airBnBPrice,
    hotelPrice: req.body.hotelPrice,
    couplePrice: req.body.couplePrice,
    familyPrice: req.body.familyPrice,
    image: image,
  })

  res.status(200).json(post)
})

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
  // Get post by id
  const post = await Post.findById(req.params.id)

  if (!post) {
    res.status(400)
    throw new Error('The post not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the post user
  if (post.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  // Delete the old image if it doesnot match the new one from images folder
  if (post.image) {
    if (!req.body.image || req.body.image !== post.image) {
      fs.unlink(post.image, (err) => {
        if (err) throw new Error('Image not found!');
        // if no error, file has been deleted successfully
        // console.log('File deleted!');
      });      
    }
  }  

  // console.log(req.body);
  const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updatedPost)
})

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
  // Get the post info by postId
  const post = await Post.findById(req.params.id)


  if (!post) {
    res.status(400)
    throw new Error('Post not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the post user
  if (post.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }
  // delete post's image if exists in images folder
  if (post.image) {
    fs.unlink(post.image, (err) => {
      if (err) throw new Error('Image not found!');
      // if no error, file has been deleted successfully
      // console.log('File deleted!');
    });
  }

  await post.remove()

  res.status(200).json({ id: req.params.id })
})

module.exports = {
  getAllPosts,
  getPostsByUser,
  createPost,
  updatePost,
  deletePost,
}
