import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Api/api";

// === GET ALL EMOTIONS (pagination) ===
export const getAllEmotions = createAsyncThunk(
  "emotion/getAllEmotions",
  async ({ pageSize = 10, startAfterId }, { rejectWithValue }) => {
    try {
      const res = await Api.get("/emotion", {
        params: { pageSize, startAfterId },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
// === CREATE EMOTION ===
export const createEmotion = createAsyncThunk(
  "emotion/createEmotion",
  async ({ name, categoryId, emoji, description }, { rejectWithValue }) => {
    try {
      const res = await Api.post("/emotion", {
        name,
        categoryId,
        emoji,
        description: description || "",
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
// === UPDATE EMOTION ===
export const updateEmotion = createAsyncThunk(
  "emotion/updateEmotion",
  async ({ id, name, categoryId, emoji, description }, { rejectWithValue }) => {
    try {
      const res = await Api.patch(`/emotion/${id}/emotion`, {
        name,
        categoryId,
        emoji,
        description: description || "",
      });
      return res.data.emotion;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// === TOGGLE EMOTION STATUS ===
export const toggleEmotionStatus = createAsyncThunk(
  "emotion/toggleEmotionStatus",
  async ({ id, isDisabled }, { rejectWithValue }) => {
    try {
      const res = await Api.patch(`/emotion/${id}/status`, { isDisabled });
      return { id, isDisabled, message: res.data.message || "Status updated" };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const emotionSlice = createSlice({
  name: "emotion",
  initialState: {
    allEmotionsMap: {}, // để merge realtime
    paginatedEmotions: [], // danh sách hiển thị
    total: 0,
    pageSize: 10,
    nextCursor: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearEmotionState: (state) => {
      state.error = null;
      state.message = null;
    },
    // realtime: prepend emotion mới (added)
    prependEmotion: (state, action) => {
      const newEmotion = action.payload;
      if (!state.paginatedEmotions.some((e) => e.id === newEmotion.id)) {
        state.paginatedEmotions.unshift(newEmotion);
        state.allEmotionsMap[newEmotion.id] = newEmotion;
      }
    },
    // realtime: update emotion thay đổi (modified)
    updateEmotionRealtime: (state, action) => {
      const updated = action.payload;
      state.allEmotionsMap[updated.id] = {
        ...state.allEmotionsMap[updated.id],
        ...updated,
      };
      state.paginatedEmotions = state.paginatedEmotions.map((e) =>
        e.id === updated.id ? { ...e, ...updated } : e
      );
    },
    // realtime: remove emotion bị xoá
    removeEmotionRealtime: (state, action) => {
      const id = action.payload;
      delete state.allEmotionsMap[id];
      state.paginatedEmotions = state.paginatedEmotions.filter(
        (e) => e.id !== id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // === GET ALL EMOTIONS ===
      .addCase(getAllEmotions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEmotions.fulfilled, (state, action) => {
        state.loading = false;

        const newEmotions = action.payload.emotions.map((e) => ({
          ...state.allEmotionsMap[e.id],
          ...e,
        }));

        // append và remove duplicate
        const combined = [...state.paginatedEmotions, ...newEmotions];
        state.paginatedEmotions = Array.from(
          new Map(combined.map((e) => [e.id, e])).values()
        );

        // update allEmotionsMap
        newEmotions.forEach((e) => {
          state.allEmotionsMap[e.id] = e;
        });

        state.nextCursor = action.payload.nextCursor;
        state.total = action.payload.total;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(getAllEmotions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // === CREATE EMOTION  ===
      .addCase(createEmotion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmotion.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Emotion created successfully";

        const newEmotion = action.payload;
        state.allEmotionsMap[newEmotion.id] = newEmotion; // Cập nhật map
        state.paginatedEmotions.unshift(newEmotion); // Prepend vào danh sách hiển thị (nếu đang ở page đầu)
        // Giới hạn độ dài list theo pageSize
        if (state.paginatedEmotions.length > state.pageSize) {
          state.paginatedEmotions.pop();
        }

        state.total += 1;
      })
      .addCase(createEmotion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // === UPDATE EMOTION ===
      .addCase(updateEmotion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmotion.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Emotion updated successfully";

        const updated = action.payload;
        state.allEmotionsMap[updated.id] = {
          ...state.allEmotionsMap[updated.id],
          ...updated,
        };
        state.paginatedEmotions = state.paginatedEmotions.map((e) =>
          e.id === updated.id ? { ...e, ...updated } : e
        );
      })
      .addCase(updateEmotion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // === TOGGLE EMOTION STATUS ===
      .addCase(toggleEmotionStatus.fulfilled, (state, action) => {
        const { id, isDisabled, message } = action.payload;
        state.message = message;

        // update allEmotionsMap
        if (state.allEmotionsMap[id]) {
          state.allEmotionsMap[id] = {
            ...state.allEmotionsMap[id],
            isDisabled,
          };
        }

        // update paginatedEmotions nếu emotion đang hiển thị
        state.paginatedEmotions = state.paginatedEmotions.map((e) =>
          e.id === id ? { ...e, isDisabled } : e
        );
      })
      .addCase(toggleEmotionStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  clearEmotionState,
  prependEmotion,
  updateEmotionRealtime,
  removeEmotionRealtime,
} = emotionSlice.actions;
export default emotionSlice.reducer;
