import React from "react";
import { Collapse, Carousel } from "antd";

import Images from "../../../Constant/Images";
import Videos from "../../../Constant/Videos";
import "./Stories.css";

const { Panel } = Collapse;

export default function Stories() {
  return (
    <main>

      <div className="video-container">
        <video
          src={Videos.Storya}
          controls
          autoPlay={false}
          className="video-player"
        />
      </div>

      <section className="stories-section" id="stories">
        <div className="container">
          <div className="stories-header">
            <h1 className="stories-title">Daily Stories</h1>
            <h3 className="stories-subtitle">Click on stories</h3>
          </div>

          <section className="stories-carousel">
            <Carousel dots={{ className: "custom-dots" }}>
              <div>
                <div className="stories-grid">
                  <div className="story-card">
                    <video
                      src={Videos.Story}
                      controls
                      className="story-video"
                    />
                  </div>
                  <div className="story-card">
                    <video
                      src={Videos.Story}
                      controls
                      className="story-video"
                    />
                  </div>
                  <div className="story-card">
                    <video
                      src={Videos.Story}
                      controls
                      className="story-video"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="stories-grid">
                  <div className="story-card">
                    <video
                      src={Videos.Story}
                      controls
                      className="story-video"
                    />
                  </div>
                  <div className="story-card">
                    <video
                      src={Videos.Story}
                      controls
                      className="story-video"
                    />
                  </div>
                  <div className="story-card">
                    <video
                      src={Videos.Story}
                      controls
                      className="story-video"
                    />
                  </div>
                </div>
              </div>
            </Carousel>
          </section>
        </div>
      </section>
      <section className="stories-sections">
        <h1 className="stories-titles">Interactive Stories</h1>
        <p className="stories-subtitle">You choose mood today</p>

        <div className="stories-grids">
          <div className="story-cards">
            <img src={Images.Happy} alt="Happy" className="story-icon" />
          </div>
          <div className="story-cardss">
            <img src={Images.Sad} alt="Sad" className="story-icon" />
          </div>
          <div className="story-cards">
            <img src={Images.Angry} alt="Angry" className="story-icon" />
          </div>
          <div className="story-cardss">
            <img src={Images.Think} alt="Think" className="story-icon" />
          </div>
          <div className="story-cards">
            <img src={Images.Scare} alt="Scare" className="story-icon" />
          </div>
        </div>
      </section>
    </main>
  );
}
