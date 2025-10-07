import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Api/api"; 

// === GET COMMENTS BY POSTCARD ID ===
export const getCommentsByPostcard = createAsyncThunk(
  "comment/getCommentsByPostcard",
  async (postcardId, { rejectWithValue }) => {
    try {
      const res = await Api.get(`/comment/${postcardId}/comments`);
      return { postcardId, comments: res.data }; // backend trả nested tree
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// === CREATE COMMENT / REPLY ===
export const createComment = createAsyncThunk(
  "comment/createComment",
  async ({ postcardId, userId, content, parentId }, { rejectWithValue }) => {
    try {
      const res = await Api.post(`/comment/${postcardId}/comments`, {
        userId,
        content,
        parentId: parentId || null,
      });
      return res.data; // backend trả comment vừa tạo
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
// === EDIT COMMENT ===
export const editComment = createAsyncThunk(
  "comment/editComment",
  async ({ id, userId, content }, { rejectWithValue }) => {
    try {
      const res = await Api.put(`/comment/${id}`, {
        userId,
        content,
      });
      return res.data; // backend trả về comment đã update
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
// === DELETE COMMENT + NESTED REPLIES ===
export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async ({ id }, { rejectWithValue }) => {
    try {
      await Api.delete(`/comment/${id}`);
      return id; // trả về commentId đã xóa
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const PostcardCommentSlice = createSlice({
  name: "comment",
  initialState: {
    commentsByPostcard: {}, // { postcardId: [nested tree] }
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- GET COMMENTS ---
      .addCase(getCommentsByPostcard.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCommentsByPostcard.fulfilled, (state, action) => {
        state.loading = false;
        state.commentsByPostcard[action.payload.postcardId] =
          action.payload.comments;
      })
      .addCase(getCommentsByPostcard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- CREATE COMMENT / REPLY ---
      .addCase(createComment.fulfilled, (state, action) => {
        const comment = action.payload;
        const arr = state.commentsByPostcard[comment.postcardId] || [];
        arr.push(comment); // thêm trực tiếp, backend đã build tree
        state.commentsByPostcard[comment.postcardId] = arr;
      })
      // === EDIT COMMENT ===
      .addCase(editComment.fulfilled, (state, action) => {
        const updated = action.payload;
        const pid = updated.postcardId;
        const updateInTree = (nodes) =>
          nodes.map((c) => {
            if (c.id === updated.id) {
              return {
                ...c,
                content: updated.content,
                editedAt: updated.editedAt,
              }; // chỉ update nội dung
            }
            return { ...c, replies: updateInTree(c.replies || []) };
          });
        if (state.commentsByPostcard[pid]) {
          state.commentsByPostcard[pid] = updateInTree(
            state.commentsByPostcard[pid]
          );
        }
      })

      // --- DELETE COMMENT + NESTED REPLIES ---
      .addCase(deleteComment.fulfilled, (state, action) => {
        const deletedId = action.payload;
        Object.keys(state.commentsByPostcard).forEach((pid) => {
          const removeComments = (nodes) =>
            nodes
              .filter((c) => c.id !== deletedId)
              .map((c) => ({
                ...c,
                replies: removeComments(c.replies || []),
              }));
          state.commentsByPostcard[pid] = removeComments(
            state.commentsByPostcard[pid]
          );
        });
      });
  },
});

export default PostcardCommentSlice.reducer;
