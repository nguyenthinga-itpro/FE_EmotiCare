import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Api/api"; 

// === GET ALL CHAT SESSIONS WITH PAGINATION ===
export const getAllChatSessions = createAsyncThunk(
  "chatSession/getAllChatSessions",
  async ({ pageSize = 10, startAfter, userId }, thunkAPI) => {
    try {
      const res = await Api.get(`/chatsession/${userId}`, {
        params: { pageSize, startAfter },
      });
      return { ...res.data, meta: { startAfter } };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// === CREATE SESSION ===
export const createSession = createAsyncThunk(
  "chatSession/createSession",
  async ({ userId, chatAIId, initialMessage }, thunkAPI) => {
    try {
      const response = await Api.post("/chatsession/create", {
        userId,
        chatAIId,
        initialMessage,
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// === SEND MESSAGE ===
export const sendMessage = createAsyncThunk(
  "chatSession/sendMessage",
  async ({ sessionId, sender, text, tempId }, thunkAPI) => {
    try {
      const response = await Api.post(`/chatsession/${sessionId}/sendMessage`, {
        sender,
        text,
      });
      return {
        sessionId,
        sender,
        text,
        aiReply: response.data.aiReply,
        tempId,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue({ message: err.message, tempId });
    }
  }
);

// === FETCH SINGLE SESSION ===
export const fetchSessionById = createAsyncThunk(
  "chatSession/fetchSessionById",
  async (sessionId, thunkAPI) => {
    try {
      const response = await Api.get(
        `/chatsession/${sessionId}/getSessionById`
      );
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
        if (message?.text && message?.sender) {
          if (!message.createdAt) message.createdAt = Date.now();
          thunkAPI.dispatch(addRealtimeMessage(message));
        }
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
    nextCursor: null,
    pageSize: 10,
  },
  reducers: {
    addRealtimeMessage: (state, action) => {
      const exists = state.messages.some(
        (m) =>
          m.text === action.payload.text &&
          m.sender === action.payload.sender &&
          m.createdAt === action.payload.createdAt
      );
      if (exists) return;
      state.messages.push({
        ...action.payload,
        createdAt: action.payload.createdAt || Date.now(),
      });
      state.messages.sort((a, b) => a.createdAt - b.createdAt);
    },
    clearSession: (state) => {
      state.sessions = [];
      // Giữ currentSessionId để tránh undefined liên tục
      state.messages = [];
      state.systemPrompt = null;
      state.nextCursor = null;
    },
    updateMessageStatus: (state, action) => {
      const { tempId, status, id } = action.payload;
      const msg = state.messages.find((m) => m.id === tempId);
      if (msg) {
        msg.status = status;
        if (id) msg.id = id;
      }
    },
    setCurrentSessionId: (state, action) => {
      if (action.payload) state.currentSessionId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL CHAT SESSIONS
      .addCase(getAllChatSessions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllChatSessions.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.meta.arg.startAfter) {
          state.sessions = action.payload.sessions;
        } else {
          state.sessions = [...state.sessions, ...action.payload.sessions];
        }
        state.nextCursor = action.payload.nextCursor;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(getAllChatSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE SESSION
      .addCase(createSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSessionId = action.payload.sessionId;
        state.messages = [
          {
            sender: "user",
            text: action.payload.initialMessage || "",
            createdAt: Date.now(),
            status: "sent",
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

      // SEND MESSAGE
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { aiReply, tempId } = action.payload;
        if (aiReply) {
          state.messages.push({
            id: Date.now(),
            sender: "ai",
            text: aiReply,
            createdAt: Date.now(),
            temp: true,
          });
        }
        if (tempId) {
          const msg = state.messages.find((m) => m.id === tempId);
          if (msg) msg.status = "sent";
        }
        state.messages.sort((a, b) => a.createdAt - b.createdAt);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        const { tempId } = action.payload || {};
        if (tempId) {
          const msg = state.messages.find((m) => m.id === tempId);
          if (msg) msg.status = "failed";
        }
      })

      // FETCH SINGLE SESSION
      .addCase(fetchSessionById.fulfilled, (state, action) => {
        const { id, systemPrompt, messages } = action.payload;
        if (id) state.currentSessionId = id; // chỉ set nếu id tồn tại
        state.systemPrompt = systemPrompt;
        state.messages = Array.isArray(messages)
          ? messages.sort((a, b) => a.createdAt - b.createdAt)
          : Object.values(messages || {}).sort(
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
