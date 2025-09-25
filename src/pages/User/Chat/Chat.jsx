import React, { useState } from "react";
import { Input, Avatar } from "antd";
import {
  SendOutlined,
  SearchOutlined,
  MoreOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import ExtraHeader from "../../../components/Headers/ExtraHeader";
import ExtraUserFooter from "../../../components/Footers/ExtraUserFooter";
import "./Chat.css";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "James Boston",
      text: "Hello 👋",
      fromMe: false,
      time: "2h",
    },
    { id: 2, user: "You", text: "Hi bro 😎", fromMe: true, time: "2h" },
  ]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      { id: Date.now(), user: "You", text: input, fromMe: true, time: "now" },
    ]);
    setInput("");
  };

  return (
    <main>
        <ExtraHeader />
        {/* Breadcrumb */}
      <div className="article-breadcrumb">
        <a href="/Chatbox">Chatbox</a> / <span>Chat:</span>
      </div>
    <div className="chat-wrapper">
      {/* Sidebar inbox */}
      <div className={`chat-sidebar ${sidebarOpen ? "active" : ""}`}>
        <div className="sidebar-header">
          <h3 className="inbox-title">INBOX</h3>
          <CloseOutlined
            className="close-sidebar"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
        <div className="search-box">
          <Input prefix={<SearchOutlined />} placeholder="Search..." />
        </div>

        <div className="chat-list">
          <div className="chat-item active">
            <Avatar src="https://i.pravatar.cc/50?img=1" />
            <div className="chat-info">
              <strong>Joshua P</strong>
              <p>What was name of that song?</p>
            </div>
            <span className="status-dot online"></span>
            <span className="chat-time">38m</span>
          </div>

          <div className="chat-item">
            <Avatar src="https://i.pravatar.cc/50?img=2" />
            <div className="chat-info">
              <strong>Christen Harper</strong>
              <p>Are we up for weekend ride? lol</p>
            </div>
            <span className="status-dot offline"></span>
            <span className="chat-time">1h</span>
          </div>

          <div className="chat-item">
            <Avatar src="https://i.pravatar.cc/50?img=3" />
            <div className="chat-info">
              <strong>Michel Schott</strong>
              <p>Me wanna eat ice cream, sooo...</p>
            </div>
            <span className="status-dot offline"></span>
            <span className="chat-time">1h</span>
          </div>

          <div className="chat-item">
            <Avatar src="https://i.pravatar.cc/50?img=4" />
            <div className="chat-info">
              <strong>Jim Harper</strong>
              <p>I need help to prank Dwight haha...</p>
            </div>
            <span className="status-dot offline"></span>
            <span className="chat-time">2h</span>
          </div>

          <div className="chat-item">
            <Avatar src="https://i.pravatar.cc/50?img=5" />
            <div className="chat-info">
              <strong>Ross Galler</strong>
              <p>Can you send scans of bones?</p>
            </div>
            <span className="status-dot online"></span>
            <span className="chat-time">2h</span>
          </div>
        </div>
      </div>

      {/* Chat content */}
      <div className="chat-content">
        <div className="chat-header">
          {/* Thanh trên (tên app) */}
          <div className="chat-app-title">BaBot</div>

          {/* Thanh dưới (tên người chat) */}
          <div className="chat-user-bar">
            <MenuOutlined
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
            <span className="chat-username">
              James Boston <span className="online-dot"></span>
            </span>
            <MoreOutlined className="more-icon" />
          </div>
        </div>

        <div className="chat-body">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-bubble ${msg.fromMe ? "me" : "other"}`}
            >
              {!msg.fromMe && (
                <Avatar 
                  src="https://i.pravatar.cc/40?img=2"
                  className="bubble-avatar"
                />
              )}
              <span>{msg.text}</span>
              <div className="bubble-meta"> {msg.time} <span>↩</span> <span>❤</span> </div>
            </div>
          ))}
        </div>

        <div className="chat-footer">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type here"
            onPressEnter={handleSend}
          />
          <Avatar
            src="https://i.pravatar.cc/40?img=1"
            className="footer-avatar"
          />
          <SendOutlined className="send-icon" onClick={handleSend} />
        </div>
      </div>
    </div><ExtraUserFooter /></main>
  );
}
