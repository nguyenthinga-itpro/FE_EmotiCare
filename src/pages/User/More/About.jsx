// components/More/About.jsx
import React from "react";
import { Row, Col } from "antd";

export default function About() {
  return (
    <section
      className="about-lines"
      id="about"
    >
      <h1 className="about-line">About Us</h1>
      <Row gutter={50}>
        <Col xs={24} md={12}>
          <h3>Welcome to EmotiCare!</h3>
          <p >
            We are a friendly digital space where you can share your thoughts,
            find empathy, and nurture your emotions. EmotiCare was created to be
            a trustworthy companion, always ready to listen and provide a sense
            of comfort to everyone.
          </p>
          <h3>Our Mission</h3>
          <p>
            Our mission is to support emotional well-being, especially for young
            people. Sharing your feelings safely can help you discover yourself
            and find balance in life.
          </p>
          <h3>Our Vision</h3>
          <p>
            We aim to build a warm digital community where everyone feels heard
            and understood. EmotiCare will be a multi-platform space where
            interactive tools, virtual avatars, and emotional content help
            people connect, learn, and grow.
          </p>
        </Col>
        <Col xs={24} md={12}>
          <h3>Our Story</h3>
          <p>
            EmotiCare started with the idea: “If there’s someone who always
            listens to you, you’ll feel safer and less lonely.”
            <br />
            We created vibrant avatars representing different emotions, so you
            can connect and express yourself naturally.
          </p>
          <h3>Our Core Values</h3>
          <ul>
            <li>
              Empathy: Listening and understanding every emotion you feel.
            </li>
            <li>Friendliness: A welcoming, judgment-free space.</li>
            <li>
              Support: Tools and content to help you take care of your emotional
              well-being.
            </li>
            <li>Youthful & Creative: Designed for young people.</li>
          </ul>
        </Col>
      </Row>
    </section>
  );
}
