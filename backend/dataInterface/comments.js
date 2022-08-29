const asyncHandler = require('express-async-handler');
const Comment = require('../models/commentModel');
const ObjectId = require('mongodb').ObjectId;

module.exports = {}

module.exports.getCommentsByPost = asyncHandler(async (postId) => {
  const pipeline = [
    {
      '$match': {
        'post': ObjectId(postId)
      }
    }, {
      '$lookup': {
        'from': 'users', 
        'localField': 'user', 
        'foreignField': '_id', 
        'as': 'author'
      }
    }, {
      '$unwind': '$author'
    }, {
      '$sort': {
        'updatedAt': -1
      }
    }
  ];
  let comments = await Comment.aggregate(pipeline);
  return comments;
});

module.exports.createComment = asyncHandler(async (userId, newObj) => {
  if (!userId || !newObj.postId || !newObj.comment) {
    return {error: 'User id, post Id and comment are required.'};
  }
  const comment = await Comment.create({
    user: userId,
    post: newObj.postId,
    comment: newObj.comment,
    rating: newObj.rating
  });
  if (comment) {
    return comment
  } else {
    return {error: 'Invalid comment data'}
  }
})

module.exports.deleteComment = asyncHandler(async(id) => {
  const comment = await Comment.findById(id);
  if (!comment) {
    return {error: 'Comment not found.'}
  }
  await comment.remove()
  return { id: id }
})