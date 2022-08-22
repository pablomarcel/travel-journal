const asyncHandler = require('express-async-handler');
const Post = require('../models/postModel');
const User = require('../models/userModel');
const MyFavoritePost = require('../models/myFavoritePostModel');
const ObjectId = require('mongodb').ObjectId;

// @desc    Get all my favorite posts
// @route   GET /api/myFavoritePosts
// @access  Public
const getAllMyFavoritePosts = asyncHandler(async (req, res) => {

  const pipeline = [
    {
      '$match': {
        'user': ObjectId(req.user.id)
      }
    }, {
      '$lookup': {
        'from': 'posts', 
        'localField': 'post', 
        'foreignField': '_id', 
        'as': 'post', 
        'pipeline': [
          {
            '$lookup': {
              'from': 'users', 
              'localField': 'user', 
              'foreignField': '_id', 
              'as': 'author'
            }
          }
        ]
      }
    }, {
      '$sort': {
        'updatedAt': -1
      }
    }
  ];
  const myFavoritePosts = await MyFavoritePost.aggregate(pipeline);
  res.status(200).json(myFavoritePosts)
})


// @desc    Create a new my favorite post
// @route   POST /api/myFavoritePosts
// @access  Private
const createMyFavoritePost = asyncHandler(async (req, res) => {
  // // Check if postId and userId are valid or not
  if (!req.user.id || !req.body.id) {
    res.status(400)
    throw new Error('User id and post id are required!')
  }

  // Check if the post exists
  const existedPost = await MyFavoritePost.findOne({user: req.user.id, post: req.body.id});
  if (existedPost) {
    res.status(400)
    throw new Error('The post already exists in your favorite post collection.')
  }
  // Create a new my favorite post
  const myFavoritePost = await MyFavoritePost.create({
    user: req.user.id,
    post: req.body.id
  })

  res.status(200).json(myFavoritePost)
})

// @desc    Delete my favorite post
// @route   DELETE /api/myFavoritePosts/:id
// @access  Private
const deleteMyFavoritePost = asyncHandler(async (req, res) => {
  const myFavoritePost = await MyFavoritePost.findById(req.params.id)
  if (!myFavoritePost) {
    res.status(400)
    throw new Error('My favorite post not found.')
  }
  await myFavoritePost.remove()

  res.status(200).json({ id: req.params.id })
})

module.exports = {
  getAllMyFavoritePosts,
  createMyFavoritePost,
  deleteMyFavoritePost,
}
