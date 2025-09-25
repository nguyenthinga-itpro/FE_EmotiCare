// components/OverlayLoader.jsx
import React from "react";
import { Spin } from "antd";

export default function OverlayLoader({ loading }) {
  if (!loading) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(255,255,255,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <Spin size="large" tip="Loading..." />
    </div>
  );
}
