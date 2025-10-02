import React from "react";
import { Layout, Breadcrumb } from "antd";
import ExtraHeader from "../../components/Headers/ExtraHeader/ExtraHeader";
import ExtraUserFooter from "../../components/Footers/ExtraUserFooter/ExtraUserFooter";
import { Outlet, useLocation, Link } from "react-router-dom";
import { useTheme } from "../../Themes/ThemeContext";
import "./ExtraUserLayout.css";

const { Content } = Layout;

const ExtraUserLayout = () => {
  const { mode } = useTheme();
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
    <Layout className={`extra-user-layout ${mode}`}>
      <ExtraHeader />
      <Breadcrumb
        className="breadcrumb-extra-user-layout"
        items={breadcrumbItems}
      />
      <Content className="content-extra-user-layout">
        <Outlet />
      </Content>
      <ExtraUserFooter />
    </Layout>
  );
};

export default ExtraUserLayout;
