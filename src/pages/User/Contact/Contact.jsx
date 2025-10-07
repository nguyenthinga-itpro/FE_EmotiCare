import React from "react";
import { Form, Input, Button } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import "./Contact.css";

export default function Contact() {
  return (
    <main>
      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-form">
            <h1 className="gradient-texts">
              <span className="highlightt">Get in Touch</span>
            </h1>
            <p className="gradient-texts">
              Send us a message and we will get back to you as soon as possible.
            </p>

            <Form layout="vertical">
              <Form.Item
                className="form-style-contact"
                label={<span className="gradient-textt">Your Name</span>}
                required
              >
                <Input
                  className="Input-placeholder"
                  placeholder="Enter your name"
                />
              </Form.Item>

              <Form.Item
                className="form-style-contact"
                label={<span className="gradient-textt">Your Email</span>}
                required
              >
                <Input
                  className="Input-placeholder"
                  placeholder="Enter your email"
                />
              </Form.Item>

              <Form.Item
                className="form-style-contact"
                label={<span className="gradient-textt">Message</span>}
                required
              >
                <Input.TextArea
                  className="Input-placeholder"
                  rows={5}
                  placeholder="Write your message..."
                />
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
              <EnvironmentOutlined className="contact-icon-gradient" /> Cần Thơ,
              Việt Nam
            </p>
            <p className="gradient-textts">
              <PhoneOutlined className="contact-icon-gradient" /> +84 78 8890
              998
            </p>
            <p className="gradient-textts">
              <MailOutlined className="contact-icon-gradient" />
              nguyenthinga-itpro@gmail.com
            </p>

            {/* Google Map iframe */}
            <div className="map-container">
              <iframe
                title="map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.123456789!2d105.7329805!3d10.0425078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529abcdef1234%3A0xabcdef123456789!2zQ8O0bmcgVGjhuq9uLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1759165465671!5m2!1svi!2s"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
