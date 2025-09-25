import React, { useState } from "react";
import { Layout, Col, Row, Drawer, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LockOutlined, MenuOutlined } from "@ant-design/icons";
import "./MainHeader.css";
import Images from "../../../Constant/Images";
import { logout } from "../../../redux/Slices/AuthSlice";
import { useDispatch } from "react-redux";
const { Header } = Layout;

const HeaderBar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await dispatch(logout()).unwrap();
      navigate("/"); 
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  return (
    <Header className="custom-header">
      <Row align="middle" justify="space-between" style={{ width: "100%" }}>
        <Col xs={12} md={4}>
          <div className="logo">
            <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
              EMOTICARE
            </Link>
          </div>
        </Col>

        <Col md={14} className="menu-desktop">
          <nav className="menu">
            <a href="/user">Home</a>
            <a href="/user/More">More</a>
            <a href="/user/Stories">Stories</a>
            <a href="/user/Chatbox">ChatBox</a>
            <a href="/user/Contact">Contact</a>
            <Button onClick={handleLogout} style={{ cursor: "pointer" }}>
              Logout
            </Button>
          </nav>
        </Col>

        <Col xs={12} md={6} className="login-cols">
          <div className="login-wrappers">
            <Link to="/login">
              <img src={Images.Care} alt="User Avatar" className="avatar-img" />
            </Link>
            <button className="menu-btn" onClick={() => setOpen(true)}>
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
