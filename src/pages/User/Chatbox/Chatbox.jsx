import React, { useEffect, useRef, useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { getAllChats } from "../../../redux/Slices/ChatAISlice";
import { getAllCategories } from "../../../redux/Slices/CategorySlice";
import {
  createSession,
  getAllChatSessions,
} from "../../../redux/Slices/ChatSessionSlice";
import "./Chatbox.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Chatbox() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage] = useState(1);

  const { currentUser } = useSelector((state) => state.user);
  const {
    paginatedChats = [],
    loading,
    error,
    pageSize = 10,
  } = useSelector((state) => state.chat);
  const { sessions = [] } = useSelector((state) => state.chatSession);
  console.log("sessions", sessions);
  const profileRefs = useRef({});

  useEffect(() => {
    dispatch(getAllChats({ pageSize: 100 }));
    dispatch(getAllCategories({ pageSize: 100 }));
  }, [dispatch]);
  // 🔹 Load chat sessions list
  useEffect(() => {
    dispatch(getAllChatSessions({ pageSize: 100 }));
    // return () => dispatch(clearSession());
  }, [dispatch]);
  const chats = paginatedChats.filter((c) => !c.isDisabled);
  const startIndex = (currentPage - 1) * pageSize;
  const currentChats = chats.slice(startIndex, startIndex + pageSize);

  const scrollToProfile = (chatId) => {
    const profileEl = profileRefs.current[chatId];
    if (profileEl)
      profileEl.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleStartChat = async (chatAIId) => {
    const result = await dispatch(
      createSession({
        userId: currentUser.uid,
        chatAIId,
      })
    );

    if (result.meta.requestStatus === "fulfilled") {
      const sessionId = result.payload.sessionId;
      const aiAvatar = result.payload.aiAvatar;
      navigate("/user/Chat", { state: { sessionId, aiAvatar } });
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <main>
      <section className="menu-section">
        <div className="content">
          <p className="subtitle">WHAT WE DO</p>
          <h1 className="title">Chat Buddy</h1>
        </div>
      </section>

      <section className="chat-container">
        {loading && <p>Loading chats...</p>}
        {error && <p style={{ color: "red" }}>Error loading chats: {error}</p>}
        {!loading && chats.length === 0 && <p>No chats available</p>}

        {currentChats.length > 0 && (
          <Slider {...sliderSettings}>
            {currentChats.map((chat) => (
              <div
                key={chat.id}
                className="chat-card-home-container"
                onClick={() => scrollToProfile(chat.id)}
              >
                <div className="chat-card-home">
                  <h3>{chat.name}</h3>
                  <img src={chat.image} alt={chat.name} />
                </div>
              </div>
            ))}
          </Slider>
        )}
      </section>

      <section className="profile-section">
        <h1 className="profile-title">Informations</h1>
        {chats.map((chat) => {
          const existingSession = sessions.find((s) => s.chatAIId === chat.id);
          console.log("Chat:", chat.name, "Existing Session:", existingSession);

          return (
            <div
              key={chat.id}
              className="profile-containers"
              ref={(el) => (profileRefs.current[chat.id] = el)}
            >
              <div className="profile-image">
                <img src={chat.image} alt={chat.name} />
              </div>
              <div className="profile-info">
                <h2>{chat.name}</h2>
                {chat.defaultGreeting && (
                  <p>
                    <strong>Greeting:</strong> {chat.defaultGreeting}
                  </p>
                )}
                {chat.description && (
                  <p dangerouslySetInnerHTML={{ __html: chat.description }} />
                )}
                <h3>System Prompt</h3>
                <p>{chat.systemPrompt}</p>
                <div className="profile-buttons">
                  {existingSession ? (
                    <button
                      className="btn-chat"
                      onClick={() =>
                        navigate("/user/Chat", {
                          state: {
                            sessionId: existingSession.id,
                            aiAvatar: existingSession.aiAvatar,
                          },
                        })
                      }
                    >
                      Open a chat
                    </button>
                  ) : (
                    <button
                      className="btn-chat"
                      onClick={() => handleStartChat(chat.id)}
                    >
                      Chat
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
