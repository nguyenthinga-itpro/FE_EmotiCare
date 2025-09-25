import React, { useEffect, useState } from "react";
import { Col, Row, Avatar, Typography, Spin, Tooltip } from "antd";
import { BulbOutlined, MoonFilled } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { getUserById, updateUser } from "../../../redux/Slices/UserSlice";
import { useTheme } from "../../../Themes/ThemeContext"; // <- dùng context

const { Text } = Typography;

const AdminHeader = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { userDetail, loading } = useSelector((s) => s.users);

  const { mode, toggleTheme } = useTheme(); // Lấy toggleTheme từ context

  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (currentUser?.uid && !userDetail?.id) {
      dispatch(getUserById(currentUser.uid));
    }
  }, [dispatch, currentUser, userDetail]);

  const handleThemeToggle = async () => {
    toggleTheme(); // <- đổi theme trực tiếp context
    // Đồng bộ lên backend
    if (userDetail?.id) {
      const newMode = mode === "light" ? "dark" : "light";
      dispatch(updateUser({ id: userDetail.id, mode: newMode }));
    }
  };

  const handleLanguageToggle = () => {
    setLanguage(language === "en" ? "vi" : "en");
  };

  return (
    <Row
      align="middle"
      justify="end"
      style={{ marginTop: 15, marginRight: 30 }}
    >
      <Col>
        {loading ? (
          <Spin size="small" />
        ) : (
          <Tooltip title={userDetail?.email}>
            <Avatar
              size={40}
              src={userDetail?.image || null}
              style={{ cursor: "pointer" }}
            >
              {userDetail?.name?.[0]}
            </Avatar>
          </Tooltip>
        )}
      </Col>

      <Col style={{ marginLeft: 30, cursor: "pointer" }}>
        <Tooltip
          title={`Switch to ${mode === "light" ? "Dark" : "Light"} mode`}
        >
          {mode === "light" ? (
            <BulbOutlined
              style={{ fontSize: 20 }}
              onClick={handleThemeToggle}
            />
          ) : (
            <MoonFilled
              style={{ fontSize: 20, color: "#fff" }}
              onClick={handleThemeToggle}
            />
          )}
        </Tooltip>
      </Col>

      <Col style={{ marginLeft: 20, cursor: "pointer" }}>
        <Tooltip title="Change language">
          <Text
            strong
            onClick={handleLanguageToggle}
            style={{ userSelect: "none" }}
          >
            {language === "en" ? "EN" : "VI"}
          </Text>
        </Tooltip>
      </Col>
    </Row>
  );
};

export default AdminHeader;
