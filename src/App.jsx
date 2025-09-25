// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "./redux/Slices/AuthSlice";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/User/Home/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/User/Register/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword.jsx";
import Verify from "./pages/User/Verify/Verify.jsx";
import AdminLayout from "./Layouts/AdminLayout/AdminLayout.jsx";
import Dashboard from "./pages/Admin/DashBoard/Dashboard.jsx";
import Users from "./pages/Admin/UserManagement/UserManagement.jsx";
import Emotions from "./pages/Admin/EmotionManagement/EmotionManagement.jsx";
import ChatAIs from "./pages/Admin/ChatAImanagement/ChatAImanagement.jsx";
import Postcards from "./pages/Admin/PostCardManagement/PostCardManagement.jsx";
import FAQs from "./pages/Admin/FAQManagement/FAQManagement.jsx";
import Resources from "./pages/Admin/ResourceManagement/ResourceManagement.jsx";
import Profile from "./pages/Admin/Profile/Profile.jsx";
import Category from "./pages/Admin/CategoryManagement/CategoryManagement.jsx";

function App() {
  const dispatch = useDispatch();
  const { currentUser, isLoggedIn, loadingMe } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    console.log("App mounted, fetching current user...");
    dispatch(fetchMe())
      .unwrap()
      .then((data) => console.log("fetchMe fulfilled:", data))
      .catch((err) => console.error("fetchMe rejected:", err));
  }, [dispatch]);

  const AdminRoute = ({ children }) => {
    if (loadingMe || isLoggedIn === null) {
      console.log("Still loading user or login status undetermined");
      return <div>Loading...</div>;
    }

    if (!isLoggedIn) {
      console.log("User not logged in, redirect to /login");
      return <Navigate to="/login" replace />;
    }

    if (currentUser?.role !== "admin") {
      console.log("User is not admin, redirect to /");
      return <Navigate to="/" replace />;
    }

    console.log("User is admin, rendering admin layout");
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/verify" element={<Verify />} />
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
          <Route path="postcards" element={<Postcards />} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="resources" element={<Resources />} />
          <Route path="profile" element={<Profile />} />
          <Route path="categories" element={<Category />} />
        </Route>
      </Routes>

      {/* Toast container cho toàn app */}
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
