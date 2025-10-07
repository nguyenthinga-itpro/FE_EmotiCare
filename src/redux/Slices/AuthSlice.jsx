// src/features/user/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "../../config/firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import Api from "../../Api/api"; // axios instance

// === REGISTER ===
export const register = createAsyncThunk(
  "user/register",
  async ({ email, password, name, gender, birthday }, { rejectWithValue }) => {
    try {
      const res = await Api.post("/auth/register", {
        email,
        password,
        name,
        gender,
        birthday,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// === VERIFY EMAIL ===
export const verifyEmail = createAsyncThunk(
  "user/verifyEmail",
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await Api.post("/auth/verify", { email });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// === LOGIN (email/password) ===
export const loginEmail = createAsyncThunk(
  "user/loginEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const idToken = await user.getIdToken();

      const res = await Api.post("/auth/login", { idToken });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// === LOGIN (Google) ===
export const loginGoogle = createAsyncThunk(
  "user/loginGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const res = await Api.post("/auth/google", { token: idToken });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// === LOGOUT ===
// FETCH CURRENT USER FROM COOKIE
export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get("/auth/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      console.log("fetchMe response:", res.data);
      return res.data; // { user }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.post("/auth/logout", {});
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// === FORGOT PASSWORD (gửi OTP) ===
export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await Api.post("/auth/forgotpassword", { email });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// === VERIFY OTP ===
export const verifyOTP = createAsyncThunk(
  "user/verifyOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await Api.post("/auth/otp", { email, otp });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// === RESET PASSWORD ===
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ email, newPassword }, { rejectWithValue }) => {
    try {
      const res = await Api.post("/auth/resetpassword", {
        email,
        newPassword,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const authSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    token: null,
    isLoggedIn: false,
    loading: false, // login/register
    loadingMe: true, // restore user
    error: null,
    message: null,
  },
  reducers: {
    clearAuthState: (state) => {
      state.error = null;
      state.message = null;
    },
    // logout: (state) => {
    //   state.currentUser = null;
    //   state.token = null;
    //   state.isLoggedIn = false;
    //   state.error = null;
    // },
  },
  extraReducers: (builder) => {
    // REGISTER
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        // chưa login ngay sau register
        state.currentUser = null;
        state.isLoggedIn = false;
        // Lưu email vào localStorage để verify sau này
        if (action.meta.arg.email) {
          localStorage.setItem("users.email", action.meta.arg.email);
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // VERIFY EMAIL
    builder
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.error = action.payload;
      });

    // LOGIN (email)
    builder
      .addCase(loginEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })
      .addCase(loginEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // LOGIN (Google)
    builder
      .addCase(loginGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })
      .addCase(loginGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(fetchMe.pending, (state) => {
        state.loadingMe = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loadingMe = false;
        state.currentUser = action.payload.user;
        state.isLoggedIn = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loadingMe = false;
        state.currentUser = null;
        state.isLoggedIn = false;
      });

    builder.addCase(logout.fulfilled, (state) => {
      state.currentUser = null;
      state.isLoggedIn = false;
      state.token = null;
    });
    // FORGOT PASSWORD
    builder
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.error = action.payload;
      });

    // VERIFY OTP
    builder
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.error = action.payload;
      });

    // RESET PASSWORD
    builder
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
