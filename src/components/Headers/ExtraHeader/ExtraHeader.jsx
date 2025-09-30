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
import { Link, useNavigate } from "react-router-dom";
import { BulbOutlined, MenuOutlined, MoonFilled } from "@ant-design/icons";
import "./ExtraHeader.css";
import { logout } from "../../../redux/Slices/AuthSlice";
import { useSelector, useDispatch } from "react-redux";
import { getUserById, updateUser } from "../../../redux/Slices/UserSlice";
import { useTheme } from "../../../Themes/ThemeContext";

const { Header } = Layout;
const { Text } = Typography;

const ExtraHeader = () => {
  const navigate = useNavigate();
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
      await new Promise((res) => setTimeout(res, 100));
      navigate("/login");
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
        <Col md={14}></Col>

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
          </Row>
        </Col>
      </Row>
    </Header>
  );
};

export default ExtraHeader;
