import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome to EmotiCare</h1>

      <Link to="/login">
        <button>Login</button>
      </Link>
    </div>
  );
}
