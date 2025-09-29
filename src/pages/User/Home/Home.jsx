import React, { useEffect } from "react";
import { Col, Row, Carousel, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Images from "../../../Constant/Images";
import "./Home.css";
import { getAllChats } from "../../../redux/Slices/ChatAISlice";
import { getAllCategories } from "../../../redux/Slices/CategorySlice";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRightOutlined } from "@ant-design/icons";
export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { paginatedChats, loading, error, pageSize } = useSelector(
    (s) => s.chat
  );
  const { paginatedCategories } = useSelector((s) => s.category);
  useEffect(() => {
    dispatch(getAllChats({ pageSize: 100 }));
  }, [dispatch, pageSize]);
  useEffect(() => {
    dispatch(getAllCategories({ pageSize: 100 }));
  }, [dispatch]);
  const chats = paginatedChats.filter((c) => c.isDisabled === false);
  const categories = paginatedCategories.filter((c) => c.isDisabled === false);
  console.log("categories", categories);
  return (
    <main>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-text">
          <h1>
            <span className="highlight">EmotiCare: </span>
            <span className="highlights"> Where mood meets companion.</span>
          </h1>
          <span className="highlight-margin-left">
            You speak, we listen — every emotion matters.
          </span>
          <Link to="/login">
            <button className="cta-button">Get Started</button>
          </Link>
        </div>

        <div className="hero-image">
          <img src={Images.Care} alt="Care" />
        </div>
      </section>

      {/* Menu Section */}
      <section className="menu-section">
        <div className="content">
          <p className="subtitle">WHAT WE DO</p>
          <h1 className="title">Chat Buddy</h1>
        </div>
      </section>

      {/* Characters Section */}
      <section className="name-section">
        <Carousel dots={{ className: "custom-dots" }}>
          <div className="character-grid-container">
            <div className="character-grid">
              {chats.map((chat) => (
                <div key={chat.id} className="character-card-home">
                  <h3>{chat.name}</h3>
                  <img src={chat.image} alt={chat.name} />
                </div>
              ))}
            </div>
          </div>
        </Carousel>
      </section>

      {/* Postcards Section */}
      <section className="postcards-section-home">
        <div className="container-postcards-section-home">
          <h2 className="subtitle">LARGE HEALING POSTCARD COLLECTION</h2>
          <h1 className="titles">POST CARDS</h1>

          <div className="card-grid">
            {categories.map((c) => (
              <div key={c.id} className="card-home">
                <div className="icon">
                  {/* nếu có ảnh thì hiện, ko thì fallback */}
                  <img src={c.image || Images.DefaultPostcard} alt={c.name} />
                </div>
                <h3>{c.name}</h3>
                <p
                  className="card-text"
                  dangerouslySetInnerHTML={{ __html: c.description }}
                />
                <Button className="arrow-card-home">
                  <ArrowRightOutlined />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-image">
            <img src={Images.About} alt="About" />
          </div>

          <div className="about-content">
            <span className="subtitle">ABOUT US</span>
            <h2 className="title">Welcome to EmotiCare!</h2>
            <p className="titles">
              EmotiCare is a place to talk, chat, and connect about your
              feelings. We create a safe, friendly, and fun space where every
              mood is embraced — from happy, sad, to silly, mindless moments.
            </p>
            <button
              className="cta-button"
              onClick={() => {
                navigate("/user/more");
                window.scrollTo(0, 0);
              }}
            >
              About us
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
