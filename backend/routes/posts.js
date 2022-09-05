const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const { upload } = require('../middleware/fileUpload')
const { protect } = require('../middleware/authMiddleware')

const postData = require('../dataInterface/posts');
const { post } = require('./users');

// curl http://localhost:5000/api/posts
router.get('/', asyncHandler(async(req, res, next) => {
  let posts = await postData.getAllPosts();
  if (posts) {
    res.status(200).json(posts);
  } else {
    res.status(500).send({error: "Something went wrong. Please try again."})
  }
}))

// curl http://localhost:5000/api/posts/post/63019debd198b257dfd0088b
router.get('/post/:id', asyncHandler(async(req, res, next) => {
  const post = await postData.getPostByPostId(req.params.id)
  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404).send({error: `No post found with id ${req.params.id}.`});
  }

}))

// curl http://localhost:5000/api/posts/user
router.get('/user', protect, asyncHandler(async(req, res, next) => {
  const posts = await postData.getPostsByUser(req.user.id);
  if (posts) {
    res.status(200).json(posts)
  } else {
    res.status(404).send({error: `No post found with the user id ${req.user.id}.`});
  }
}))


// curl http://localhost:5000/api/posts/search?text="text search"
router.get('/search', asyncHandler(async(req, res, next) => {
  const { text } = req.query;
  let posts;
  if (text) {
    posts = await postData.searchPostsByTitle(text);
  }
  if (posts) {
    res.status(200).json(posts);
  } else {
    res.status(500).send({error: "Something went wrong. Please try again."})
  }
}))

// curl -X POST -H "Content-Type: multipart/form-data" -d '{"title":"test title", "content":"test content", "city":"Seattle","country":"USA"}' http://localhost:5000/api/posts
router.post('/', protect, upload.single('image'), asyncHandler(async(req, res, next) => {
  const postInfo = {...req.body, ...req.file}
  let post = await postData.createPost(req.user.id, postInfo);

  if (post.error) {
    res.status(400).send(post);
  } else {
    res.status(200).json(post);
  }
}))

// curl -X PUT -H "Content-Type: multipart/form-data" -d '{"title":"test", "content":"test content", "city":"test city","country":"USA"}' http://localhost:5000/api/posts/63019debd198b257dfd0088b
router.put('/:id', protect, upload.single('image'), asyncHandler(async(req, res, next) => {
  const postInfo = {...req.body, ...req.file}
  let post = await postData.updatePost(req.params.id, req.user.id, postInfo);
  if (!post) {
    res.status(500).send({error: "Something went wrong. Please try again."});
  } else {
    if(post.error){
      res.status(400).send(post);
    } else {
      res.status(200).json(post);
    }
  }
}))

// curl -X DELETE http://localhost:5000/api/posts/63019debd198b257dfd0088b
router.delete('/:id', protect, asyncHandler(async(req, res, next) => {
  const post = await postData.deletePost(req.params.id, req.user.id)
  if (post.error) {
    res.status(400).send(post);
  } else
    res.status(200).json(post);
}))

module.exports = router
