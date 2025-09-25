import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/User/Home/Home.jsx";
import Login from "./pages/User/Login/Login.jsx";
import Verify from "./pages/User/Verify/Verify.jsx";
import More from "./pages/User/More/More.jsx";
import Stories from "./pages/User/Stories/Stories.jsx";
import Contact from "./pages/User/Contact/Contact.jsx";
import Chatbox from "./pages/User/Chatbox/Chatbox.jsx";
import ArticleCard from "./pages/User/ArticleCard/ArticleCard.jsx";
import Postcards from "./pages/User/Postcards/Postcards.jsx";
import Error from "./pages/User/Error/Error.jsx";
import Chat from "./pages/User/Chat/Chat.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/More" element={<More />} />
        <Route path="/Stories" element={<Stories />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Chatbox" element={<Chatbox />} />
        <Route path="/ArticleCard" element={<ArticleCard />} />
        <Route path="/Postcards" element={<Postcards />} />
        <Route path="/Error" element={<Error />} />
        <Route path="/Chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
