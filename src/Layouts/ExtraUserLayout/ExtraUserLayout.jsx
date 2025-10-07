import React from "react";
import { Layout, Breadcrumb, Button } from "antd";
import ExtraHeader from "../../components/Headers/ExtraHeader/ExtraHeader";
import ExtraUserFooter from "../../components/Footers/ExtraUserFooter/ExtraUserFooter";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../Themes/ThemeContext";
import "./ExtraUserLayout.css";

const { Content } = Layout;

const ExtraUserLayout = () => {
  const { mode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

const canGoBack = window.history.length > 1 && location.pathname !== "/user";

const pathSnippets = location.pathname.split("/").filter(Boolean);

const breadcrumbItems = [
  canGoBack
    ? {
        title: (
          <span
            className="ant-breadcrumb-link"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(-1)}
          >
          Back
          </span>
        )
      }
    : { title: <Link to="/user">Home</Link> },

  ...pathSnippets.map((segment, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    const isLast = index === pathSnippets.length - 1;
    const label = segment === "user" ? "Home" : segment;

    return {
      title: isLast ? (
        <span className="ant-breadcrumb-link" style={{ color: "gray", cursor: "default" }}>
          {label}
        </span>
      ) : (
        <Link to={url}>{label}</Link>
      ),
    };
  }),
];


  return (
    <Layout className={`extra-user-layout ${mode}`}>
      <div className="scroll-content">
        <ExtraHeader />

        <Breadcrumb
          className="breadcrumb-extra-user-layout"
          items={breadcrumbItems}
        />

        <Content className="content-extra-user-layout">
          <Outlet />
        </Content>

        <div className="footer-extra-user-layout">
          <ExtraUserFooter />
        </div>
      </div>
    </Layout>
  );
};

export default ExtraUserLayout;
