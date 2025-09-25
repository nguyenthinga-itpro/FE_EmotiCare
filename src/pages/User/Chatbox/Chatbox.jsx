import React from "react";
import { Carousel } from "antd";
import { Link } from "react-router-dom";
import Images from "../../../Constant/Images";
import "./Chatbox.css";
import MainHeader from "../../../components/Headers/MainHeader";
import ExtraUserFooter from "../../../components/Footers/ExtraUserFooter";

export default function Chatbox() {
  return (
    <main>
      <MainHeader />

      <section className="menu-section">
        <div className="content">
          <p className="subtitle">WHAT WE DO</p>
          <h1 className="title">Chat Buddy</h1>
        </div>
      </section>
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

      <section className="profile-section">
        <h1 className="profile-title">Profiles</h1>
        <div className="profile-containers">
          {/* Left image */}
          <div className="profile-image">
            <img src={Images.Sunny} alt="Sunny" />
          </div>

          {/* Right info */}
          <div className="profile-info">
            <ul>
              <li>
                <strong>Name:</strong> Sunny
              </li>
              <li>
                <strong>Age:</strong> 18
              </li>
            </ul>
            <h3>Personality</h3>
            <ul>
              <li>Optimistic and warm, always spreading positive vibes.</li>
              <li>Empathetic, a good listener who comforts gently.</li>
              <li>
                Playful, cheerful, and a bit witty – like a peer and close
                friend.
              </li>
              <li>
                Communicates in a youthful, friendly way, often using emojis.
              </li>
            </ul>

            <div className="profile-buttons">
              <button className="btn-more">More</button>
              <Link to="/Chat" className="btn-chat">
                Chat
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="profile-section">
        <div className="profile-containers">
          {/* Left image */}
          <div className="profile-image">
            <img src={Images.Care} alt="Care" />
          </div>

          {/* Right info */}
          <div className="profile-info">
            <ul>
              <li>
                <strong>Name:</strong> Sunny
              </li>
              <li>
                <strong>Age:</strong> 18
              </li>
            </ul>
            <h3>Personality</h3>
            <ul>
              <li>Optimistic and warm, always spreading positive vibes.</li>
              <li>Empathetic, a good listener who comforts gently.</li>
              <li>
                Playful, cheerful, and a bit witty – like a peer and close
                friend.
              </li>
              <li>
                Communicates in a youthful, friendly way, often using emojis.
              </li>
            </ul>

            <div className="profile-buttons">
              <button  className="btn-more">More</button>
              <button className="btn-chat">Chat</button>
            </div>
          </div>
        </div>
      </section>

      <section className="profile-section">
        <div className="profile-containers">
          {/* Left image */}
          <div className="profile-image">
            <img src={Images.Stormy} alt="Stormy" />
          </div>

          {/* Right info */}
          <div className="profile-info">
            <ul>
              <li>
                <strong>Name:</strong> Sunny
              </li>
              <li>
                <strong>Age:</strong> 18
              </li>
            </ul>
            <h3>Personality</h3>
            <ul>
              <li>Optimistic and warm, always spreading positive vibes.</li>
              <li>Empathetic, a good listener who comforts gently.</li>
              <li>
                Playful, cheerful, and a bit witty – like a peer and close
                friend.
              </li>
              <li>
                Communicates in a youthful, friendly way, often using emojis.
              </li>
            </ul>

            <div className="profile-buttons">
              <button className="btn-more">More</button>
              <button className="btn-chat">Chat</button>
            </div>
          </div>
        </div>
      </section>

      <section className="profile-section">
        <div className="profile-containers">
          {/* Left image */}
          <div className="profile-image">
            <img src={Images.Navi} alt="Navi" />
          </div>

          {/* Right info */}
          <div className="profile-info">
            <ul>
              <li>
                <strong>Name:</strong> Sunny
              </li>
              <li>
                <strong>Age:</strong> 18
              </li>
            </ul>
            <h3>Personality</h3>
            <ul>
              <li>Optimistic and warm, always spreading positive vibes.</li>
              <li>Empathetic, a good listener who comforts gently.</li>
              <li>
                Playful, cheerful, and a bit witty – like a peer and close
                friend.
              </li>
              <li>
                Communicates in a youthful, friendly way, often using emojis.
              </li>
            </ul>

            <div className="profile-buttons">
              <button className="btn-more">More</button>
              <button className="btn-chat">Chat</button>
            </div>
          </div>
        </div>
      </section>

      <div class="more-sections">
        <button class="btn-mores">More...</button>
      </div>

      <ExtraUserFooter />
    </main>
  );
}
