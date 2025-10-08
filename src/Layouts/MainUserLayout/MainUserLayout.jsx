import React from "react";
import { Layout, Breadcrumb } from "antd";
import MainHeader from "../../components/Headers/MainHeader/MainHeader";
import MainUserFooter from "../../components/Footers/MainUserFooter/MainUserFooter";
import { Outlet } from "react-router-dom";
import { useTheme } from "../../Themes/ThemeContext";
import "./MainUserLayout.css";

const { Content } = Layout;

const MainUserLayout = () => {
  const { theme, mode } = useTheme();
  return (
    <Layout
      className={`main-user-layout ${mode}`}
      style={{ minHeight: "100vh", background: theme.colorBgContainer }}
    >
      <div className="main-header-container">
        {/* Header */}
        <MainHeader />
      </div>

      {/* Breadcrumb */}
      {/* <Breadcrumb style={{ margin: "16px 24px" }} items={breadcrumbItems} /> */}

      {/* Content */}
      <Content
        style={{
          minHeight: "calc(100vh - 160px)",
          padding: "24px",
          background: theme.colorBgContainer,
          borderRadius: theme.borderRadiusLG,
        }}
      >
        <Outlet />
      </Content>

      {/* Footer */}
      <MainUserFooter />
    </Layout>
  );
};

export default MainUserLayout;
