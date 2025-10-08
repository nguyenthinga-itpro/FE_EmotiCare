// src/redux/slices/faqSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Api/api";

// === GET ALL FAQs (pagination) ===
export const getAllFaqs = createAsyncThunk(
  "faq/getAllFaqs",
  async ({ pageSize = 10, startAfterId }, { rejectWithValue }) => {
    try {
      const res = await Api.get("/faq", {
        params: { pageSize, startAfterId },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// === CREATE FAQ ===
export const createFaq = createAsyncThunk(
  "faq/createFaq",
  async ({ question, answer, category }, { rejectWithValue }) => {
    try {
      const res = await Api.post("/faq", { question, answer, category });
      return res.data.faq;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// === UPDATE FAQ ===
export const updateFaq = createAsyncThunk(
  "faq/updateFaq",
  async ({ id, question, answer, category }, { rejectWithValue }) => {
    try {
      const res = await Api.patch(`/faq/${id}/faq`, {
        question,
        answer,
        category,
      });
      return res.data.faq;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// === TOGGLE FAQ STATUS ===
export const toggleFaqStatus = createAsyncThunk(
  "faq/toggleFaqStatus",
  async ({ id, isDisabled }, { rejectWithValue }) => {
    try {
      const res = await Api.patch(`/faq/${id}/status`, { isDisabled });
      return { id, isDisabled, message: res.data.message || "Status updated" };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const faqSlice = createSlice({
  name: "faq",
  initialState: {
    allFaqsMap: {},
    paginatedFaqs: [],
    total: 0,
    pageSize: 10,
    nextCursor: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearFaqState: (state) => {
      state.error = null;
      state.message = null;
    },
    prependFaq: (state, action) => {
      const newFaq = action.payload;
      if (!state.paginatedFaqs.some((e) => e.id === newFaq.id)) {
        state.paginatedFaqs.unshift(newFaq);
        state.allFaqsMap[newFaq.id] = newFaq;
      }
    },
    updateFaqRealtime: (state, action) => {
      const updated = action.payload;
      state.allFaqsMap[updated.id] = {
        ...state.allFaqsMap[updated.id],
        ...updated,
      };
      state.paginatedFaqs = state.paginatedFaqs.map((e) =>
        e.id === updated.id ? { ...e, ...updated } : e
      );
    },
    removeFaqRealtime: (state, action) => {
      const id = action.payload;
      delete state.allFaqsMap[id];
      state.paginatedFaqs = state.paginatedFaqs.filter((e) => e.id !== id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllFaqs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFaqs.fulfilled, (state, action) => {
        state.loading = false;

        const newFaqs = action.payload.faqs.map((e) => ({
          ...state.allFaqsMap[e.id],
          ...e,
        }));

        const combined = [...state.paginatedFaqs, ...newFaqs];
        state.paginatedFaqs = Array.from(
          new Map(combined.map((e) => [e.id, e])).values()
        );

        newFaqs.forEach((e) => {
          state.allFaqsMap[e.id] = e;
        });

        state.nextCursor = action.payload.nextCursor || null;
        state.total = action.payload.total;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(getAllFaqs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFaq.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "FAQ created successfully";

        const newFaq = action.payload;
        state.allFaqsMap[newFaq.id] = newFaq;
        state.paginatedFaqs.unshift(newFaq);

        if (state.paginatedFaqs.length > state.pageSize) {
          state.paginatedFaqs.pop();
        }
        state.total += 1;
      })
      .addCase(createFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFaq.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "FAQ updated successfully";

        const updated = action.payload;
        state.allFaqsMap[updated.id] = {
          ...state.allFaqsMap[updated.id],
          ...updated,
        };
        state.paginatedFaqs = state.paginatedFaqs.map((e) =>
          e.id === updated.id ? { ...e, ...updated } : e
        );
      })
      .addCase(updateFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(toggleFaqStatus.fulfilled, (state, action) => {
        const { id, isDisabled, message } = action.payload;
        state.message = message;

        if (state.allFaqsMap[id]) {
          state.allFaqsMap[id] = {
            ...state.allFaqsMap[id],
            isDisabled,
          };
        }

        state.paginatedFaqs = state.paginatedFaqs.map((e) =>
          e.id === id ? { ...e, isDisabled } : e
        );
      })
      .addCase(toggleFaqStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  clearFaqState,
  prependFaq,
  updateFaqRealtime,
  removeFaqRealtime,
} = faqSlice.actions;
export default faqSlice.reducer;
