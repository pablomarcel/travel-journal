import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import favoritePostService from './favoritePostService';

const initialState = {
  favoriteposts: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Create a new my favorite post
export const createMyFavoritePost = createAsyncThunk(
  'favoriteposts/create',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await favoritePostService.createMyFavoritePost(data, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get all my favoriteposts
export const getAllMyFavoritePosts = createAsyncThunk(
  'favoriteposts/getAllMyFavoritePosts',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await favoritePostService.getAllMyFavoritePosts(token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Delete user post
export const deleteMyFavoritePost = createAsyncThunk(
  'favoriteposts/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await favoritePostService.deleteMyFavoritePost(id, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const favoritePostSlice = createSlice({
  name: 'favoritepost',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMyFavoritePost.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createMyFavoritePost.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.favoriteposts.unshift(action.payload)
      })
      .addCase(createMyFavoritePost.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getAllMyFavoritePosts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAllMyFavoritePosts.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.favoriteposts = action.payload
      })
      .addCase(getAllMyFavoritePosts.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteMyFavoritePost.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteMyFavoritePost.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.favoriteposts = state.favoriteposts.filter(
          (post) => post._id !== action.payload.id
        )
      })
      .addCase(deleteMyFavoritePost.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = favoritePostSlice.actions
export default favoritePostSlice.reducer