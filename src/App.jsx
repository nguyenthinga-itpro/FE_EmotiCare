// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "./redux/Slices/AuthSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layouts
import AuthLayout from "./Layouts/AuthLayout/Authlayout.jsx";
import MainUserLayout from "./Layouts/MainUserLayout/MainUserLayout.jsx";
import ExtraUserLayout from "./Layouts/ExtraUserLayout/ExtraUserLayout.jsx";
import AdminLayout from "./Layouts/AdminLayout/AdminLayout.jsx";

// Guest pages
import Home from "./pages/User/Home/Home.jsx";
import More from "./pages/User/More/More.jsx";
import Stories from "./pages/User/Stories/Stories.jsx";
import Contact from "./pages/User/Contact/Contact.jsx";
import Chatbox from "./pages/User/Chatbox/Chatbox.jsx";
import Postcards from "./pages/User/Postcards/Postcards.jsx";
import Error from "./pages/User/Error/Error.jsx";

// User-only pages
import ArticleCard from "./pages/User/ArticleCard/ArticleCard.jsx";
import Chat from "./pages/User/Chat/Chat.jsx";

// Admin-only pages
import Dashboard from "./pages/Admin/DashBoard/Dashboard.jsx";
import Users from "./pages/Admin/UserManagement/UserManagement.jsx";
import Emotions from "./pages/Admin/EmotionManagement/EmotionManagement.jsx";
import ChatAIs from "./pages/Admin/ChatAImanagement/ChatAImanagement.jsx";
import PostcardManagement from "./pages/Admin/PostCardManagement/PostCardManagement.jsx";
import FAQs from "./pages/Admin/FAQManagement/FAQManagement.jsx";
import Resources from "./pages/Admin/ResourceManagement/ResourceManagement.jsx";
import Profile from "./pages/Admin/Profile/Profile.jsx";
import Category from "./pages/Admin/CategoryManagement/CategoryManagement.jsx";

// Auth pages
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/User/Register/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword.jsx";
import Verify from "./pages/User/Verify/Verify.jsx";

function App() {
  const dispatch = useDispatch();
  const { currentUser, isLoggedIn, loadingMe } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(fetchMe()).catch(() => {});
  }, [dispatch]);

  // Guard cho admin
  const AdminRoute = ({ children }) => {
    if (loadingMe || isLoggedIn === null) return <div>Loading...</div>;
    if (!isLoggedIn) return <Navigate to="/" replace />;
    if (currentUser?.role !== "admin") return <Navigate to="/" replace />;
    return children;
  };

  // Guard cho user
  const UserRoute = ({ children }) => {
    if (loadingMe || isLoggedIn === null) return <div>Loading...</div>;
    if (!isLoggedIn) return <Navigate to="/" replace />;
    if (currentUser?.role !== "user") return <Navigate to="/" replace />;
    return children;
  };

  // Guard cho guest (chưa login mới được vào)
  const GuestRoute = ({ children }) => {
    if (loadingMe || isLoggedIn === null) return <div>Loading...</div>;
    if (isLoggedIn) {
      if (currentUser?.role === "admin")
        return <Navigate to="/admin" replace />;
      if (currentUser?.role === "user") return <Navigate to="/user" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Guest routes */}
        <Route
          path="/"
          element={
            <GuestRoute>
              <AuthLayout />
            </GuestRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="more" element={<More />} />
          <Route path="stories" element={<Stories />} />
          <Route path="contact" element={<Contact />} />
          <Route path="chatbox" element={<Chatbox />} />
          <Route path="postcards" element={<Postcards />} />
       
        </Route>

        {/* User routes */}
        <Route
          path="/user/*"
          element={
            <UserRoute>
              <MainUserLayout />
            </UserRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="more" element={<More />} />
          <Route path="stories" element={<Stories />} />
          <Route path="contact" element={<Contact />} />
          <Route path="chatbox" element={<Chatbox />} />

          <Route path="error" element={<Error />} />
        </Route>

        {/* Extra user routes */}
        <Route
          path="/user/*"
          element={
            <UserRoute>
              <ExtraUserLayout />
            </UserRoute>
          }
        >
          <Route path="postcards" element={<Postcards />} />
          <Route path="articlecard" element={<ArticleCard />} />
          <Route path="chat" element={<Chat />} />
          <Route path="error" element={<Error />} />
        </Route>

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="emotions" element={<Emotions />} />
          <Route path="chatais" element={<ChatAIs />} />
          <Route path="postcards" element={<PostcardManagement />} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="resources" element={<Resources />} />
          <Route path="profile" element={<Profile />} />
          <Route path="categories" element={<Category />} />
        </Route>

        {/* Auth pages (login/register) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/verify" element={<Verify />} />   <Route path="error" element={<Error />} />
      </Routes>

      {/* Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </BrowserRouter>
  );
}

export default App;
