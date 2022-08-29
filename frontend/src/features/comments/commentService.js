import axios from 'axios'

const API_URL = 'api/comments/';

// @desc Create a new comment for a chosen post
// @route POST /api/comments
// @access Private
const createComment = async (commentData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  // const postId = commentData.postId;
  const response = await axios.post(API_URL, commentData, config);
  return response.data;
}

// @desc Get all comments for a chosen post
// @route GET /api/comments/post/:postId
// @access public
const getCommentsByPost = async (postId) => {
  const response = await axios.get(API_URL + `post/${postId}`);
  return response.data;
}

const commentService = {
  createComment,
  getCommentsByPost,
}
export default commentService