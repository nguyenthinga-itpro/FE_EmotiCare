import React from "react";
import { Card } from "antd";
import "./More.css";

export default function VideoCard({ video }) {
  const { src, title, link } = video;

  return (
    <Card hoverable className="character-card">
      <div className="video-wrapper">
        <iframe
          width="100%"
          height="200"
          src={src}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        {/* <p className="card-text">{text}</p> */}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="card-btn"
          >
            View
          </a>
        )}
      </div>
    </Card>
  );
}
