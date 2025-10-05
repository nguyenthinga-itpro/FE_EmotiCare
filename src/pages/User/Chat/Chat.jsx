import React, { useEffect, useState, useRef } from "react";
import { Input, Avatar, Spin, Button } from "antd";
import {
  SendOutlined,
  SearchOutlined,
  MoreOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  getAllChatSessions,
  sendMessage,
  fetchSessionById,
  clearSession,
  subscribeSession,
  addRealtimeMessage,
  setCurrentSessionId,
} from "../../../redux/Slices/ChatSessionSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Sounds from "../../../Constant/Sounds";
import "./Chat.css";
import OverlayLoader from "../../../components/OverlayLoader/OverlayLoader";

const PAGE_SIZE = 10;

export default function Chat() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { sessionId } = location.state || {};

  const { sessions, nextCursor, currentSessionId, messages, loading } =
    useSelector((state) => state.chatSession);
  const { currentUser } = useSelector((state) => state.user);

  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const chatBodyRef = useRef(null);
  const loadMoreRef = useRef(null);
  useEffect(() => {
    console.log("currentSessionId changed:", currentSessionId);
  }, [currentSessionId]);

  // Load session nếu có sessionId được truyền từ Router
  useEffect(() => {
    if (sessionId) {
      dispatch(fetchSessionById(sessionId));
      dispatch(subscribeSession({ sessionId }));
    }
  }, [dispatch, sessionId]);

  useEffect(() => {
    if (currentUser?.uid) {
      dispatch(
        getAllChatSessions({ pageSize: PAGE_SIZE, userId: currentUser.uid })
      );
    }
  }, [dispatch, currentUser]); // Không return cleanup ở đây

  // Cleanup chỉ khi unmount
  useEffect(() => {
    return () => dispatch(clearSession());
  }, [dispatch]);

const initializedRef = useRef(false);

useEffect(() => {
  if (!initializedRef.current && !currentSessionId && sessions.length > 0) {
    const firstSession = sessions[0];
    dispatch(setCurrentSessionId(firstSession.id));
    dispatch(subscribeSession({ sessionId: firstSession.id }));
    dispatch(fetchSessionById(firstSession.id));
    initializedRef.current = true; // Đánh dấu đã chạy
  }
}, [sessions, currentSessionId, dispatch]);


  // Scroll xuống khi có tin nhắn mới
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Load thêm session khi scroll
  const loadMoreSessions = () => {
    if (nextCursor && currentUser?.uid) {
      dispatch(
        getAllChatSessions({
          pageSize: PAGE_SIZE,
          startAfter: nextCursor,
          userId: currentUser.uid, // ✅ FIX QUAN TRỌNG
        })
      );
    }
  };

  useEffect(() => {
    if (!nextCursor || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreSessions();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [nextCursor, loading]);

  // Gửi tin nhắn
  const playSound = (type) => {
    const audio = new Audio(
      type === "send" ? Sounds.Messagesend : Sounds.Message
    );
    audio.play();
  };

  const handleSend = () => {
    if (!input.trim()) return;

    if (!currentSessionId) {
      alert("⚠️ Chưa có session nào để gửi tin nhắn.");
      return;
    }

    const tempMsg = {
      id: Date.now(),
      sender: "user",
      text: input,
      status: "sending",
      createdAt: Date.now(),
    };

    dispatch(addRealtimeMessage(tempMsg));
    playSound("send");
    setInput("");

    dispatch(
      sendMessage({ sessionId: currentSessionId, sender: "user", text: input })
    ).catch(() => {
      tempMsg.status = "failed";
    });
  };

  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.sender === "ai") {
        playSound("receive");
      }
    }
  }, [messages]);

  return (
    <main className="chat-main">
      <OverlayLoader loading={loading} />
      <div className={`chat-wrapper ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className={`chat-sidebar ${sidebarOpen ? "active" : ""}`}>
          <div className="sidebar-header">
            <h3>Chat sections</h3>
            <CloseOutlined
              className="close-sidebar"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
          <div className="search-box">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />
          </div>

          <div className="chat-list">
            {sessions
              .filter(
                (s) =>
                  s.chatAIName?.toLowerCase().includes(searchTerm) ||
                  s.lastMessage?.toLowerCase().includes(searchTerm)
              )
              .map((s) => (
                <div
                  key={s.id}
                  className={`chat-item ${
                    currentSessionId === s.id ? "active" : ""
                  }`}
                  onClick={() => {
                    dispatch(setCurrentSessionId(s.id));
                    dispatch(fetchSessionById(s.id));
                    dispatch(subscribeSession({ sessionId: s.id }));
                  }}
                >
                  <Avatar src={s.aiAvatar} />
                  <div className="chat-info">
                    <strong>{s.chatAIName || "AI Assistant"}</strong>
                    <p>{s.lastMessage || ""}</p>
                  </div>
                  <span className="chat-time">
                    {new Date(s.updatedAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}

            <div ref={loadMoreRef} style={{ height: 1 }}></div>

            {loading && (
              <div style={{ textAlign: "center", padding: 10 }}>
                <Spin size="small" />
              </div>
            )}
          </div>
        </div>

        {!sidebarOpen && (
          <MenuOutlined
            className="sidebar-toggle-btn"
            onClick={() => setSidebarOpen(true)}
          />
        )}

        <div className={`chat-content ${sidebarOpen ? "" : "expanded"}`}>
          <div className="chat-header">
            {sessions
              .filter((s) => s.id === currentSessionId)
              .map((s) => (
                <div key={s.id} className="chat-app-title">
                  <Avatar src={s.aiAvatar} />
                  <div className="chat-info">
                    <strong>{s.chatAIName || "AI Assistant"}</strong>
                  </div>
                </div>
              ))}
          </div>

          <div
            className={`chat-body ${sidebarOpen ? "" : "full-width"}`}
            ref={chatBodyRef}
          >
            {messages.map((msg) => {
              const currentSession = sessions.find(
                (s) => s.id === currentSessionId
              );

              return (
                <div
                  key={msg.id || msg.createdAt}
                  className={`chat-row ${
                    msg.sender === "user" ? "me" : "other"
                  }`}
                >
                  {msg.sender === "ai" && currentSession && (
                    <div className="chat-avatar">
                      <Avatar src={currentSession.aiAvatar} />
                    </div>
                  )}

                  <div
                    className={`chat-bubble ${
                      msg.sender === "user" ? "me" : "other"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="chat-footer">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message"
              onPressEnter={handleSend}
            />
            <SendOutlined className="send-icon" onClick={handleSend} />
          </div>
        </div>
      </div>
    </main>
  );
}
