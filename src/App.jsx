import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/User/Home/Home.jsx";
import Login from "./pages/User/Login/Login.jsx";
import Verify from "./pages/User/Verify/Verify.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Verify />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
