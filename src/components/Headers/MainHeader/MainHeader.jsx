import React, { useEffect, useState } from "react";
import {
  Layout,
  Col,
  Row,
  Drawer,
  Button,
  Tooltip,
  Avatar,
  Spin,
  Typography,
  Popover,
} from "antd";
import { Link } from "react-router-dom";
import { BulbOutlined, MenuOutlined, MoonFilled } from "@ant-design/icons";
import "./MainHeader.css";
import { logout } from "../../../redux/Slices/AuthSlice";
import { useSelector, useDispatch } from "react-redux";
import { getUserById, updateUser } from "../../../redux/Slices/UserSlice";
import { useTheme } from "../../../Themes/ThemeContext";

const { Header } = Layout;
const { Text } = Typography;

const HeaderBar = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);
  const { userDetail, loading } = useSelector((s) => s.users);
  const { mode, toggleTheme } = useTheme();
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (currentUser?.uid && !userDetail?.id) {
      dispatch(getUserById(currentUser.uid));
    }
  }, [dispatch, currentUser, userDetail]);

  const handleThemeToggle = async () => {
    toggleTheme();
    if (userDetail?.id) {
      const newMode = mode === "light" ? "dark" : "light";
      dispatch(updateUser({ id: userDetail.id, mode: newMode }));
    }
  };

  const handleLanguageToggle = () => {
    setLanguage((prev) => (prev === "en" ? "vi" : "en"));
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await dispatch(logout()).unwrap();
      // reload để cookie HttpOnly chắc chắn bị xóa
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <Header className="custom-header">
      <Row align="middle" justify="space-between" className="header-menu-left">
        {/* Logo */}
        <Col xs={12} md={4}>
          <div className="logo">
            <Link to="/">EMOTICARE</Link>
          </div>
        </Col>

        {/* Menu desktop */}
        <Col md={14} className="menu-desktop">
          <nav className="menu">
            <Link to="/user">Home</Link>
            <Link to="/user/More">More</Link>
            <Link to="/user/Stories">Stories</Link>
            <Link to="/user/Chatbox">ChatBox</Link>
            <Link to="/user/Contact">Contact</Link>
          </nav>
        </Col>

        {/* Avatar + setting + menu btn */}
        <Col xs={12} md={6} className="login-cols">
          <Row align="middle" justify="end">
            {/* Avatar */}
            <Col>
              {loading ? (
                <Spin size="small" />
              ) : (
                <Popover
                  content={
                    <div className="header-menu-right">
                      <p className="email-header-menu-right">
                        {userDetail?.email}
                      </p>
                      <Button
                        onClick={handleLogout}
                        className="button-Logout-header-menu-right"
                      >
                        Logout
                      </Button>
                    </div>
                  }
                  trigger="hover"
                  // placement="bottomRight"
                  overlayClassName="custom-popover"
                >
                  <Avatar
                    size={40}
                    src={userDetail?.image || null}
                    className="avatar-header-menu-right"
                  >
                    {userDetail?.name?.[0]}
                  </Avatar>
                </Popover>
              )}
            </Col>

            {/* Theme toggle */}
            <Col className="theme-toggle">
              <Tooltip
                title={`Switch to ${mode === "light" ? "Dark" : "Light"} mode`}
              >
                {mode === "light" ? (
                  <BulbOutlined
                    onClick={handleThemeToggle}
                    className="light-theme-toggle"
                  />
                ) : (
                  <MoonFilled
                    onClick={handleThemeToggle}
                    className="dark-theme-toggle"
                  />
                )}
              </Tooltip>
            </Col>

            {/* Language toggle */}
            <Col className="language-toggle">
              <Tooltip title="Change language">
                <Text
                  strong
                  onClick={handleLanguageToggle}
                  className="tooltip-language-toggle"
                >
                  {language === "en" ? "EN" : "VI"}
                </Text>
              </Tooltip>
            </Col>

            {/* Menu button (mobile) */}
            <Col className="menu-button-mobile">
              <button className="menu-btn" onClick={() => setOpen(true)}>
                <MenuOutlined />
              </button>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Drawer menu mobile */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        className="menu-container "
        width={100}
      >
        <nav className="menu-mobile">
          <Link to="/user" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link to="/user/More" onClick={() => setOpen(false)}>
            More
          </Link>
          <Link to="/user/Stories" onClick={() => setOpen(false)}>
            Stories
          </Link>
          <Link to="/user/Chatbox" onClick={() => setOpen(false)}>
            ChatBox
          </Link>
          <Link to="/user/Contact" onClick={() => setOpen(false)}>
            Contact
          </Link>
        </nav>
      </Drawer>
    </Header>
  );
};

export default HeaderBar;
