// src/redux/slices/resourceSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../api/api";

// === GET ALL RESOURCES (pagination) ===
export const getAllResources = createAsyncThunk(
  "resource/getAllResources",
  async (
    { pageSize = 10, startAfterId, sort = "desc" },
    { rejectWithValue }
  ) => {
    try {
      const res = await Api.get("/resource", {
        params: { pageSize, startAfterId, sort },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
// === GET RESOURCE BY ID ===
export const getResourceById = createAsyncThunk(
  "resource/getResourceById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await Api.get(`/resource/${id}`);
      return res.data; // trả về object resource luôn
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// === CREATE RESOURCE ===
export const createResource = createAsyncThunk(
  "resource/createResource",
  async (
    { title, description, type, url, image, query, categoryId },
    { rejectWithValue }
  ) => {
    try {
      const res = await Api.post("/resource", {
        title,
        description,
        type,
        url,
        image,
        query, // thêm cho Google News
        categoryId, // nếu muốn phân loại
      });

      // backend trả về resource hoặc resources (Google News)
      if (res.data.resource) return res.data.resource;
      if (res.data.resources) return res.data.resources;

      return null;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// === UPDATE RESOURCE ===
export const updateResource = createAsyncThunk(
  "resource/updateResource",
  async ({ id, url, updateVideo = false }, { rejectWithValue }) => {
    try {
      const res = await Api.patch(`/resource/${id}`, { url, updateVideo });
      return res.data.resource;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// === TOGGLE RESOURCE STATUS ===
export const toggleResourceStatus = createAsyncThunk(
  "resource/toggleResourceStatus",
  async ({ id, isDisabled }, { rejectWithValue }) => {
    try {
      const res = await Api.patch(`/resource/${id}/status`, { isDisabled });
      return { id, isDisabled, message: res.data.message || "Status updated" };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const resourceSlice = createSlice({
  name: "resource",
  initialState: {
    allResourcesMap: {},
    paginatedResources: [],
    total: 0,
    pageSize: 10,
    nextCursor: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearResourceState: (state) => {
      state.error = null;
      state.message = null;
    },
    prependResource: (state, action) => {
      const newRes = action.payload;
      if (!state.paginatedResources.some((e) => e.id === newRes.id)) {
        state.paginatedResources.unshift(newRes);
        state.allResourcesMap[newRes.id] = newRes;
      }
    },
    updateResourceRealtime: (state, action) => {
      const updated = action.payload;
      state.allResourcesMap[updated.id] = {
        ...state.allResourcesMap[updated.id],
        ...updated,
      };
      state.paginatedResources = state.paginatedResources.map((e) =>
        e.id === updated.id ? { ...e, ...updated } : e
      );
    },
    removeResourceRealtime: (state, action) => {
      const id = action.payload;
      delete state.allResourcesMap[id];
      state.paginatedResources = state.paginatedResources.filter(
        (e) => e.id !== id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllResources.fulfilled, (state, action) => {
        state.loading = false;

        const newResources = action.payload.resources.map((e) => ({
          ...state.allResourcesMap[e.id],
          ...e,
        }));

        const combined = [...state.paginatedResources, ...newResources];
        state.paginatedResources = Array.from(
          new Map(combined.map((e) => [e.id, e])).values()
        );

        newResources.forEach((e) => {
          state.allResourcesMap[e.id] = e;
        });

        state.nextCursor = action.payload.nextCursor || null;
        state.total = action.payload.total;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(getAllResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getResourceById.fulfilled, (state, action) => {
        const resource = action.payload;
        state.allResourcesMap[resource.id] = resource;
        const exist = state.paginatedResources.some(
          (e) => e.id === resource.id
        );
        if (!exist) {
          state.paginatedResources.unshift(resource);
        }
      })
      .addCase(getResourceById.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(createResource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createResource.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Resource created successfully";

        const newRes = action.payload;
        state.allResourcesMap[newRes.id] = newRes;
        state.paginatedResources.unshift(newRes);

        if (state.paginatedResources.length > state.pageSize) {
          state.paginatedResources.pop();
        }
        state.total += 1;
      })
      .addCase(createResource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateResource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateResource.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Resource updated successfully";

        const updated = action.payload;
        state.allResourcesMap[updated.id] = {
          ...state.allResourcesMap[updated.id],
          ...updated,
        };
        state.paginatedResources = state.paginatedResources.map((e) =>
          e.id === updated.id ? { ...e, ...updated } : e
        );
      })
      .addCase(updateResource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(toggleResourceStatus.fulfilled, (state, action) => {
        const { id, isDisabled, message } = action.payload;
        state.message = message;

        if (state.allResourcesMap[id]) {
          state.allResourcesMap[id] = {
            ...state.allResourcesMap[id],
            isDisabled,
          };
        }

        state.paginatedResources = state.paginatedResources.map((e) =>
          e.id === id ? { ...e, isDisabled } : e
        );
      })
      .addCase(toggleResourceStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  clearResourceState,
  prependResource,
  updateResourceRealtime,
  removeResourceRealtime,
} = resourceSlice.actions;
export default resourceSlice.reducer;
