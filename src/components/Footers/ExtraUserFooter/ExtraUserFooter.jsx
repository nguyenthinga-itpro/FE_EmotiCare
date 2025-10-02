import { Layout, Row, Col, Input, Button } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";

import "./ExtraUserFooter.css";

const { Footer } = Layout;

export default function CustomFooter() {
  return (
    <Footer className="custom-footer">
      <div className="footer-container">
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={12} md={3}></Col>
          <Col xs={24} sm={12} md={4}>
            <h3 className="footer-title">EMOTICARE</h3>
            <p>Copyright © 2025 NguyenThiNga. All Rights Reserved. </p>
            <p>Social Media</p>
            <div className="social-icons">
              <a href="#">
                  <FacebookOutlined className="social-name-icon" />
                </a>
                <a href="#">
                  <TwitterOutlined className="social-name-icon" />
                </a>
                <a href="#">
                  <InstagramOutlined className="social-name-icon" />
                </a>
                <a href="#">
                  <LinkedinOutlined className="social-name-icon" />
                </a>
            </div>
          </Col>

          <Col xs={24} sm={12} md={3}>
            <h3 className="footer-title">About</h3>
            <ul className="footer-list">
              <li>About Company</li>
              <li>Our Solutions</li>
              <li>Our Best Services</li>
              <li>Professional Team</li>
            </ul>
          </Col>

          <Col xs={24} sm={12} md={5}>
            <h3 className="footer-title">Address</h3>
           <p>
                <EnvironmentOutlined className="social-name-icon" /> Cần thơ quê tôi nè các bạn ơi!!!
              </p>
              <p>
                <PhoneOutlined className="social-name-icon" /> +8478 8890 998
              </p>
              <p>
                <MailOutlined className="social-name-icon" /> nguyenthinga-itpro@gmail.com
              </p>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <h3 className="footer-title">Newsletter Signup</h3>
            <div className="newsletter">
              <input
                type="text"
                placeholder="Enter Your Email Address"
                className="newsletter-input"
              />
              <button className="send-btnEx">Send</button>
            </div>

            <p className="privacy-text">
              <input type="checkbox" /> I agree to the
              <a href="#"> Privacy Policy</a>.
            </p>
          </Col>
          <Col xs={24} sm={12} md={3}></Col>
        </Row>
      </div>
    </Footer>
  );
}
