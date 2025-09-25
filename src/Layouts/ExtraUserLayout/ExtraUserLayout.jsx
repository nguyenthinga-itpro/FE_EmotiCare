import React from "react";
import { Layout, Breadcrumb } from "antd";
import ExtraHeader from "../../components/Headers/ExtraHeader/ExtraHeader";
import ExtraUserFooter from "../../components/Footers/ExtraUserFooter/ExtraUserFooter";
import { Outlet, useLocation, Link } from "react-router-dom";
import { useTheme } from "../../Themes/ThemeContext";
import "./ExtraUserLayout.css";

const { Content } = Layout;

const ExtraUserLayout = () => {
  const { theme, mode } = useTheme();
  const location = useLocation();

  const pathSnippets = location.pathname.split("/").filter(Boolean);

  const breadcrumbItems = [
    { title: <Link to="/user">Home</Link> },
    ...pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      return { title: <Link to={url}>{pathSnippets[index]}</Link> };
    }),
  ];

  return (
    <Layout className={`main-user-layout ${mode}`}>
      {/* Header */}
      <ExtraHeader />

      {/* Breadcrumb */}
      <Breadcrumb style={{ margin: "16px 24px" }} items={breadcrumbItems} />

      {/* Content */}
      <Content style={{ minHeight: "calc(100vh - 160px)", padding: "24px" }}>
        <Outlet />
      </Content>

      {/* Footer */}
      <ExtraUserFooter />
    </Layout>
  );
};

export default ExtraUserLayout;
