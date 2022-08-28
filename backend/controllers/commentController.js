const asyncHandler = require('express-async-handler');
const Post = require('../models/postModel');
const User = require('../models/userModel');
const MyFavoritePost = require('../models/myFavoritePostModel');
const Comment = require('../models/commentModel');
const ObjectId = require('mongodb').ObjectId;

// @desc    Get comments by postId
// @route   GET /api/comments
// @access  Public
const getCommentsByPost = asyncHandler(async (req, res) => {
  const comments = await Comment.find({post: req.body.id}).sort({updatedAt: -1});
  res.status(200).json(comments);
});

// @desc    Create a new comment for a chosen post
// @route   POST /api/comments
// @access  Private
const createComment = asyncHandler(async (req, res) => {
  if (!req.user.id || !req.body.id) {
    res.status(400);
    throw new Error('User id and post Id are required.')
  }
  const comment = await Comment.create({
    user: req.user.id,
    post: req.body.id,
    comment: req.body.comment,
    rating: req.body.rating
  });
  res.status(200).json(comment);
})

module.exports = {
  getCommentsByPost,
  createComment,
}