// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/Slices/AuthSlice";
import userReducer from "../redux/Slices/UserSlice";
import emotionReducer from "../redux/Slices/EmotionSlice";
import chatReducer from "../redux/Slices/ChatAISlice";
import postcardReducer from "../redux/Slices/PostcardSlice";
import faqReducer from "../redux/Slices/FAQSlice";
import resourceReducer from "../redux/Slices/ResourseSlice";
import categoryReducer from "../redux/Slices/CategorySlice";
import themeReducer from "../redux/Slices/ThemeSlice";
export const store = configureStore({
  reducer: {
    user: authReducer,
    users: userReducer,
    emotion: emotionReducer,
    chat: chatReducer,
    postcard: postcardReducer,
    faq: faqReducer,
    resource: resourceReducer,
    category: categoryReducer,
    theme: themeReducer,
  },
});
