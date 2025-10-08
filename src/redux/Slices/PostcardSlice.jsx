import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Api/api";

// === GET ALL Postcards (pagination) ===
export const getAllPostcards = createAsyncThunk(
  "postcard/getAllPostcards",
  async ({ pageSize = 10, startAfterId }, { rejectWithValue }) => {
    try {
      const res = await Api.get("/postcard", {
        params: { pageSize, startAfterId },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// === CREATE Postcard ===
export const createPostcard = createAsyncThunk(
  "postcard/createPostcard",
  async (
    { title, description, image, categoryId, music, author },
    { rejectWithValue }
  ) => {
    try {
      const res = await Api.post("/postcard", {
        title,
        description,
        image,
        categoryId,
        music,
        author,
      });
      return res.data.postcard;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// === UPDATE Postcard ===
export const updatePostcard = createAsyncThunk(
  "postcard/updatePostcard",
  async (
    { id, title, description, image, categoryId, music, author },
    { rejectWithValue }
  ) => {
    try {
      const res = await Api.patch(`/postcard/${id}/postcard`, {
        title,
        description,
        image,
        categoryId,
        music,
        author,
      });
      return res.data.postcard;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// === TOGGLE Postcard STATUS ===
export const togglePostcardStatus = createAsyncThunk(
  "postcard/togglePostcardStatus",
  async ({ id, isDisabled }, { rejectWithValue }) => {
    try {
      const res = await Api.patch(`/postcard/${id}/status`, { isDisabled });
      return { id, isDisabled, message: res.data.message || "Status updated" };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
// === UPLOAD IMAGE ===
export const uploadImage = createAsyncThunk(
  "postcard/uploadImage",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await Api.post("/file/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data.imageUrl;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
// === UPDATE IMAGE Postcard ===
export const updateImage = createAsyncThunk(
  "postcard/updatePostcardImage",
  async ({ id, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await Api.patch(
        `/file/update/${id}/image?type=postcard`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return { postcard: res.data.postcard, imageUrl: res.data.imageUrl };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const postcardSlice = createSlice({
  name: "postcard",
  initialState: {
    allPostcardsMap: {},
    paginatedPostcards: [],
    total: 0,
    pageSize: 10,
    nextCursor: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearPostcardState: (state) => {
      state.error = null;
      state.message = null;
    },
    prependPostcard: (state, action) => {
      const newPostcard = action.payload;
      if (!state.paginatedPostcards.some((e) => e.id === newPostcard.id)) {
        state.paginatedPostcards.unshift(newPostcard);
        state.allPostcardsMap[newPostcard.id] = newPostcard;
      }
    },
    updatePostcardRealtime: (state, action) => {
      const updated = action.payload;
      state.allPostcardsMap[updated.id] = {
        ...state.allPostcardsMap[updated.id],
        ...updated,
      };
      state.paginatedPostcards = state.paginatedPostcards.map((e) =>
        e.id === updated.id ? { ...e, ...updated } : e
      );
    },
    removePostcardRealtime: (state, action) => {
      const id = action.payload;
      delete state.allPostcardsMap[id];
      state.paginatedPostcards = state.paginatedPostcards.filter(
        (e) => e.id !== id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPostcards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPostcards.fulfilled, (state, action) => {
        state.loading = false;

        const newPostcards = action.payload.postcards.map((e) => ({
          ...state.allPostcardsMap[e.id],
          ...e,
        }));

        const combined = [...state.paginatedPostcards, ...newPostcards];
        state.paginatedPostcards = Array.from(
          new Map(combined.map((e) => [e.id, e])).values()
        );

        newPostcards.forEach((e) => {
          state.allPostcardsMap[e.id] = e;
        });

        state.nextCursor = action.payload.nextCursor;
        state.total = action.payload.total;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(getAllPostcards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPostcard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPostcard.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Postcard created successfully";

        const newPostcard = action.payload;
        state.allPostcardsMap[newPostcard.id] = newPostcard;
        state.paginatedPostcards.unshift(newPostcard);

        if (state.paginatedPostcards.length > state.pageSize) {
          state.paginatedPostcards.pop();
        }
        state.total += 1;
      })
      .addCase(createPostcard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePostcard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePostcard.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Postcard updated successfully";

        const updated = action.payload;
        state.allPostcardsMap[updated.id] = {
          ...state.allPostcardsMap[updated.id],
          ...updated,
        };
        state.paginatedPostcards = state.paginatedPostcards.map((e) =>
          e.id === updated.id ? { ...e, ...updated } : e
        );
      })
      .addCase(updatePostcard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(togglePostcardStatus.fulfilled, (state, action) => {
        const { id, isDisabled, message } = action.payload;
        state.message = message;

        if (state.allPostcardsMap[id]) {
          state.allPostcardsMap[id] = {
            ...state.allPostcardsMap[id],
            isDisabled,
          };
        }

        state.paginatedPostcards = state.paginatedPostcards.map((e) =>
          e.id === id ? { ...e, isDisabled } : e
        );
      })
      .addCase(togglePostcardStatus.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Image uploaded successfully";
        state.uploadedImageUrl = action.payload; // lưu URL vào state
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateImage.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Image updated successfully";

        const updated = action.payload.postcard;
        state.allPostcardsMap[updated.id] = {
          ...state.allPostcardsMap[updated.id],
          ...updated,
        };
        state.paginatedPostcards = state.paginatedPostcards.map((e) =>
          e.id === updated.id ? { ...e, ...updated } : e
        );
      })
      .addCase(updateImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearPostcardState,
  prependPostcard,
  updatePostcardRealtime,
  removePostcardRealtime,
} = postcardSlice.actions;
export default postcardSlice.reducer;
