// components/More/Settings.jsx
import React from "react";
import { Row, Col, Card, Form, Input } from "antd";
import Images from "../../../Constant/Images";
import Profile from "../../Admin/Profile/Profile";
export default function Settings() {
  return (
    <section className="postcards-settings" id="settings">
      <h1 className="about-line">Settings</h1>
      <Profile />
    </section>
  );
}
