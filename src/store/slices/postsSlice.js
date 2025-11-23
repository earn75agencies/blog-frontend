import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postAPI } from '../../api/postAPI';

// Async thunks
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await postAPI.getPosts(params);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchPost = createAsyncThunk(
  'posts/fetchPost',
  async (id, { rejectWithValue }) => {
    try {
      const response = await postAPI.getPost(id);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await postAPI.createPost(postData);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ id, postData }, { rejectWithValue }) => {
    try {
      const response = await postAPI.updatePost(id, postData);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (id, { rejectWithValue }) => {
    try {
      await postAPI.deletePost(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const toggleLikePost = createAsyncThunk(
  'posts/toggleLikePost',
  async (id, { rejectWithValue }) => {
    try {
      const response = await postAPI.toggleLike(id);
      return { id, ...response };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchFeaturedPosts = createAsyncThunk(
  'posts/fetchFeaturedPosts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await postAPI.getFeaturedPosts(params);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchTrendingPosts = createAsyncThunk(
  'posts/fetchTrendingPosts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await postAPI.getTrendingPosts(params);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchMostLikedPosts = createAsyncThunk(
  'posts/fetchMostLikedPosts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await postAPI.getMostLiked(params);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchMostSharedPosts = createAsyncThunk(
  'posts/fetchMostSharedPosts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await postAPI.getMostShared(params);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchLikedPosts = createAsyncThunk(
  'posts/fetchLikedPosts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await postAPI.getLikedPosts(params);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Initial state
const initialState = {
  posts: [],
  currentPost: null,
  featuredPosts: [],
  trendingPosts: [],
  mostLikedPosts: [],
  mostSharedPosts: [],
  likedPosts: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  filters: {
    category: '',
    author: '',
    search: '',
  },
};

// Slice
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload.data.posts;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || 'Failed to fetch posts';
      })
      // Fetch single post
      .addCase(fetchPost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentPost = action.payload.data.post;
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || 'Failed to fetch post';
      })
      // Create post
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload.data.post);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.payload.message || 'Failed to create post';
      })
      // Update post
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (post) => post._id === action.payload.data.post._id
        );
        if (index !== -1) {
          state.posts[index] = action.payload.data.post;
        }
        if (state.currentPost && state.currentPost._id === action.payload.data.post._id) {
          state.currentPost = action.payload.data.post;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.error = action.payload.message || 'Failed to update post';
      })
      // Delete post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.error = action.payload.message || 'Failed to delete post';
      })
      // Toggle like
      .addCase(toggleLikePost.fulfilled, (state, action) => {
        const { id, isLiked } = action.payload;
        
        // Update in posts list
        const postIndex = state.posts.findIndex((post) => post._id === id);
        if (postIndex !== -1) {
          state.posts[postIndex].isLiked = isLiked;
          state.posts[postIndex].likesCount = isLiked 
            ? state.posts[postIndex].likesCount + 1 
            : state.posts[postIndex].likesCount - 1;
        }
        
        // Update current post if it matches
        if (state.currentPost && state.currentPost._id === id) {
          state.currentPost.isLiked = isLiked;
          state.currentPost.likesCount = isLiked 
            ? state.currentPost.likesCount + 1 
            : state.currentPost.likesCount - 1;
        }
      })
      .addCase(toggleLikePost.rejected, (state, action) => {
        state.error = action.payload.message || 'Failed to toggle like';
      })
      // Fetch featured posts
      .addCase(fetchFeaturedPosts.fulfilled, (state, action) => {
        state.featuredPosts = action.payload.data.posts;
      })
      .addCase(fetchFeaturedPosts.rejected, (state, action) => {
        state.error = action.payload.message || 'Failed to fetch featured posts';
      })
      // Fetch trending posts
      .addCase(fetchTrendingPosts.fulfilled, (state, action) => {
        state.trendingPosts = action.payload.data.posts;
      })
      .addCase(fetchTrendingPosts.rejected, (state, action) => {
        state.error = action.payload.message || 'Failed to fetch trending posts';
      })
      // Fetch most liked posts
      .addCase(fetchMostLikedPosts.fulfilled, (state, action) => {
        state.mostLikedPosts = action.payload.data.posts;
      })
      .addCase(fetchMostLikedPosts.rejected, (state, action) => {
        state.error = action.payload.message || 'Failed to fetch most liked posts';
      })
      // Fetch most shared posts
      .addCase(fetchMostSharedPosts.fulfilled, (state, action) => {
        state.mostSharedPosts = action.payload.data.posts;
      })
      .addCase(fetchMostSharedPosts.rejected, (state, action) => {
        state.error = action.payload.message || 'Failed to fetch most shared posts';
      })
      // Fetch liked posts
      .addCase(fetchLikedPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLikedPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.likedPosts = action.payload.data.posts;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchLikedPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || 'Failed to fetch liked posts';
      });
  },
});

export const { setFilters, clearCurrentPost, resetError } = postsSlice.actions;

export default postsSlice.reducer;
