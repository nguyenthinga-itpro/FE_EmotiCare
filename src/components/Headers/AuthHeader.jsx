import React, { useState } from "react";
import { Layout, Col, Row, Drawer } from "antd";
import { Link } from "react-router-dom";
import { MenuOutlined } from "@ant-design/icons";
import Images from "../../../src/Constant/Images";
import "./AuthHeader.css";

const { Header } = Layout;

const HeaderBar = () => {
  const [open, setOpen] = useState(false);
  const currentPath = window.location.pathname; // Lấy đường dẫn hiện tại
  return (
    <Header className="custom-header">
      <Row align="middle" justify="space-between" style={{ width: "100%" }}>
        
        {/* Logo */}
        <Col xs={12} md={4}>
          <div className="logo">
            <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
              EMOTICARE
            </Link> 
          </div>
        </Col>

        {/* Menu desktop */}
        <Col md={14} className="menu-desktop">
          <nav className="menu">
            <a href="/" className={currentPath === "/" ? "active" : ""}>Home</a>
            <a href="/More" className={currentPath === "/More" ? "active" : ""}>More</a>
            <a href="/Stories" className={currentPath === "/Stories" ? "active" : ""}>Stories</a>
            <a href="/Chatbox" className={currentPath === "/Chatbox" ? "active" : ""}>ChatBox</a>
            <a href="/Contact" className={currentPath === "/Contact" ? "active" : ""}>Contact</a>
          </nav>
        </Col>


        {/* Avatar + menu-btn */}
        <Col xs={12} md={6} className="login-col">
          <div className="right-wrapper">
            <Link to="/login">
              <img src={Images.Care} alt="User Avatar" className="avatar-img" />
            </Link>
            <button
              className="menu-btn"
              onClick={() => setOpen(true)}
            >
              <MenuOutlined />
            </button>
          </div>
        </Col>
      </Row>

      {/* Drawer menu mobile */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
      >
        <nav className="menu-mobile">
          <a href="/" className={currentPath === "/" ? "active" : ""}>Home</a>
          <a href="/More" className={currentPath === "/More" ? "active" : ""}>More</a>
          <a href="/Stories" className={currentPath === "/Stories" ? "active" : ""}>Stories</a>
          <a href="/Chatbox" className={currentPath === "/Chatbox" ? "active" : ""}>ChatBox</a>
          <a href="/Contact" className={currentPath === "/Contact" ? "active" : ""}>Contact</a>
        </nav>
      </Drawer>
      
    </Header>
  );
};

export default HeaderBar;
