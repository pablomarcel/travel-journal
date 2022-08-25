import axios from 'axios'

const API_URL = 'api/posts/'

// Create a new post
const createPost = async (postData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  }

  const response = await axios.post(API_URL, postData, config)

  return response.data
}

// Get all posts
const getAllPosts = async () => {
  const response = await axios.get(API_URL)
  return response.data
}

// Get user posts by user token
const getPostsByUser = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL + 'user', config)

  return response.data
}

// Get single post by postId
const getPostByPostId = async (postId) => {

  const response = await axios.get(API_URL + 'post/' + postId)
  return response.data
}

// Update user's post by postId
const updatePost = async (postData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  }
  const postId = postData.postId;

  const response = await axios.put(API_URL + postId, postData, config)
  return response.data
}

// Delete user post
const deletePost = async (postId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.delete(API_URL + postId, config)

  return response.data
}

const postService = {
  createPost,
  getAllPosts,
  getPostsByUser,
  getPostByPostId,
  deletePost,
  updatePost,
}

export default postService
