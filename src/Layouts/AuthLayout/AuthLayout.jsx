import React from "react";
import { Layout, Breadcrumb } from "antd";
import AuthHeader from "../../components/Headers/AuthHeader/AuthHeader";
import ExtraUserFooter from "../../components/Footers/ExtraUserFooter/ExtraUserFooter";
import { Outlet, useLocation, Link } from "react-router-dom";
import { useTheme } from "../../Themes/ThemeContext";
import "./AuthLayout.css";

const { Content } = Layout;

const AuthLayout = () => {
  const { theme, mode } = useTheme();
  return (
    <Layout className={`main-user-layout ${mode}`}>
      {/* Header */}
      <AuthHeader />

      {/* Breadcrumb */}
      {/* <Breadcrumb style={{ margin: "16px 24px" }} items={breadcrumbItems} /> */}

      {/* Content */}
      <Content style={{ minHeight: "calc(100vh - 160px)", padding: "24px" }}>
        <Outlet />
      </Content>

      {/* Footer */}
      <ExtraUserFooter />
    </Layout>
  );
};

export default AuthLayout;
