const asyncHandler = require('express-async-handler');
const MyFavoritePost = require('../models/myFavoritePostModel');
const ObjectId = require('mongodb').ObjectId;

module.exports = {}

module.exports.getAllMyFavoritePosts = asyncHandler(async (userId) => {

  const pipeline = [
    {
      '$match': {
        'user': ObjectId(userId)
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
          },
          { "$unwind": "$author" }
        ]
      }
    },
      { "$unwind": "$post" }
    , {
      '$sort': {
        'updatedAt': -1
      }
    }
  ];
  let myFavoritePosts = await MyFavoritePost.aggregate(pipeline);
  return myFavoritePosts;
})

module.exports.createMyFavoritePost = asyncHandler(async (userId, postId) => {
  // Check if postId and userId are valid or not
  if (!userId || !postId) {
    return {error: 'User id and post id are required!'};
  }

  // Check if the post exists
  const existedPost = await MyFavoritePost.findOne({user: userId, post: postId});
  if (existedPost) {
    return {error: 'The post already exists in your favorite post collection.'};
  }
  // Create a new my favorite post
  const myFavoritePost = await MyFavoritePost.create({
    user: userId,
    post: postId
  })
  if (myFavoritePost) {
    return myFavoritePost;
  } else {
    return {error: 'Invalid my favorite post data.'}
  }
})

module.exports.deleteMyFavoritePost = asyncHandler(async (id) => {
  const myFavoritePost = await MyFavoritePost.findById(id)
  if (!myFavoritePost) {
    return {error: 'My favorite post not found.'}
  }
  await myFavoritePost.remove()
  return { id: id }
})