import React, { useEffect, useState } from "react";
import { Collapse, Pagination } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Images from "../../../Constant/Images";
import Videos from "../../../Constant/Videos";
import { getAllChats } from "../../../redux/Slices/ChatAISlice";
import { getAllCategories } from "../../../redux/Slices/CategorySlice";
import "./Stories.css";

const { Panel } = Collapse;

export default function Stories() {
  const [currentPage, setCurrentPage] = useState(1);
  const localPageSize = 3;

  const dispatch = useDispatch();

  const { paginatedChats = [] } = useSelector((s) => s.chat);
  const { paginatedCategories = [] } = useSelector((s) => s.category);

  useEffect(() => {
    dispatch(getAllChats({ pageSize: 100 }));
    dispatch(getAllCategories({ pageSize: 100 }));
  }, [dispatch]);

  const chats = paginatedChats.filter((c) => !c.isDisabled);
  const categories = paginatedCategories.filter((c) => !c.isDisabled);

  const startIndex = (currentPage - 1) * localPageSize;
  const currentChats = chats.slice(startIndex, startIndex + localPageSize);

  return (
    <main>
      <div className="video-container">
        <video src={Videos.Storya} controls autoPlay={false} className="video-player" />
      </div>

      <section className="stories-section" id="stories">
        <div className="container">
          <div className="stories-header">
            <h1 className="stories-title">Daily Stories</h1>
            <h3 className="stories-subtitle">Click on stories</h3>
          </div>

          <section className="stories-carousel">
            <div className="stories-grid">
              {currentChats.map((chat, index) => (
                <div key={index} className="story-card">
                  <video src={chat.videoUrl || Videos.Story} controls className="story-video" />
                </div>
              ))}
            </div>

            <Pagination
              className="custom-Pagination"
              align="center"
              current={currentPage}
              pageSize={localPageSize}
              total={chats.length}
              onChange={(page) => setCurrentPage(page)}
            />
          </section>
        </div>
      </section>

      <section className="stories-sections">
        <h1 className="stories-titles">Interactive Stories</h1>
        <p className="stories-subtitle">You choose mood today</p>
        <div className="stories-grids">
          {[Images.Happy, Images.Sad, Images.Angry, Images.Think, Images.Scare].map((img, i) => (
            <div key={i} className="story-cards">
              <img src={img} alt="Mood" className="story-icon" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
