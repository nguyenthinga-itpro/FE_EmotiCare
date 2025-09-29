import React, { useState } from "react";
import { Form, Input, Card, Row, Col, Menu, Collapse, Carousel } from "antd";
import { Pagination } from "antd";
import Images from "../../../Constant/Images";
import "./More.css";

const faqItems = [
  {
    key: "general1",
    category: "general",
    label: <span className="panel-gradient">What is EmotiCare?</span>,
    children: [
      {
        key: "1",
        label: <p className="panel-p">EmotiCare is ...</p>,
      },
    ],
  },
  {
    key: "general2",
    category: "general",
    label: (
      <span className="panel-gradient">
        Is EmotiCare suitable for all ages?
      </span>
    ),
    children: [
      {
        key: "2",
        label: <p className="panel-p">Yes, ...</p>,
      },
    ],
  },
  {
    key: "avatars1",
    category: "avatars",
    label: (
      <span className="panel-gradient">How do I interact with avatars?</span>
    ),
    children: [
      {
        key: "3",
        label: (
          <>
            <p className="panel-p">...</p>
          </>
        ),
      },
    ],
  },
  {
    key: "avatars2",
    category: "avatars",
    label: (
      <span className="panel-gradient">Can I save my favorite articles?</span>
    ),
    children: [
      {
        key: "4",
        label: <p className="panel-p">...</p>,
      },
    ],
  },
  {
    key: "privacy1",
    category: "privacy",
    label: (
      <span className="panel-gradient">Is my personal information safe?</span>
    ),
    children: [
      {
        key: "5",
        label: <p className="panel-p">...</p>,
      },
    ],
  },
  {
    key: "privacy2",
    category: "privacy",
    label: <span className="panel-gradient">Can I remain anonymous?</span>,
    children: [
      {
        key: "6",
        label: <p className="panel-p">...</p>,
      },
    ],
  },
  {
    key: "support1",
    category: "support",
    label: (
      <span className="panel-gradient">
        How can I give feedback or report a problem?
      </span>
    ),
    children: [
      {
        key: "7",
        label: <p className="panel-p">...</p>,
      },
    ],
  },
  {
    key: "support2",
    category: "support",
    label: (
      <span className="panel-gradient">
        Where can I find help if I feel overwhelmed?
      </span>
    ),
    children: [
      {
        key: "8",
        label: <p className="panel-p">...</p>,
      },
    ],
  },
];

