import React from "react";
import Images from "../../../Constant/Images";
import "./ArticleCard.css";
import ExtraHeader from "../../../components/Headers/ExtraHeader";
import ExtraUserFooter from "../../../components/Footers/ExtraUserFooter";

export default function More() {
  return (
    <main>
      <ExtraHeader />

      {/* Breadcrumb */}
      <div className="article-breadcrumb">
        <a href="/More">More</a> / <span>Tips & Guides:</span>
      </div>

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

      <ExtraUserFooter />
    </main>
  );
}
