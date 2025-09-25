import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../api/api";

// === GET ALL Chats (pagination) ===
export const getAllChats = createAsyncThunk(
  "chat/getAllChats",
  async ({ pageSize = 10, startAfterId }, { rejectWithValue }) => {
    try {
      const res = await Api.get("/chat", {
        params: { pageSize, startAfterId },
      });
      return res.data; // { chats, total, pageSize, nextCursor }
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// === CREATE Chat ===
export const createChat = createAsyncThunk(
  "chat/createChat",
  async (
    { name, systemPrompt, description, defaultGreeting, image, categoryId },
    { rejectWithValue }
  ) => {
    try {
      const res = await Api.post("/chat", {
        name,
        systemPrompt,
        description,
        defaultGreeting,
        image,
        categoryId,
      });
      return res.data.chat;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// === UPDATE Chat ===
export const updateChat = createAsyncThunk(
  "chat/updateChat",
  async (
    { id, name, systemPrompt, description, defaultGreeting, image, categoryId },
    { rejectWithValue }
  ) => {
    try {
      const res = await Api.patch(`/chat/${id}`, {
        name,
        systemPrompt,
        description,
        defaultGreeting,
        image,
        categoryId,
      });
      return res.data.chat;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// === TOGGLE Chat STATUS ===
export const toggleChatStatus = createAsyncThunk(
  "chat/toggleChatStatus",
  async ({ id, isDisabled }, { rejectWithValue }) => {
    try {
      const res = await Api.patch(`/chat/${id}/status`, { isDisabled });
      return { id, isDisabled, message: res.data.message || "Status updated" };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// === UPLOAD IMAGE (avatar/emoji) ===
export const uploadImage = createAsyncThunk(
  "chat/uploadImage",
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

// === UPDATE IMAGE ===
export const updateImage = createAsyncThunk(
  "chat/updateImage",
  async ({ id, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await Api.patch(`/file/update/${id}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return { chat: res.data.chat, imageUrl: res.data.imageUrl };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    allChatsMap: {},
    paginatedChats: [],
    total: 0,
    pageSize: 10,
    nextCursor: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearChatState: (state) => {
      state.error = null;
      state.message = null;
    },
    prependChat: (state, action) => {
      const newChat = action.payload;
      if (!state.paginatedChats.some((c) => c.id === newChat.id)) {
        state.paginatedChats.unshift(newChat);
        state.allChatsMap[newChat.id] = newChat;
      }
    },
    updateChatRealtime: (state, action) => {
      const updated = action.payload;
      state.allChatsMap[updated.id] = {
        ...state.allChatsMap[updated.id],
        ...updated,
      };
      state.paginatedChats = state.paginatedChats.map((c) =>
        c.id === updated.id ? { ...c, ...updated } : c
      );
    },
    removeChatRealtime: (state, action) => {
      const id = action.payload;
      delete state.allChatsMap[id];
      state.paginatedChats = state.paginatedChats.filter((c) => c.id !== id);
    },
  },
  extraReducers: (builder) => {
    builder
      // === GET ALL Chats ===
      .addCase(getAllChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllChats.fulfilled, (state, action) => {
        state.loading = false;

        const newChats = (action.payload.chats || []).map((c) => ({
          ...state.allChatsMap[c.id],
          ...c,
        }));

        const combined = [...state.paginatedChats, ...newChats];
        state.paginatedChats = Array.from(
          new Map(combined.map((c) => [c.id, c])).values()
        );

        newChats.forEach((c) => {
          state.allChatsMap[c.id] = c;
        });

        state.nextCursor = action.payload.nextCursor;
        state.total = action.payload.total;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(getAllChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === CREATE Chat ===
      .addCase(createChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Chat created successfully";

        const newChat = action.payload;
        state.allChatsMap[newChat.id] = newChat;
        state.paginatedChats.unshift(newChat);

        if (state.paginatedChats.length > state.pageSize) {
          state.paginatedChats.pop();
        }
        state.total += 1;
      })
      .addCase(createChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === UPDATE Chat ===
      .addCase(updateChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateChat.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Chat updated successfully";

        const updated = action.payload;
        state.allChatsMap[updated.id] = {
          ...state.allChatsMap[updated.id],
          ...updated,
        };
        state.paginatedChats = state.paginatedChats.map((c) =>
          c.id === updated.id ? { ...c, ...updated } : c
        );
      })
      .addCase(updateChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === TOGGLE Chat STATUS ===
      .addCase(toggleChatStatus.fulfilled, (state, action) => {
        const { id, isDisabled, message } = action.payload;
        state.message = message;

        if (state.allChatsMap[id]) {
          state.allChatsMap[id] = {
            ...state.allChatsMap[id],
            isDisabled,
          };
        }

        state.paginatedChats = state.paginatedChats.map((c) =>
          c.id === id ? { ...c, isDisabled } : c
        );
      })
      .addCase(toggleChatStatus.rejected, (state, action) => {
        state.error = action.payload;
      })

      // === UPLOAD IMAGE ===
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Image uploaded successfully";
        state.uploadedImageUrl = action.payload;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === UPDATE IMAGE ===
      .addCase(updateImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateImage.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Image updated successfully";

        const updated = action.payload.chat;
        state.allChatsMap[updated.id] = {
          ...state.allChatsMap[updated.id],
          ...updated,
        };
        state.paginatedChats = state.paginatedChats.map((c) =>
          c.id === updated.id ? { ...c, ...updated } : c
        );
      })
      .addCase(updateImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearChatState,
  prependChat,
  updateChatRealtime,
  removeChatRealtime,
} = chatSlice.actions;

export default chatSlice.reducer;
