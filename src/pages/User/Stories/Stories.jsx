import React, { useState } from "react";
import { Pagination } from "antd";
import Images from "../../../Constant/Images";
import Videos from "../../../Constant/Videos";
import "./Stories.css";

export default function Stories() {
  // State riêng cho phân trang Stories video
  const [characterPage, setCharacterPage] = useState(1);

  // PageSize riêng
  const characterPageSize = 3;

  // Dữ liệu video cho stories (fake mẫu, có thể thêm nhiều)
  const characterCards = [
    { src: Videos.Story, type: "video" },
    { src: Videos.Story, type: "video" },
    { src: Videos.Story, type: "video" },
    { src: Videos.Story, type: "video" },
    { src: Videos.Story, type: "video" },

  ];

  // Slice cho cards
  const startCharacterIndex = (characterPage - 1) * characterPageSize;
  const currentCards = characterCards.slice(
    startCharacterIndex,
    startCharacterIndex + characterPageSize
  );

  return (
    <main>
      {/* Video chính */}
      <div className="video-container">
        <video
          src={Videos.Storya}
          controls
          autoPlay={false}
          className="video-player"
        />
      </div>

      {/* Daily Stories */}
      <section className="stories-section" id="stories">
        <div className="container">
          <div className="stories-header">
            <h1 className="stories-title">Daily Stories</h1>
            <h3 className="stories-subtitle">Click on stories</h3>
          </div>

          {/* Stories Carousel */}
          <section className="stories-carousel">
            <div className="stories-grid">
              {currentCards.map((card, index) => (
                <div className="story-card" key={index}>
                  <video src={card.src} controls className="story-video" />
                </div>
              ))}
            </div>

            {/* Pagination */}
<Pagination
  className="custom-pagination"
  current={characterPage}
  pageSize={characterPageSize}
  total={characterCards.length}
  onChange={(page) => setCharacterPage(page)}
  showSizeChanger={false}   // ẩn chọn size
  showQuickJumper={false}   // ẩn nhảy nhanh
/>

          </section>
        </div>
      </section>

      {/* Interactive Stories */}
      <section className="stories-sections">
        <h1 className="stories-titles">Interactive Stories</h1>
        <p className="stories-subtitle">You choose mood today</p>

        <div className="stories-grids">
          <div className="story-cards">
            <img src={Images.Happy} alt="Happy" className="story-icon" />
          </div>
          <div className="story-cardss">
            <img src={Images.Sad} alt="Sad" className="story-icon" />
          </div>
          <div className="story-cards">
            <img src={Images.Angry} alt="Angry" className="story-icon" />
          </div>
          <div className="story-cardss">
            <img src={Images.Think} alt="Think" className="story-icon" />
          </div>
          <div className="story-cards">
            <img src={Images.Scare} alt="Scare" className="story-icon" />
          </div>
        </div>
      </section>
    </main>
  );
}
