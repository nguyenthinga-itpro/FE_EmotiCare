import React from "react";
import { Card } from "antd";
import "./More.css";
import { useNavigate } from "react-router-dom";

export default function CharacterCard({ card }) {
  const { img, title, text, id } = card;
  const navigate = useNavigate();
  const handleView = () => {
    navigate("/user/articlecard", {
      state: { id },
    });
  };
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
      <button className="card-btn" onClick={handleView}>
        View
      </button>
    </Card>
  );
}
