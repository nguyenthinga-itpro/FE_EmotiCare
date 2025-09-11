// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/Slices/AuthSlice";

export const store = configureStore({
  reducer: {
    user: authReducer,
  },
});
