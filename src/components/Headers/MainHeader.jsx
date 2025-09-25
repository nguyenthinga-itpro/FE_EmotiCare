import React, { useState } from "react";
import { Layout, Col, Row, Drawer } from "antd";
import { Link } from "react-router-dom";
import { LockOutlined, MenuOutlined } from "@ant-design/icons";
import "./MainHeader.css";

const { Header } = Layout;

const HeaderBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <Header className="custom-header">
      <Row  align="middle" justify="space-between" style={{ width: "100%" }}>

        <Col xs={12} md={4}>
          <div className="logo">
            <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
              EMOTICARE
            </Link>
          </div>
        </Col>


        <Col md={14} className="menu-desktop">
          <nav className="menu">
            <a href="/">Home</a>
            <a href="/More">More</a>
            <a href="/Stories">Stories</a>
            <a href="/Chatbox">ChatBox</a>
            <a href="/Contact">Contact</a>
          </nav>
        </Col>


        <Col xs={12} md={6} className="login-cols">
          <div className="login-wrappers">
            <Link to="/login">
              <button className="login-btns">
                <LockOutlined /> Login
              </button>
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

      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
      > 
        <nav className="menu-mobile">
          <a href="/">Home</a>
          <a href="/More">More</a>
          <a href="/Stories">Stories</a>
          <a href="/Chatbox">ChatBox</a>
          <a href="/Contact">Contact</a>
        </nav>
      </Drawer>
    </Header>
  );
};

export default HeaderBar;
