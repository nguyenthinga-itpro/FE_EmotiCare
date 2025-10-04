import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../api/api";
// === GET ALL CHAT SESSIONS WITH PAGINATION ===
export const getAllChatSessions = createAsyncThunk(
  "chatSession/getAllChatSessions",
  async ({ pageSize = 10, startAfter }, thunkAPI) => {
    try {
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      const res = await Api.get("/chatsession", {
        params: { pageSize, startAfter, startAt: thirtyDaysAgo },
      });
      return res.data; // { sessions, nextCursor, pageSize }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// === CREATE SESSION ===
export const createSession = createAsyncThunk(
  "chatSession/createSession",
  async ({ userId, chatAIId }, thunkAPI) => {
    try {
      const response = await Api.post("/chatsession/create", {
        userId,
        chatAIId,
      });
      console.log(response.data);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// === SEND MESSAGE ===
export const sendMessage = createAsyncThunk(
  "chatSession/sendMessage",
  async ({ sessionId, sender, text }, thunkAPI) => {
    try {
      const response = await Api.post(`/chatsession/${sessionId}/sendMessage`, {
        sender,
        text,
      });
      return { sessionId, sender, text, aiReply: response.data.aiReply };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// === FETCH SINGLE SESSION ===
export const fetchSessionById = createAsyncThunk(
  "chatSession/fetchSessionById",
  async (sessionId, thunkAPI) => {
    try {
      const response = await Api.get(`/chatsession/${sessionId}`);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// === SSE: REALTIME SUBSCRIBE ===
export const subscribeSession = createAsyncThunk(
  "chatSession/subscribeSession",
  async ({ sessionId }, thunkAPI) => {
    try {
      const eventSource = new Api.EventSource(
        `/chatsession/${sessionId}/subscribe`
      );

      eventSource.onmessage = (event) => {
        const message = JSON.parse(event.data);
        thunkAPI.dispatch(addRealtimeMessage(message));
      };

      eventSource.onerror = () => eventSource.close();

      return { sessionId };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const chatSessionSlice = createSlice({
  name: "chatSession",
  initialState: {
    sessions: [],
    currentSessionId: null,
    systemPrompt: null,
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    // 🔹 Thêm tin nhắn realtime hoặc optimistic
    addRealtimeMessage: (state, action) => {
      const exists = state.messages.some(
        (m) =>
          m.text === action.payload.text && m.sender === action.payload.sender
      );
      if (exists) return;
      state.messages.push(action.payload);
      state.messages.sort((a, b) => a.createdAt - b.createdAt);
    },

    // 🔹 Xóa session khi unmount
    clearSession: (state) => {
      state.sessions = [];
      state.currentSessionId = null;
      state.messages = [];
      state.systemPrompt = null;
    },
    // 🔹 Cập nhật trạng thái tin nhắn (sending -> sent/failed)
    updateMessageStatus: (state, action) => {
      const { tempId, status, id } = action.payload;
      const msg = state.messages.find((m) => m.id === tempId);
      if (msg) {
        msg.status = status;
        if (id) msg.id = id;
      }
    },
    setCurrentSessionId: (state, action) => {
      state.currentSessionId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllChatSessions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllChatSessions.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.meta.arg.startAfter) {
          // Lần đầu load → gán mới
          state.sessions = action.payload.sessions;
        } else {
          // load thêm → append
          state.sessions = [...state.sessions, ...action.payload.sessions];
        }
        state.nextCursor = action.payload.nextCursor;
        state.pageSize = action.payload.pageSize;
      })

      .addCase(getAllChatSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // === CREATE SESSION ===
      .addCase(createSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSessionId = action.payload.sessionId;
        state.messages = [
          {
            sender: "user",
            // text: action.meta.arg.initialMessage,
            createdAt: Date.now(),
          },
          {
            sender: "ai",
            text: action.payload.aiReply,
            createdAt: Date.now(),
          },
        ];
      })
      .addCase(createSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === SEND MESSAGE ===
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { aiReply } = action.payload;
        if (aiReply) {
          state.messages.push({
            id: Date.now(), // Hoặc để null, SSE sẽ cập nhật sau
            sender: "ai",
            text: aiReply,
            createdAt: Date.now(),
            temp: true, // đánh dấu là tạm
          });
        }
        state.messages.sort((a, b) => a.createdAt - b.createdAt);
      })

      // === FETCH SESSION ===
      .addCase(fetchSessionById.fulfilled, (state, action) => {
        const { id, systemPrompt, messages } = action.payload;
        state.currentSessionId = id;
        state.systemPrompt = systemPrompt;
        state.messages = Object.values(messages || {}).sort(
          (a, b) => a.createdAt - b.createdAt
        );
      });
  },
});

export const {
  addRealtimeMessage,
  clearSession,
  updateMessageStatus,
  setCurrentSessionId,
} = chatSessionSlice.actions;

export default chatSessionSlice.reducer;
