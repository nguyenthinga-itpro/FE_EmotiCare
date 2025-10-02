import React from "react";
import { Card } from "antd";
import "./More.css";

export default function CharacterCard({ card }) {
  const { img, title, text, link } = card;

  return (
    <Card
      hoverable
      className="character-card"
      cover={
        img && (
          <div className="image-wrapper">
            <img alt={title} src={img} />
          </div>
        )
      }
    >
     <h3 className="card-title">{title}</h3>
      <p className="card-text">{text}</p>
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
    </Card>
  );
}
