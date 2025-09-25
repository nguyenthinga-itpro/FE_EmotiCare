import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  AppstoreOutlined,
  AppstoreAddOutlined,
  UserOutlined,
  UserSwitchOutlined,
  RobotOutlined,
  SmileOutlined,
  MailOutlined,
  LoginOutlined,
  QuestionCircleOutlined,
  QuestionCircleFilled,
  ReadOutlined,
  ReadFilled,
  MenuOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/Slices/AuthSlice";
import "./SideBar.css";
const { Sider } = Layout;

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredKey, setHoveredKey] = useState(null);

  const menuItems = [
    {
      key: "/admin/dashboard",
      label: "Dashboard",
      defaultIcon: <AppstoreOutlined />,
      hoverIcon: <AppstoreAddOutlined />,
      path: "/admin/dashboard",
    },
    {
      key: "/admin/users",
      label: "Users Management",
      defaultIcon: <UserOutlined />,
      hoverIcon: <UserSwitchOutlined />,
      path: "/admin/users",
    },
    {
      key: "/admin/emotions",
      label: "Emotions Management",
      defaultIcon: <MailOutlined />,
      hoverIcon: <SmileOutlined />,
      path: "/admin/emotions",
    },
    {
      key: "/admin/chatais",
      label: "ChatAIs Management",
      defaultIcon: <AppstoreOutlined />,
      hoverIcon: <RobotOutlined />,
      path: "/admin/chatais",
    },
    {
      key: "/admin/postcards",
      label: "Postcards Management",
      defaultIcon: <AppstoreOutlined />,
      hoverIcon: <AppstoreAddOutlined />,
      path: "/admin/postcards",
    },
    {
      key: "/admin/faqs",
      label: "FAQs Management",
      defaultIcon: <QuestionCircleOutlined />,
      hoverIcon: <QuestionCircleFilled />,
      path: "/admin/faqs",
    },
    {
      key: "/admin/resources",
      label: "Resources Management",
      defaultIcon: <ReadOutlined />,
      hoverIcon: <ReadFilled />,
      path: "/admin/resources",
    },
    {
      key: "/admin/categories",
      label: "Categories Management",
      defaultIcon: <MenuOutlined />,
      hoverIcon: <MenuFoldOutlined />,
      path: "/admin/categories",
    },
  ];

  const items = menuItems.map((item) => ({
    key: item.key,
    icon: hoveredKey === item.key ? item.hoverIcon : item.defaultIcon,
    label: <Link to={item.path}>{item.label}</Link>,
    onMouseEnter: () => setHoveredKey(item.key),
    onMouseLeave: () => setHoveredKey(null),
  }));

  items.push({
    type: "group",
    label: <span className="sidebarGroup">ACCOUNT PAGES</span>,
    children: [
      {
        key: "/admin/profile",
        icon:
          hoveredKey === "/admin/profile" ? (
            <UserSwitchOutlined />
          ) : (
            <UserOutlined />
          ),
        label: <Link to="/admin/profile">Profile</Link>,
        onMouseEnter: () => setHoveredKey("/admin/profile"),
        onMouseLeave: () => setHoveredKey(null),
      },
      {
        key: "/logout",
        icon: <LoginOutlined />,
        label: <span className="sidebarLogout">Logout</span>,
        onClick: async () => {
          try {
            await dispatch(logout()).unwrap();
            navigate("/login");
          } catch (err) {
            console.error("Logout failed:", err);
          }
        },
      },
    ],
  });

  return (
    <Sider width={250} className="sidebar">
      <div className="sidebarTitle">
        <div className="sidebarLogoTitle">
          <UserOutlined />
        </div>
        EmotiCare Dashboard
      </div>

      <Menu mode="inline" selectedKeys={[location.pathname]} items={items} />
    </Sider>
  );
};

export default Sidebar;
