import React from "react";
import { Card } from "antd";
import "./More.css";
import { useNavigate } from "react-router-dom";

export default function VideoCard({ video }) {
  const { src, title, id } = video;
  const navigate = useNavigate();
  console.log("src", src);
  const handleView = () => {
    navigate("/user/articlecard", {
      state: { id, src },
    });
  };
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
        <h3 className="card-title-resource">{title}</h3>
        {/* <p className="card-text">{text}</p> */}
        {/* {link && (
          <a
            // href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="card-btn"
            onClick={handleView}
          >
            View
          </a>
        )} */}
        <button className="card-btn" onClick={handleView}>
          View
        </button>
      </div>
    </Card>
  );
}
