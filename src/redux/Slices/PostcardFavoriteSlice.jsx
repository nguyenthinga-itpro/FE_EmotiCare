import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Api/api"; 

// === FETCH ALL FAVORITES ===
// Trả về object: { postcardId1: totalFavorites, postcardId2: totalFavorites, ... }
export const fetchAllFavorites = createAsyncThunk(
  "favorite/fetchAllFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get(`/favorite`);
      return res.data?.favorites || {}; // đảm bảo luôn là object
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// === TOGGLE FAVORITE ===
export const toggleFavorite = createAsyncThunk(
  "favorite/toggleFavorite",
  async ({ postcardId, userId }, { rejectWithValue }) => {
    try {
      const res = await Api.post(`/favorite/${postcardId}/favorite`, {
        userId,
      });
      return { postcardId, isFavorite: res.data.isFavorite }; // đúng với server trả về
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// === GET FAVORITE INFO FOR A POSTCARD ===
export const getFavoriteInfo = createAsyncThunk(
  "favorite/getFavoriteInfo",
  async ({ postcardId, userId }, { rejectWithValue }) => {
    try {
      const res = await Api.get(`/favorite/${postcardId}/favorite`, {
        params: { userId },
      });
      return { postcardId, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const PostcardFavoriteSlice = createSlice({
  name: "favorite",
  initialState: {
    favorites: {}, // { postcardId: { totalFavorites, isFavorite } }
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // --- FETCH ALL FAVORITES ---
    builder
      .addCase(fetchAllFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllFavorites.fulfilled, (state, action) => {
        state.loading = false;
        const allFavs = action.payload || {};
        Object.keys(allFavs).forEach((postcardId) => {
          if (!state.favorites[postcardId]) state.favorites[postcardId] = {};
          state.favorites[postcardId].totalFavorites = allFavs[postcardId] || 0;
          if (state.favorites[postcardId].isFavorite === undefined)
            state.favorites[postcardId].isFavorite = false;
        });
      })
      .addCase(fetchAllFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // --- TOGGLE FAVORITE ---
    builder
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { postcardId, isFavorite } = action.payload;
        if (!state.favorites[postcardId]) state.favorites[postcardId] = {};
        state.favorites[postcardId].isFavorite = isFavorite;
        const prevCount = state.favorites[postcardId].totalFavorites || 0;
        state.favorites[postcardId].totalFavorites = Math.max(
          0,
          isFavorite ? prevCount + 1 : prevCount - 1
        );
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.error = action.payload;
      });

    // --- GET FAVORITE INFO ---
    builder.addCase(getFavoriteInfo.fulfilled, (state, action) => {
      const {
        postcardId,
        totalFavorites = 0,
        isFavorite = false,
      } = action.payload;
      state.favorites[postcardId] = { totalFavorites, isFavorite };
    });
  },
});

export default PostcardFavoriteSlice.reducer;
