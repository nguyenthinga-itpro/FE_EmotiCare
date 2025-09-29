import React, { useEffect, useState } from "react";
import {  Pagination } from "antd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Images from "../../../Constant/Images";
import { getAllChats } from "../../../redux/Slices/ChatAISlice";
import { getAllCategories } from "../../../redux/Slices/CategorySlice";
import "./Chatbox.css";

export default function Chatbox() {
  const [currentPage, setCurrentPage] = useState(1);
  const localPageSize = 3; // số card mỗi trang

  const dispatch = useDispatch();

  // lấy state từ redux
  const {
    paginatedChats = [],
    loading,
    error,
  } = useSelector((s) => s.chat);

  const { paginatedCategories = [] } = useSelector((s) => s.category);

  // fetch chats
  useEffect(() => {
    dispatch(getAllChats({ pageSize: 100 }));
  }, [dispatch]);

  // fetch categories
  useEffect(() => {
    dispatch(getAllCategories({ pageSize: 100 }));
  }, [dispatch]);

  // filter bỏ disabled
  const chats = paginatedChats.filter((c) => c.isDisabled === false);
  const categories = paginatedCategories.filter((c) => c.isDisabled === false);

  // tính toán slice cho Pagination
  const startIndex = (currentPage - 1) * localPageSize;
  const currentChats = chats.slice(startIndex, startIndex + localPageSize);

  return (
    <main>
      {/* Menu Section */}
      <section className="menu-section">
        <div className="content">
          <p className="subtitle">WHAT WE DO</p>
          <h1 className="title">Chat Buddy</h1>
        </div>
      </section>

      {/* Characters Section */}
      <section className="name-section">
        {loading && <p>Loading chats...</p>}
        {error && <p style={{ color: "red" }}>Error loading chats</p>}
        {!loading && chats.length === 0 && <p>No chats available</p>}

        {currentChats.length > 0 && (
            <div className="character-grid-container">
              <div className="character-grid">
                {currentChats.map((chat) => (
                  <div key={chat.id} className="character-card-home">
                    <h3>{chat.name}</h3>
                    <img src={chat.image} alt={chat.name} />
                  </div>
                ))}
              </div>
            </div>
        )}

        {/* Pagination */}
        <Pagination
          className="custom-Pagination"
          align="center"
          current={currentPage}
          pageSize={localPageSize}
          total={chats.length}
          onChange={(page) => setCurrentPage(page)}
        />
      </section>

      {/* Profiles Section */}
      <section className="profile-section">
        <h1 className="profile-title">Profiles</h1>
        <div className="profile-containers">
          {/* Left image */}
          <div className="profile-image">
            <img src={Images.Sunny} alt="Sunny" />
          </div>

          {/* Right info */}
          <div className="profile-info">
            <ul>
              <li className="profile-info-textone">
                <strong className="profile-info-text">Name:</strong> Sunny
              </li>
              <li className="profile-info-textone">
                <strong className="profile-info-text">Age:</strong> 18
              </li>
            </ul>
            <h3>Personality</h3>
            <ul>
              <li className="profile-info-textone">Optimistic and warm, always spreading positive vibes.</li>
              <li className="profile-info-textone">Empathetic, a good listener who comforts gently.</li>
              <li className="profile-info-textone">
                Playful, cheerful, and a bit witty – like a peer and close
                friend.
              </li>
              <li className="profile-info-textone">
                Communicates in a youthful, friendly way, often using emojis.
              </li>
            </ul>

            <div className="profile-buttons">
              <button className="btn-more">More</button>
              <Link to="/user/Chat" className="btn-chat">
                Chat
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* More button */}
      <div className="more-sections">
        <button className="btn-mores">More...</button>
      </div>
    </main>
  );
}
