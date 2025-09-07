import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Welcome to EmotiCare</h1>
      <Link to="/verify">Go to Verify Page</Link>
    </div>
  );
}
