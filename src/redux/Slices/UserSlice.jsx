import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Api/api"; 
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateEmail,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
// === GET ALL USERS (pagination) ===
export const getAllUsers = createAsyncThunk(
  "users/getAllUsers",
  async ({ pageSize = 10, startAfterId }, { rejectWithValue }) => {
    try {
      const res = await Api.get("/user", {
        params: { pageSize, startAfterId },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
// === GET USER BY ID ===
export const getUserById = createAsyncThunk(
  "users/getUserById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await Api.get(`/user/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
// === CREATE USER ===
export const createUser = createAsyncThunk(
  "users/createUser",
  async ({ name, email, role, gender }, { rejectWithValue }) => {
    try {
      const res = await Api.post("/user", { name, email, role, gender });
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
// === UPDATE USER ===
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, ...updates }, { rejectWithValue }) => {
    try {
      const res = await Api.patch(`/user/${id}`, updates);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
// === UPDATE USER EMAIL ===
export const updateUserEmail = createAsyncThunk(
  "users/updateUserEmail",
  async ({ id, currentPassword, newEmail }, { rejectWithValue }) => {
    try {
      console.log("[updateUserEmail] start...", { id, newEmail });
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user found");
      if (!currentPassword) throw new Error("Current password is required");
      if (!newEmail) throw new Error("New email is required");
      // 1. Reauthenticate user with current password
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      console.log("[updateUserEmail] Reauthenticated successfully");
      // 2. Update email in Firebase Auth
      await updateEmail(user, newEmail);
      console.log("[updateUserEmail] Firebase Auth email updated");
      // 3. Update email in Firestore (users collection)
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, { email: newEmail });
      console.log("[updateUserEmail] Firestore email updated");
      // 4. (Optional) Update backend API
      await Api.patch(`/user/${id}/email`, { email: newEmail });
      console.log("[updateUserEmail] Backend email updated");
      return { id, email: newEmail };
    } catch (err) {
      console.error("[updateUserEmail] error:", err);
      return rejectWithValue(err.message);
    }
  }
);
export const checkEmailVerified = createAsyncThunk(
  "users/checkEmailVerified",
  async (currentPassword, { rejectWithValue }) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("User is not logged in");
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      return { success: true };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
// === UPDATE USER PASSWORD (Firebase Auth) ===
export const updateUserPassword = createAsyncThunk(
  "users/updateUserPassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("User is not logged in");
      // Reauthenticate (yêu cầu nếu đăng nhập lâu)
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      // Update password
      await updatePassword(user, newPassword);
      return { message: "Password updated successfully" };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
// === TOGGLE USER STATUS ===
export const toggleUserStatus = createAsyncThunk(
  "users/toggleUserStatus",
  async ({ id, isDisabled }, { rejectWithValue }) => {
    try {
      const res = await Api.patch(`/user/${id}/status`, { isDisabled });
      return { id, isDisabled, message: res.data.message || "Status updated" };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
// === UPLOAD USER AVATAR ===
export const uploadUserAvatar = createAsyncThunk(
  "users/uploadUserAvatar",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await Api.post("/file/uploaduserimage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.imageUrl;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
// === UPDATE USER IMAGE ===
export const updateUserImage = createAsyncThunk(
  "users/updateUserImage",
  async ({ id, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await Api.patch(
        `/file/updateuserimage/${id}/image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return res.data; // { user, imageUrl }
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
// === DASHBOARD STATS ===
export const getDashboardStats = createAsyncThunk(
  "users/getDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get("/user/statistic");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
// === STATS BY PERIOD ===
export const getStatsByPeriod = createAsyncThunk(
  "users/getStatsByPeriod",
  async (
    { type = "users", period = "week", start, end },
    { rejectWithValue }
  ) => {
    try {
      const params = { type, period };
      if (start) params.start = start;
      if (end) params.end = end;
      const res = await Api.get("/user/statsByPeriod", { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
// === USER SLICE ===
const initialState = {
  allUsersMap: {},
  paginatedUsers: [],
  total: 0,
  pageSize: 10,
  nextCursor: null,
  loading: false,
  error: null,
  message: null,
  dashboardStats: {},
  statsByPeriod: { total: 0 },
  userDetail: null,
};
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUserState: (state) => {
      state.error = null;
      state.message = null;
    },
    resetUserState: () => initialState,
    prependUser: (state, action) => {
      const newUser = action.payload;
      if (!state.paginatedUsers.some((u) => u.id === newUser.id)) {
        state.paginatedUsers.unshift(newUser);
        state.allUsersMap[newUser.id] = newUser;
      }
    },
    updateUserRealtime: (state, action) => {
      const updated = action.payload;
      state.allUsersMap[updated.id] = {
        ...state.allUsersMap[updated.id],
        ...updated,
      };
      state.paginatedUsers = state.paginatedUsers.map((u) =>
        u.id === updated.id ? { ...u, ...updated } : u
      );
    },
    removeUserRealtime: (state, action) => {
      const id = action.payload;
      delete state.allUsersMap[id];
      state.paginatedUsers = state.paginatedUsers.filter((u) => u.id !== id);
    },
  },
  extraReducers: (builder) => {
    // ======== GET ALL USERS ========
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.users.forEach((u) => (state.allUsersMap[u.id] = u));
        const combined = [...state.paginatedUsers, ...action.payload.users];
        state.paginatedUsers = Array.from(
          new Map(combined.map((u) => [u.id, u])).values()
        );
        state.nextCursor = action.payload.nextCursor;
        state.total = action.payload.totalUsers;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // ======== GET USER BY ID ========
    builder
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        const fetchedUser = action.payload;
        state.userDetail = fetchedUser;
        state.allUsersMap[fetchedUser.id] = {
          ...state.allUsersMap[fetchedUser.id],
          ...fetchedUser,
        };
        state.paginatedUsers = state.paginatedUsers.map((u) =>
          u.id === fetchedUser.id ? { ...u, ...fetchedUser } : u
        );
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // ======== CREATE USER ========
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "User created successfully";
        const newUser = action.payload;
        state.allUsersMap[newUser.id] = newUser;
        state.paginatedUsers.unshift(newUser);
        if (state.paginatedUsers.length > state.pageSize)
          state.paginatedUsers.pop();
        state.total += 1;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // ======== UPDATE USER ========
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "User updated successfully";
        const updated = action.payload;
        if (state.userDetail?.id === updated.id)
          state.userDetail = { ...state.userDetail, ...updated };
        state.allUsersMap[updated.id] = {
          ...state.allUsersMap[updated.id],
          ...updated,
        };
        state.paginatedUsers = state.paginatedUsers.map((u) =>
          u.id === updated.id ? { ...u, ...updated } : u
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // ======== UPDATE USER EMAIL ========
    builder
      .addCase(updateUserEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updateUserEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Email updated successfully";
        const updated = action.payload.user;
        if (state.userDetail?.id === updated.id) {
          state.userDetail = { ...state.userDetail, ...updated };
        }
        state.allUsersMap[updated.id] = {
          ...state.allUsersMap[updated.id],
          ...updated,
        };
        state.paginatedUsers = state.paginatedUsers.map((u) =>
          u.id === updated.id ? { ...u, ...updated } : u
        );
      })
      .addCase(updateUserEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    //=========================
    builder
      .addCase(checkEmailVerified.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkEmailVerified.fulfilled, (state) => {
        state.loading = false;
        state.message = "Verified successfully";
      })
      .addCase(checkEmailVerified.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // ======== UPDATE USER PASSWORD ========
    builder
      .addCase(updateUserPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updateUserPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload?.message || "Password updated successfully";
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // ======== TOGGLE STATUS ========
    builder
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const { id, isDisabled, message } = action.payload;
        state.message = message;
        if (state.allUsersMap[id])
          state.allUsersMap[id].isDisabled = isDisabled;
        state.paginatedUsers = state.paginatedUsers.map((u) =>
          u.id === id ? { ...u, isDisabled } : u
        );
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
    // ======== UPLOAD AVATAR ========
    builder.addCase(uploadUserAvatar.fulfilled, (state, action) => {
      state.loading = false;
      state.message = "Avatar updated successfully";
      const imageUrl = action.payload;
      if (state.userDetail?.id) {
        state.userDetail.image = imageUrl;
        state.allUsersMap[state.userDetail.id] = {
          ...state.allUsersMap[state.userDetail.id],
          image: imageUrl,
        };
        state.paginatedUsers = state.paginatedUsers.map((u) =>
          u.id === state.userDetail?.id ? { ...u, image: imageUrl } : u
        );
      }
    });
    // ======== UPDATE USER IMAGE ========
    builder.addCase(updateUserImage.fulfilled, (state, action) => {
      state.loading = false;
      state.message = "Image updated successfully";
      console.log("action.payload:", action.payload); // log payload đầy đủ
      const updated = action.payload?.user || {
        image: action.payload?.imageUrl,
      };
      console.log("updated after fallback:", updated);
      if (!updated) return;
      if (state.userDetail?.id === updated.id)
        state.userDetail = { ...state.userDetail, ...updated };
      if (updated.id)
        state.allUsersMap[updated.id] = {
          ...state.allUsersMap[updated.id],
          ...updated,
        };
      state.paginatedUsers = state.paginatedUsers.map((u) =>
        u.id === updated.id ? { ...u, ...updated } : u
      );
    });
    // ======== DASHBOARD STATS ========
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // ======== STATS BY PERIOD ========
    builder
      .addCase(getStatsByPeriod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStatsByPeriod.fulfilled, (state, action) => {
        state.loading = false;
        state.statsByPeriod = action.payload;
      })
      .addCase(getStatsByPeriod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const {
  clearUserState,
  resetUserState,
  prependUser,
  updateUserRealtime,
  removeUserRealtime,
} = userSlice.actions;
export default userSlice.reducer;
