const asyncHandler = require('express-async-handler');
// const fs = require('fs');
const Post = require('../models/postModel');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const S3 = require('aws-sdk').S3;

module.exports = {}

const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_BUCKET_REGION
});

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
  const { title, content, city, country, airBnBPrice, hotelPrice, couplePrice, familyPrice, location } = newObj;
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
    image: location,
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
  const { location } = newObj;
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
    if (location && location !== oldPost.image) {
      // Delete image in local folder
      // fs.unlink(oldPost.image, (err) => {
      //   if (err) return {error: 'Image not found!'};
      //   // if no error, file has been deleted successfully
      // });
      // Delete old image in AWS S3
      const imageKey = oldPost.image.replace(process.env.AWS_IMAGE_PATH, '');
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageKey
      };
      s3.deleteObject(params, function(err, data) {
        if (err) return {error: 'Image not found!'}; // an error occurred
        // If no error, image has been deleted successfully
      });
    }
  }
  // Update new image location for user's body data
  if (location) {
    newObj.image = location;
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
    // Delete image from local folder
    // fs.unlink(post.image, (err) => {
    //   if (err) return {error: 'Image not found!'};
    //   // if no error, file has been deleted successfully
    // });
    // Delete image from AWS S3 bucket
    const imageKey = post.image.replace(process.env.AWS_IMAGE_PATH, '');
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageKey
    };
    s3.deleteObject(params, function(err, data) {
      if (err) return {error: 'Image not found!'}; // an error occurred
      // If no error, image has been deleted successfully
    });
  }

  await post.remove()

  return { id: postId }
})

// Search posts by post's title
module.exports.searchPostsByTitle = asyncHandler(async(search) => {
  const pipeline = [
    {
      '$search': {
        'index': 'title_autocomplete', 
        'autocomplete': {
          'query': search, // search content
          'path': 'title',
        }
      }
    }, {
      '$limit': 5
    }, {
      '$project': {
        '_id': 1, 
        'title': 1, 
        'content': 1, 
        'updatedAt': 1,
      }
    }
  ];
  let posts = await Post.aggregate(pipeline);
  return posts;
})