// src/redux/slices/themeSlice.js
import { createSlice } from "@reduxjs/toolkit";
import colors from "../../Themes/Colors";

const initialMode = localStorage.getItem("theme") || "light";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: initialMode, // light | dark
    colors: colors[initialMode],
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      state.colors = colors[state.mode];
      localStorage.setItem("theme", state.mode);
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      state.colors = colors[action.payload];
      localStorage.setItem("theme", action.payload);
    },
    setPrimaryColor: (state, action) => {
      state.colors = { ...state.colors, primary: action.payload };
    },
  },
});

export const { toggleTheme, setTheme, setPrimaryColor } = themeSlice.actions;
export default themeSlice.reducer;
