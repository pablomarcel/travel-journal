import axios from 'axios';

const API_URL = 'api/users/';

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

// Logout user
const logout = () => {
  localStorage.removeItem('user')
}

// Update user data by userId
const updateUser = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  }
  const userId = userData.userId;
  const response = await axios.put(API_URL + userId, userData, config)
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

// Get single user by token
const getMe = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.get(API_URL + 'me', config)

  return response.data  
}


// Get user data by userId
const getUserById = async (userId) => {

  const response = await axios.get(API_URL + userId)

  return response.data

}


const authService = {
  register,
  logout,
  login,
  updateUser,
  getMe,
  getUserById,
}

export default authService
