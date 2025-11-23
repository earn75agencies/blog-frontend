import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { commentAPI } from '../../api/commentAPI';

// Async thunks
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async ({ postId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await commentAPI.getComments(postId, params);
      return { postId, comments: response.data.comments };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ postId, commentData }, { rejectWithValue }) => {
    try {
      const response = await commentAPI.addComment(postId, commentData);
      return { postId, comment: response.data.comment };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ postId, commentId, commentData }, { rejectWithValue }) => {
    try {
      const response = await commentAPI.updateComment(postId, commentId, commentData);
      return { postId, commentId, comment: response.data.comment };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      await commentAPI.deleteComment(postId, commentId);
      return { postId, commentId };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const toggleLikeComment = createAsyncThunk(
  'comments/toggleLikeComment',
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      const response = await commentAPI.toggleLikeComment(postId, commentId);
      return { postId, commentId, ...response };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Initial state
const initialState = {
  commentsByPost: {}, // { postId: { comments: [], status: 'idle', error: null } }
  status: 'idle', // Global status
  error: null,
};

// Slice
const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPostComments: (state, action) => {
      const postId = action.payload;
      if (state.commentsByPost[postId]) {
        state.commentsByPost[postId] = {
          comments: [],
          status: 'idle',
          error: null,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchComments.pending, (state, action) => {
        const postId = action.meta.arg.postId;
        state.commentsByPost[postId] = {
          ...state.commentsByPost[postId],
          status: 'loading',
        };
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;
        state.commentsByPost[postId] = {
          comments,
          status: 'succeeded',
          error: null,
        };
      })
      .addCase(fetchComments.rejected, (state, action) => {
        const postId = action.meta.arg.postId;
        state.commentsByPost[postId] = {
          ...state.commentsByPost[postId],
          status: 'failed',
          error: action.payload.message || 'Failed to fetch comments',
        };
        state.error = action.payload.message || 'Failed to fetch comments';
      })
      // Add comment
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        if (state.commentsByPost[postId]) {
          state.commentsByPost[postId].comments.unshift(comment);
        } else {
          state.commentsByPost[postId] = {
            comments: [comment],
            status: 'succeeded',
            error: null,
          };
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.error = action.payload.message || 'Failed to add comment';
      })
      // Update comment
      .addCase(updateComment.fulfilled, (state, action) => {
        const { postId, commentId, comment } = action.payload;
        if (state.commentsByPost[postId]) {
          const index = state.commentsByPost[postId].comments.findIndex(
            (c) => c._id === commentId
          );
          if (index !== -1) {
            state.commentsByPost[postId].comments[index] = comment;
          }
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.error = action.payload.message || 'Failed to update comment';
      })
      // Delete comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { postId, commentId } = action.payload;
        if (state.commentsByPost[postId]) {
          state.commentsByPost[postId].comments = state.commentsByPost[postId].comments.filter(
            (c) => c._id !== commentId
          );
        }
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.error = action.payload.message || 'Failed to delete comment';
      })
      // Toggle like comment
      .addCase(toggleLikeComment.fulfilled, (state, action) => {
        const { postId, commentId, isLiked } = action.payload;
        if (state.commentsByPost[postId]) {
          const index = state.commentsByPost[postId].comments.findIndex(
            (c) => c._id === commentId
          );
          if (index !== -1) {
            state.commentsByPost[postId].comments[index].isLiked = isLiked;
            state.commentsByPost[postId].comments[index].likesCount = isLiked 
              ? state.commentsByPost[postId].comments[index].likesCount + 1 
              : state.commentsByPost[postId].comments[index].likesCount - 1;
          }
        }
      })
      .addCase(toggleLikeComment.rejected, (state, action) => {
        state.error = action.payload.message || 'Failed to toggle like';
      });
  },
});

export const { clearError, clearPostComments } = commentsSlice.actions;

export default commentsSlice.reducer;