import React from "react";
import { Form, Input, Button } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import "./Contact.css";
import Images from "../../../Constant/Images";
import Videos from "../../../Constant/Videos";
import "./Contact.css";
import AuthHeader from "../../../components/Headers/AuthHeader";
import ExtraUserFooter from "../../../components/Footers/ExtraUserFooter";

export default function Contact() {
  return (
    <main>
      <AuthHeader />
      <section className="contact-section">
        <div className="contact-container">
          {/* Form liên hệ */}
          <div className="contact-form">
            <h1 className="gradient-texts">
              <span className="highlightt">Get in Touch</span>
            </h1>
            <p className="gradient-texts">
              Send us a message and we will get back to you as soon as possible.
            </p>

            <Form layout="vertical">
              <Form.Item
                label={<span className="gradient-textt">Your Name</span>}
                required
              >
                <Input placeholder="Enter your name" />
              </Form.Item>
              <Form.Item
                label={<span className="gradient-textt">Your Email</span>}
                required
              >
                <Input placeholder="Enter your email" />
              </Form.Item>
              <Form.Item
                label={<span className="gradient-textt">Message</span>}
                required
              >
                <Input.TextArea rows={5} placeholder="Write your message..." />
              </Form.Item>
              <Button className="send-btnss">
                <span>Send Message</span>
              </Button>
            </Form>
          </div>

          {/* Thông tin liên hệ */}
          <div className="contact-info">
            <h1 className="gradient-texts">
              <span className="highlightt">Contact Information</span>
            </h1>
            <p className="gradient-textts">
              <EnvironmentOutlined className="contact-icon" /> Cần Thơ, Việt Nam
            </p>
            <p className="gradient-textts">
              <PhoneOutlined className="contact-icon" /> +84 78 8890 998
            </p>
            <p className="gradient-textts">
              <MailOutlined className="contact-icon" />{" "}
              nguyenthinga-itpro@gmail.com
            </p>

            {/* Google map iframe */}
            <div className="map-container">
              <iframe
                // title="map"
                // src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3..."
                // allowFullScreen=""
                // loading="lazy"
                // referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
      <ExtraUserFooter />
    </main>
  );
}
