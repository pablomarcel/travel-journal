import axios from 'axios'

const API_URL = 'api/posts/';

// @desc Create a new comment for a chosen post
// @route POST /api/posts/:postId/comments
// @access Private
const createComment = async (commentData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const postId = commentData.postId;
  const response = await axios.post(API_URL + `${postId}/comments/`, commentData, config);
  return response.data;
}

// @desc Get all comments for a chosen post
// @route GET /api/posts/:postId/comments
// @access public
const getCommentsByPost = async (postId) => {
  const response = await axios.get(API_URL + `${postId}/comments/`);
  return response.data;
}

const commentService = {
  createComment,
  getCommentsByPost,
}
export default commentService