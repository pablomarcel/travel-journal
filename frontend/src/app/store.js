import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import postReducer from '../features/posts/postSlice';
import favoritePostReducer from '../features/favoritepost/favoritePostSlice';
import commentReducer from '../features/comments/commentSilce';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    favoriteposts: favoritePostReducer,
    comments: commentReducer,
  },
})
