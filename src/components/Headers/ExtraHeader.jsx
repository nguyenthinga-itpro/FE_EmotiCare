import React from "react";
import { Layout, Col, Row } from "antd";
import { Link } from "react-router-dom";
import { LockOutlined } from "@ant-design/icons";
import Images from "../../../src/Constant/Images";
import "./ExtraHeader.css";

const { Header } = Layout;

const HeaderBar = () => {
  return (
    <Header className="custom-header">
      <Row align="middle" justify="space-between" style={{ width: "100%" }}>
        <Col span={4}>
          <div className="logo">
            <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
              EMOTICARE
            </Link>
          </div>
        </Col>

        <Col span={18}>
        </Col>

<Col span={2} className="login-col">
  <Link to="/login">
    <img
      src={Images.Care}
      alt="User Avatar"
      className="avatar-img"
    />
  </Link>
</Col>

      </Row>
    </Header>
  );
};

export default HeaderBar;
