import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postsService } from '../services/postService/postService';

export const loadPosts = createAsyncThunk('posts/loadPosts', async () => {
  return await postsService.getPosts();
});

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearPostsError(state) {
    state.error = null;
  },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearPostsError } = postsSlice.actions;
export default postsSlice.reducer;
