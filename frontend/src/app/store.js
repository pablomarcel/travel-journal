import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import postReducer from '../features/posts/postSlice';
import favoritePostReducer from '../features/favoritepost/favoritePostSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    favoriteposts: favoritePostReducer,
  },
})
