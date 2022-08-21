import axios from 'axios'

const API_URL = 'api/myFavoritePosts/'

// Get all my favorite posts
const getAllMyFavoritePosts = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.get(API_URL, config)
  return response.data
}

// Create a new my favorite post
const createMyFavoritePost = async (myFavoritePostData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(API_URL, myFavoritePostData, config)

  return response.data
}

// Delete a my favorite post
const deleteMyFavoritePost = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.delete(API_URL + id, config)

  return response.data
}

const favoritePostService = {
  getAllMyFavoritePosts,
  createMyFavoritePost,
  deleteMyFavoritePost,
}

export default favoritePostService