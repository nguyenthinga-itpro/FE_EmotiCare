import React from "react";
import { Col, Row, Carousel } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Images from "../../../Constant/Images";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-text">
          <h1>
            <span className="highlight">EmotiCare:</span>
            <span className="highlights">Where mood meets companion.</span>
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
          <div>
            <div className="character-grid">
              <div className="character-card">
                <h3>Sunny</h3>
                <img src={Images.Sunny} alt="Sunny" />
              </div>
              <div className="character-card">
                <h3>Mellow</h3>
                <img src={Images.Mellow} alt="Mellow" />
              </div>
              <div className="character-card">
                <h3>Stormy</h3>
                <img src={Images.Stormy} alt="Stormy" />
              </div>
              <div className="character-card">
                <h3>Breezy</h3>
                <img src={Images.Breezy} alt="Breezy" />
              </div>
              <div className="character-card">
                <h3>Navi</h3>
                <img src={Images.Navi} alt="Navi" />
              </div>
            </div>
          </div>

          <div>
            <div className="character-grid">
              <div className="character-card">
                <h3>Sunny</h3>
                <img src={Images.Sunny} alt="Sunny" />
              </div>
              <div className="character-card">
                <h3>Mellow</h3>
                <img src={Images.Mellow} alt="Mellow" />
              </div>
            </div>
          </div>

          <div>
            <div className="character-grid">
              <div className="character-card">
                <h3>Mellow</h3>
                <img src={Images.Mellow} alt="Mellow" />
              </div>
            </div>
          </div>
        </Carousel>
      </section>

      {/* Postcards Section */}
      <section className="postcards-section">
        <div className="container">
          <h2 className="subtitle">LARGE HEALING POSTCARD COLLECTION</h2>
          <h1 className="titles">POST CARDS</h1>

          <div className="card-grid">
            <div className="card">
              <div className="icon">
                <img src={Images.Sunnyvibes} alt="Sunnyvibes" />
              </div>
              <h3>Sunny Vibes</h3>
              <p>Adipiscing elit, sed do eiusmod labore dolore magna aliqua.</p>
              <span className="arrow">→</span>
            </div>

            <div className="card">
              <div className="icon">
                <img src={Images.Cheerup} alt="Cheerup" />
              </div>
              <h3 className="card-text">Cheer Up!</h3>
              <p className="card-text">
                Adipiscing elit, sed do eiusmod labore dolore magna aliqua.
              </p>
              <span className="card-texts">→</span>
            </div>

            <div className="card">
              <div className="icon">
                <img src={Images.HeartDrop} alt="HeartDrop" />
              </div>
              <h3>HeartDrops</h3>
              <p>Adipiscing elit, sed do eiusmod labore dolore magna aliqua.</p>
              <span className="arrow">→</span>
            </div>

            <div className="card">
              <div className="icon">
                <img src={Images.GoofyCard} alt="GoofyCard" />
              </div>
              <h3 className="card-text">GoofyCards</h3>
              <p className="card-text">
                Adipiscing elit, sed do eiusmod labore dolore magna aliqua.
              </p>
              <span className="card-texts">→</span>
            </div>
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
            {/* Cách 1: dùng Link */}
            {/* <Link to="/Postcards">
              <button className="cta-button">About us</button>
            </Link> */}
            {/* Cách 2: dùng navigate */}
            <button
              className="cta-button"
              onClick={() => {
                navigate("/Error");
                window.scrollTo(0, 0);
              }}
            >
              About us
            </button>
            <button
              className="cta-button"
              onClick={() => {
                navigate("/Postcards");
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
