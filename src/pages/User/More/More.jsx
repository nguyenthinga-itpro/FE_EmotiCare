// components/More/More.jsx
import React, { useState } from "react";
import { Row, Col } from "antd";
import About from "./About";
import FAQSection from "./FAQ";
import Resources from "./Resources";
import Settings from "./Setting";
import "./More.css";

export default function More() {
  const [activeMainSection, setActiveMainSection] = useState("about");

  // Scroll tới section
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveMainSection(id);
    }
  };

  // Danh sách section cố định
  const sections = [
    { id: "about", label: "About Us" },
    { id: "faq", label: "FAQ" },
    { id: "resources", label: "Resources" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <main>
      {/* Navbar */}
      <Row align="middle" justify="space-between" style={{ width: "100%" }}>
        <Col xs={0} md={5}></Col>

        {/* Desktop menu */}
        <Col xs={0} md={16} className="desktop-menu">
          <nav className="menu-navbar">
            {sections.map((section) => (
              <button
                key={section.id}
                className={
                  activeMainSection === section.id ? "active-navbar" : ""
                }
                onClick={() => scrollToSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </Col>

        {/* Mobile menu */}
        <Col xs={12} md={0}>
          <select
            className="mobile-dropdown"
            value={activeMainSection}
            onChange={(e) => scrollToSection(e.target.value)}
          >
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.label}
              </option>
            ))}
          </select>
        </Col>

        <Col xs={12} md={3}></Col>
      </Row>

      {/* Sections */}
      <About />
      <FAQSection />
      <Resources />
      <Settings />
    </main>
  );
}
