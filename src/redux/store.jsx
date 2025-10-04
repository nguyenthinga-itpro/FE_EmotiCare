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
import postcardCommentReducer from "../redux/Slices/PostcardCommentSlice";
import postcardFavoriteReducer from "../redux/Slices/PostcardFavoriteSlice";
import chatSessionReducer from "../redux/Slices/ChatSessionSlice";
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
    comment: postcardCommentReducer,
    favorite: postcardFavoriteReducer,
    theme: themeReducer,
    chatSession: chatSessionReducer,
  },
});
