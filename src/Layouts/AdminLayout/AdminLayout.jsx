import React from "react";
import { Layout, Breadcrumb } from "antd";
import Header from "../../components/Headers/AdminHeader/AdminHeader";
import Sidebar from "../../components/SideBars/SideBarAdmin";
import { Outlet, useLocation, Link } from "react-router-dom";
import { useTheme } from "../../Themes/ThemeContext";
import "./AdminLayout.css";
const { Content, Footer } = Layout;

const AdminLayout = () => {
  const { theme } = useTheme();

  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter(Boolean);

  const breadcrumbItems = [
    { title: <Link to="/">Home</Link> },
    ...pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      return { title: <Link to={url}>{pathSnippets[index]}</Link> };
    }),
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: theme.colorBgContainer }}>
      <Sidebar style={{ minHeight: "100vh" }} />
      <Layout style={{ background: theme.sidebarBg }}>
        <Header theme={theme} />
        <Breadcrumb
          items={breadcrumbItems}
          className="breadcrumb-custom"
          style={{
            margin: "16px",
            background: theme.sidebarBg,
          }}
        />
        <Content
          style={{
            margin: "0 16px",
            background: theme.colorBgContainer,
            borderRadius: theme.borderRadiusLG,
            minHeight: "calc(90vh - 160px)",
            transition: "all 0.3s",
          }}
        >
          <Outlet />
        </Content>
        <Footer className="footer-dashboard" style={{}}>
          © {new Date().getFullYear()} EmotiCare Dashboard · Version 1.0.3 ·
          <span> Developed by N&H</span>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
