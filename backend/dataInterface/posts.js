const asyncHandler = require('express-async-handler');
const fs = require('fs');
const Post = require('../models/postModel');
const ObjectId = require('mongodb').ObjectId;

module.exports = {}

// Get all posts from posts collection
module.exports.getAllPosts = asyncHandler(async () => {
  const pipeline = [
    {
      '$lookup': {
        'from': 'users', 
        'localField': 'user', 
        'foreignField': '_id', 
        'as': 'author'
      }
    }, {
      "$unwind": "$author"
    }, {
      '$sort': {
        'updatedAt': -1
      }
    }
  ];

  let posts = await Post.aggregate(pipeline);
  return posts;
})

// Get a single post by postId
module.exports.getPostByPostId = asyncHandler(async (postId) => {
  const pipeline = [
    {
      '$match': {
        '_id': ObjectId(postId)
      }
    }, {
      '$lookup': {
        'from': 'users', 
        'localField': 'user', 
        'foreignField': '_id', 
        'as': 'author'
      }
    }, {
      "$unwind": "$author"
    }
  ];

  let post = await Post.aggregate(pipeline);
  return post;
})


// Get all posts of a user (by userId)
module.exports.getPostsByUser = asyncHandler(async (userId) => {
  let posts = await Post.find({ user: userId }).sort({updatedAt: -1});
  return posts;
})

module.exports.createPost = asyncHandler(async(userId, newObj) => {
  const { title, content, city, country, airBnBPrice, hotelPrice, couplePrice, familyPrice, path } = newObj;
  // Check if title and content are valid or not
  if (!title || !content) {
    return {error: 'Title and content are required!'}
  }
  // Create a new post
  const post = await Post.create({
    user: userId,
    title,
    city,
    country,
    content,
    airBnBPrice,
    hotelPrice,
    couplePrice,
    familyPrice,
    image: path,
  })

  if (post) {
    return post
  } else {
    return {error: 'Invalid post data'}
  }
})

// Update a post by postId 
module.exports.updatePost = asyncHandler(async (postId, userId, newObj) => {
  // Store new post values to vars
  const { path } = newObj;
  // Get post by id
  const oldPost = await Post.findById(postId);
  
  if (!oldPost) {
    return {error: 'The post not found'}
  }

  // Check for user
  if (!userId) {
    return { error: 'User not found'}
  }

  // Make sure the logged in user matches the post user
  if (oldPost.user.toString() !== userId) {
    return {error: 'User not authorized'}
  }

  // Delete the old image if it doesnot match the new one from images folder
  if (oldPost.image) {
    if (path && path !== oldPost.image) {
      fs.unlink(oldPost.image, (err) => {
        if (err) return {error: 'Image not found!'};
        // if no error, file has been deleted successfully
      });      
    }
  }
  // Update new image path for user's body data
  if (path) {
    newObj.image = path;
  }
  // console.log(req.body);
  const updatedPost = await Post.findByIdAndUpdate(postId, newObj, {
    new: true,
  })
  return updatedPost;
})

// Delete post by postId
module.exports.deletePost = asyncHandler(async (postId, userId) => {
  // Get the post info by postId
  const post = await Post.findById(postId)

  if (!post) {
    return {error: 'Post not found'}
  }

  // Check for user
  if (!userId) {
    return {error: 'User not found'}
  }

  // Make sure the logged in user matches the post user
  if (post.user.toString() !== userId) {
    return {error: 'User not authorized'}
  }
  // delete post's image if exists in images folder
  if (post.image) {
    fs.unlink(post.image, (err) => {
      if (err) return {error: 'Image not found!'};
      // if no error, file has been deleted successfully
    });
  }

  await post.remove()

  return { id: postId }
})