const { Panel } = Collapse;
export default function More() {
  const [activeMainSection, setActiveMainSection] = useState("about");

  // Menu dưới (My details, Profile, Password, Email)
  const [activeSettingsSection, setActiveSettingsSection] =
    useState("mydetails");
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveMainSection(id); // chỉ thay đổi menu trên
    }
  };

  const renderMenuByCategory = (category) =>
    faqItems.filter((item) => item.category === category);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3; // số card mỗi trang
  // Dữ liệu character cards
  const characterCards = [
    {
      img: Images.Breezy,
      title: "Stormy",
      text: "Learn to recognize the signs of stress and practice daily relaxation exercises.",
    },
    {
      img: Images.Care,
      title: "Boost Your Confidence",
      text: "Learn to recognize the signs of stress and practice daily relaxation exercises.",
    },
    {
      img: Images.Navi,
      title: "Coping With Emotions",
      text: "Learn to recognize the signs of stress and practice daily relaxation exercises.",
    },
    {
      img: Images.Jinx,
      title: "Extra Card 1",
      text: "Learn to recognize the signs of stress and practice daily relaxation exercises.",
    },
    {
      img: Images.Mellow,
      title: "Extra Card 2",
      text: "Learn to recognize the signs of stress and practice daily relaxation exercises.",
    },
  ];

  // Danh sách video
  const videos = [
    {
      src: "https://www.youtube.com/embed/jfKfPfyJRdk",
      title: "lofi hip hop radio 📚 beats to relax/study to",
      text: "Listen on Spotify, Apple music and more",
      link: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    },
    {
      src: "https://www.youtube.com/embed/ScMzIvxBSi4",
      title: "Placeholder Video",
      text: "I am a web designer and developer. And I couldn't find any good placeholder videos for a website mockup so I came up with my own.",
      link: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
    },
    {
      src: "https://www.youtube.com/embed/LXb3EKWsInQ",
      title: "COSTA RICA IN 4K 60fps HDR (ULTRA HD)",
      text: "We've re-mastered and re-uploaded our favorite video in HDR!",
      link: "https://www.youtube.com/watch?v=LXb3EKWsInQ",
    },
    {
      src: "https://www.youtube.com/embed/RgKAFK5djSk",
      title: "See You Again - Wiz Khalifa ft. Charlie Puth",
      text: "Original soundtrack from Fast & Furious 7.",
      link: "https://www.youtube.com/watch?v=RgKAFK5djSk",
    },
  ];
  // Tính index slice
  const startIndex = (currentPage - 1) * pageSize;
  const currentCards = characterCards.slice(startIndex, startIndex + pageSize);

  const currentVideos = videos.slice(startIndex, startIndex + pageSize);

  return (
    <main>
      <Row align="middle" justify="space-between" style={{ width: "100%" }}>
        {/* Left col trống desktop */}
        <Col xs={0} md={5}></Col>

        {/* Desktop menu */}
        <Col xs={0} md={16} className="desktop-menu">
          <nav className="menu-navbar">
            <button
              className={activeMainSection === "about" ? "active-navbar" : ""}
              onClick={() => scrollToSection("about")}
            >
              About Us
            </button>
            <button
              className={activeMainSection === "faq" ? "active-navbar" : ""}
              onClick={() => scrollToSection("faq")}
            >
              FAQ
            </button>
            <button
              className={
                activeMainSection === "resources" ? "active-navbar" : ""
              }
              onClick={() => scrollToSection("resources")}
            >
              Resources
            </button>
            <button
              className={
                activeMainSection === "settings" ? "active-navbar" : ""
              }
              onClick={() => scrollToSection("settings")}
            >
              Settings
            </button>
          </nav>
        </Col>

        {/* Mobile menu */}
        <Col xs={12} md={0}>
          <select
            className="mobile-dropdown"
            value={activeSettingsSection}
            onChange={(e) => scrollToSection(e.target.value)}
          >
            <option value="about">About Us</option>
            <option value="faq">FAQ</option>
            <option value="resources">Resources</option>
            <option value="settings">Settings</option>
          </select>
        </Col>

        {/* Login col */}
        <Col xs={12} md={3} className="login-col"></Col>
      </Row>

      {/* About Us Section */}
      <section
        className="about-lines"
        id="about"
        style={{ padding: "30px 50px" }}
      >
        <h1 className="about-line">About Us</h1>
        <Row gutter={50}>
          <Col xs={24} md={12}>
            <h3>Welcome to EmotiCare!</h3>
            <p>
              We are a friendly digital space where you can share your thoughts,
              find empathy, and nurture your emotions. EmotiCare was created to
              be a trustworthy companion, always ready to listen and provide a
              sense of comfort to everyone.
            </p>
            <h3>Our Mission</h3>
            <p>
              Our mission is to support emotional well-being, especially for
              young people. We believe that every emotion matters, and sharing
              your feelings safely can help you discover yourself and find
              balance in life.
            </p>
            <h3>Our Vision</h3>
            <p>
              We aim to build a warm digital community where everyone feels
              heard and understood. In the future, EmotiCare will be more than
              just a website—it will be a multi-platform space where interactive
              tools, virtual avatars, and emotional content help people connect,
              learn, and grow.
            </p>
          </Col>
          <Col xs={24} md={12}>
            <h3>Our Story</h3>
            <p>
              EmotiCare started with the idea: “If there’s someone who always
              listens to you, you’ll feel safer and less lonely.”
              <br /> We created vibrant avatars representing different emotions,
              from joy and contemplation to vulnerability, so you can connect
              and express yourself naturally.
              <br />
              Each avatar has its own personality and story, creating a
              relatable, authentic, and emotionally rich experience for users.
            </p>
            <h3>Our Core Values</h3>
            <ul>
              <li>
                Empathy: Listening and understanding every emotion you feel.
              </li>
              <li>Friendliness: A welcoming, judgment-free space.</li>
              <li>
                Support: Tools and content to help you take care of your
                emotional well-being.
              </li>
              <li>
                Youthful & Creative: Designed for the lifestyle and digital
                experience of young people.
              </li>
            </ul>
          </Col>
        </Row>
      </section>

      {/* FAQ Section */}
      <section className="faq-lines" style={{ padding: "30px 50px" }} id="faq">
        <h1 className="about-lineFAQ">FAQ</h1>
        <Row gutter={50}>
          <Col xs={24} md={12}>
            <h3 className="general-line">General</h3>
            <Menu
              className="faq-menu"
              mode="inline"
              expandIcon={({ isOpen }) => (
                <span className={`menu-arrow ${isOpen ? "open" : ""}`}></span>
              )}
              items={renderMenuByCategory("general")}
            />

            <h3 className="general-line">Using Avatars</h3>
            <Menu
              className="faq-menu"
              mode="inline"
              expandIcon={({ isOpen }) => (
                <span className={`menu-arrow ${isOpen ? "open" : ""}`}></span>
              )}
              items={renderMenuByCategory("avatars")}
            />
          </Col>

          <Col xs={24} md={12}>
            <h3 className="general-line">Privacy</h3>
            <Menu
              className="faq-menu"
              mode="inline"
              expandIcon={({ isOpen }) => (
                <span className={`menu-arrow ${isOpen ? "open" : ""}`}></span>
              )}
              items={renderMenuByCategory("privacy")}
            />

            <h3 className="general-line">Support</h3>
            <Menu
              className="faq-menu"
              mode="inline"
              expandIcon={({ isOpen }) => (
                <span className={`menu-arrow ${isOpen ? "open" : ""}`}></span>
              )}
              items={renderMenuByCategory("support")}
            />
          </Col>
        </Row>
      </section>

      <section className="postcards-sections" id="resources">
        <div className="container">
          <div className="resources-header">
            <h1 className="resources-title">Resources</h1>
            <div className="resourcesCheerup"></div>
          </div>
          <h3 className="section-subtitle">Articles / Tips & Guides:</h3>

          <section className="custom-sections">
            {/* Character Cards */}
            <div className="character-grids">
              {currentCards.map((card, index) => (
                <div key={index} className="character-card stormy-card">
                  <div className="image-wrapper">
                    <img src={card.img} alt={card.title} />
                  </div>
                  <h3>{card.title}</h3>
                  <p className="card-text">{card.text}</p>
                  <button className="card-btn">READ MORE</button>
                </div>
              ))}
            </div>
            {/* Pagination */}
            <Pagination
              className="custom-Pagination"
              align="center"
              current={currentPage}
              pageSize={pageSize}
              total={characterCards.length}
              onChange={(page) => setCurrentPage(page)}
            />
            <h3 className="section-subtitle">Videos / Video:</h3>
            <div className="character-grids">
              {currentVideos.map((video, index) => (
                <div key={index} className="character-card">
                  <div className="video-wrapper">
                    <iframe
                      width="100%"
                      height="200"
                      src={video.src}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>

                  <div className="card-content">
                    <h3 className="card-title">{video.title}</h3>
                    <p className="card-text">{video.text}</p>
                    <a
                      href={video.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-btn"
                    >
                      READ MORE
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              className="custom-Pagination"
              align="center"
              current={currentPage}
              pageSize={pageSize}
              total={videos.length}
              onChange={(page) => setCurrentPage(page)}
            />
          </section>
        </div>
      </section>
      <section className="postcards-settings" id="settings">
        <div className="resources-header">
          <h1 className="resources-setting">Settings</h1>
        </div>
      </section>

      <Row align="middle" justify="center" style={{ width: "100%" }}>
        {/* Desktop menu */}
        <Col xs={0} md={2}></Col>
        <Col xs={0} md={22} className="desktop-menu">
          <nav className="menu-navbar">
            <button
              className={
                activeSettingsSection === "mydetails" ? "active-navbar" : ""
              }
              onClick={() => setActiveSettingsSection("mydetails")}
            >
              My details
            </button>
            <button
              className={
                activeSettingsSection === "profile" ? "active-navbar" : ""
              }
              onClick={() => setActiveSettingsSection("profile")}
            >
              Profile
            </button>
            <button
              className={
                activeSettingsSection === "password" ? "active-navbar" : ""
              }
              onClick={() => setActiveSettingsSection("password")}
            >
              Password
            </button>
            <button
              className={
                activeSettingsSection === "email" ? "active-navbar" : ""
              }
              onClick={() => setActiveSettingsSection("email")}
            >
              Email
            </button>
          </nav>
        </Col>

        {/* Mobile menu */}
        <Col xs={24} md={0} className="mobile-menu">
          <select
            className="mobile-dropdowns"
            value={activeSettingsSection}
            onChange={(e) => setActiveSettingsSection(e.target.value)}
          >
            <option value="mydetails">My details</option>
            <option value="profile">Profile</option>
            <option value="password">Password</option>
            <option value="email">Email</option>
            {/* <option value="mode">Mode</option> */}
          </select>
        </Col>
      </Row>

      {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
      {activeSettingsSection === "mydetails" && (
        <div className="profile-container" id="mydetails">
          {/* Avatar */}
          <img src={Images.Jinx} alt="Jinx" className="jinx-avatar" />

          <Card bordered={false} className="profile-card">
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={<span className="gradient-texts">First name</span>}
                  >
                    <Input placeholder="Nga" className="gradient-text" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={<span className="gradient-texts">Last name</span>}
                  >
                    <Input placeholder="NguyenThi" className="gradient-text" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label={<span className="gradient-texts">Email</span>}>
                <Input
                  placeholder="kilianjames@gmail.com"
                  className="gradient-text"
                />
              </Form.Item>

              <Form.Item
                label={<span className="gradient-texts">Address</span>}
              >
                <Input
                  placeholder="123 Street, City"
                  className="gradient-text"
                />
              </Form.Item>

              <Form.Item label={<span className="gradient-texts">Role</span>}>
                <Input placeholder="User" className="gradient-text" />
              </Form.Item>
            </Form>
          </Card>
        </div>
      )}

      {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
      {activeSettingsSection === "profile" && (
        <div className="profile-container" id="profile">
          <h1 className="profile-title">Profile Information</h1>

          <Card bordered={false} className="profile-card">
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={<span className="gradient-texts">First name</span>}
                  >
                    <Input placeholder="Nga" className="gradient-text" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={<span className="gradient-texts">Last name</span>}
                  >
                    <Input placeholder="NguyenThi" className="gradient-text" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label={<span className="gradient-texts">Email</span>}>
                <Input
                  placeholder="kilianjames@gmail.com"
                  className="gradient-text"
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={<span className="gradient-texts">Phone</span>}
                  >
                    <Input
                      placeholder="+84 888 999 000"
                      className="gradient-text"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span className="gradient-texts">Date of Birth</span>
                    }
                  >
                    <Input placeholder="01/01/2000" className="gradient-text" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label={<span className="gradient-texts">Bio</span>}>
                <Input.TextArea
                  rows={4}
                  placeholder="Tell us about yourself..."
                  className="gradient-text"
                />
              </Form.Item>

              <Form.Item
                label={<span className="gradient-texts">Website</span>}
              >
                <Input
                  placeholder="https://mywebsite.com"
                  className="gradient-text"
                />
              </Form.Item>
            </Form>
          </Card>
        </div>
      )}

      {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
      {activeSettingsSection === "password" && (
        <div className="profile-container" id="password">
          <h2 className="profile-title">Password Settings</h2>

          <Card bordered={false} className="profile-card">
            <Form layout="vertical">
              <Form.Item
                label={<span className="gradient-texts">Current Password</span>}
              >
                <Input.Password
                  placeholder="Enter current password"
                  className="gradient-text-password"
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={<span className="gradient-texts">New Password</span>}
                  >
                    <Input.Password
                      placeholder="Enter new password"
                      className="gradient-text-password"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span className="gradient-texts">
                        Confirm New Password
                      </span>
                    }
                  >
                    <Input.Password
                      placeholder="Confirm new password"
                      className="gradient-text-password"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <button type="submit" className="save-btn">
                  Update Password
                </button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      )}

      {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
      {activeSettingsSection === "email" && (
        <div className="profile-container" id="email">
          <h2 className="profile-title">Email Settings</h2>

          <Card bordered={false} className="profile-card">
            <Form layout="vertical">
              <Form.Item
                label={<span className="gradient-texts">Current Email</span>}
              >
                <Input
                  placeholder="kilianjames@gmail.com"
                  className="gradient-text"
                  disabled
                />
              </Form.Item>

              <Form.Item
                label={<span className="gradient-texts">New Email</span>}
              >
                <Input
                  placeholder="Enter your new email"
                  className="gradient-text"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="gradient-texts">Confirm New Email</span>
                }
              >
                <Input
                  placeholder="Re-enter your new email"
                  className="gradient-text"
                />
              </Form.Item>
            </Form>
          </Card>
        </div>
      )}

      {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
      {/* {activeSettingsSection  === "mode" && (
        <div className="profile-container" id="mode">
          <h2 className="profile-title">Display Mode</h2>

          <Card bordered={false} className="profile-card">
            <Form layout="vertical">
              <Form.Item label={<span className="gradient-texts">Theme</span>}>
                <Radio.Group
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="mode-radio-group"
                >
                  <Radio value="light">🌞 Light Mode</Radio>
                  <Radio value="dark">🌙 Dark Mode</Radio>
                  <Radio value="system">💻 System Default</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label={<span className="gradient-texts">Enable Dark Mode</span>}
              >
                <Switch
                  checked={darkEnabled}
                  onChange={(checked) => setDarkEnabled(checked)}
                  className="mode-switch"
                />
              </Form.Item>
            </Form>
          </Card>
        </div>
      )} */}
    </main>
  );
}
