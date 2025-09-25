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
import Images from "../../../src/Constant/Images";
import "./MainUserFooter.css";

const { Footer } = Layout;

export default function CustomFooter() {
  return (
    <>
      {/* Top logos, tách riêng khỏi Footer */}
      <div className="footer-topcontainer">
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Col key={i} span={3}>
              <img src={Images.Happy} alt={`Logo ${i}`} className="footer-logo" />
            </Col>
          ))}
        </Row>
      </div>

      {/* Footer chính */}
      <Footer className="custom-footer">
        <div className="footer-container">
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={12} md={2}></Col>

            <Col xs={24} sm={12} md={5}>
              <h3 className="footer-title">EMOTICARE</h3>
              <p>Copyright © 2025 NguyenThiNga. All Rights Reserved.</p>
              <p>Social Media</p>
              <div className="social-icons">
                <a href="#"><FacebookOutlined /></a>
                <a href="#"><TwitterOutlined /></a>
                <a href="#"><InstagramOutlined /></a>
                <a href="#"><LinkedinOutlined /></a>
              </div>
            </Col>

            <Col xs={24} sm={12} md={4}>
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
              <p><EnvironmentOutlined /> Cần thơ quê tôi nè các bạn ơi!!!</p>
              <p><PhoneOutlined /> +8478 8890 998</p>
              <p><MailOutlined /> nguyenthinga-itpro@gmail.com</p>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <h3 className="footer-title">Newsletter Signup</h3>
              <div className="newsletter">
                <input
                  type="text"
                  placeholder="Enter Your Email Address"
                  className="newsletter-input"
                />
                <button className="send-btnM">Send</button>
              </div>

              <p className="privacy-text">
                <input type="checkbox" /> I agree to the <a href="#"> Privacy Policy</a>.
              </p>
            </Col>

            <Col xs={24} sm={12} md={2}></Col>
          </Row>
        </div>
      </Footer>
    </>
  );
};


