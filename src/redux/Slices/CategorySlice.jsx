import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../api/api";

// === GET ALL CATEGORIES (pagination) ===
export const getAllCategories = createAsyncThunk(
  "category/getAllCategories",
  async ({ pageSize = 10, startAfterId }, { rejectWithValue }) => {
    try {
      const res = await Api.get("/category", {
        params: { pageSize, startAfterId },
      });
      console.log(res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// === CREATE CATEGORY ===
export const createCategory = createAsyncThunk(
  "category/createCategory",
  async ({ name, description, image }, { rejectWithValue }) => {
    try {
      const res = await Api.post("/category", { name, description, image });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// === UPDATE CATEGORY ===
export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, name, description, image }, { rejectWithValue }) => {
    try {
      const res = await Api.patch(`/category/${id}`, {
        name,
        description,
        image,
      });
      return res.data.category;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// === TOGGLE CATEGORY STATUS ===
export const toggleCategoryStatus = createAsyncThunk(
  "category/toggleCategoryStatus",
  async ({ id, isDisabled }, { rejectWithValue }) => {
    try {
      const res = await Api.patch(`/category/${id}/status`, { isDisabled });
      return { id, isDisabled, message: res.data.message || "Status updated" };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
// === UPLOAD IMAGE ===
export const uploadImage = createAsyncThunk(
  "category/uploadImage",
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
  "category/updateCategoryImage",
  async ({ id, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await Api.patch(
        `/file/update/${id}/image?type=category`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return { category: res.data.category, imageUrl: res.data.imageUrl };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
const categorySlice = createSlice({
  name: "category",
  initialState: {
    allCategoriesMap: {},
    paginatedCategories: [],
    total: 0,
    pageSize: 10,
    nextCursor: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearCategoryState: (state) => {
      state.error = null;
      state.message = null;
    },
    prependCategory: (state, action) => {
      const newCategory = action.payload;
      if (!state.paginatedCategories.some((c) => c.id === newCategory.id)) {
        state.paginatedCategories.unshift(newCategory);
        state.allCategoriesMap[newCategory.id] = newCategory;
      }
    },
    updateCategoryRealtime: (state, action) => {
      const updated = action.payload;
      state.allCategoriesMap[updated.id] = {
        ...state.allCategoriesMap[updated.id],
        ...updated,
      };
      state.paginatedCategories = state.paginatedCategories.map((c) =>
        c.id === updated.id ? { ...c, ...updated } : c
      );
    },
    removeCategoryRealtime: (state, action) => {
      const id = action.payload;
      delete state.allCategoriesMap[id];
      state.paginatedCategories = state.paginatedCategories.filter(
        (c) => c.id !== id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // === GET ALL CATEGORIES ===
      .addCase(getAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.loading = false;

        const newCategories = action.payload.categories.map((c) => ({
          ...state.allCategoriesMap[c.id],
          ...c,
        }));

        const combined = [...state.paginatedCategories, ...newCategories];
        state.paginatedCategories = Array.from(
          new Map(combined.map((c) => [c.id, c])).values()
        );

        newCategories.forEach((c) => {
          state.allCategoriesMap[c.id] = c;
        });

        state.nextCursor = action.payload.nextCursor;
        state.total = action.payload.total;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // === CREATE CATEGORY ===
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Category created successfully";

        const newCategory = action.payload;
        state.allCategoriesMap[newCategory.id] = newCategory;
        state.paginatedCategories.unshift(newCategory);
        if (state.paginatedCategories.length > state.pageSize) {
          state.paginatedCategories.pop();
        }

        state.total += 1;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // === UPDATE CATEGORY ===
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Category updated successfully";

        const updated = action.payload;
        state.allCategoriesMap[updated.id] = {
          ...state.allCategoriesMap[updated.id],
          ...updated,
        };
        state.paginatedCategories = state.paginatedCategories.map((c) =>
          c.id === updated.id ? { ...c, ...updated } : c
        );
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // === TOGGLE CATEGORY STATUS ===
      .addCase(toggleCategoryStatus.fulfilled, (state, action) => {
        const { id, isDisabled, message } = action.payload;
        state.message = message;

        if (state.allCategoriesMap[id]) {
          state.allCategoriesMap[id] = {
            ...state.allCategoriesMap[id],
            isDisabled,
          };
        }
        state.paginatedCategories = state.paginatedCategories.map((c) =>
          c.id === id ? { ...c, isDisabled } : c
        );
      })
      .addCase(toggleCategoryStatus.rejected, (state, action) => {
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

        const updated = action.payload.category;
        state.allCategoriesMap[updated.id] = {
          ...state.allCategoriesMap[updated.id],
          ...updated,
        };
        state.paginatedCategories = state.paginatedCategories.map((e) =>
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
  clearCategoryState,
  prependCategory,
  updateCategoryRealtime,
  removeCategoryRealtime,
} = categorySlice.actions;
export default categorySlice.reducer;
