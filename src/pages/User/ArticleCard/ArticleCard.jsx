import React from "react";
import Images from "../../../Constant/Images";
import "./ArticleCard.css";

export default function More() {
  return (
    <main>
      {/* Card */}
      <div className="article-card">
        {/* Image */}
        <div className="article-image">
          <img src={Images.Breezy} alt="Managing Stress" />
        </div>

        {/* Title + Save */}
        <div className="article-header">
          <h3 className="article-title">Managing Stress</h3>
          <img className="article-save" src={Images.Save} alt="Save" />
        </div>

        {/* Description */}
        <p className="article-description">
          Learn to recognize the signs of stress and practice daily relaxation
          exercises.
        </p>
      </div>
    </main>
  );
}
