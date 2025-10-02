import React, { useState } from "react";
import { Form, Input, Button, Typography, Card } from "antd";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/firebase"; // ⚠️ nhớ import từ config firebase của bạn
import { useTheme } from "../../Themes/ThemeContext";
import { gradientTextStyle, gradientButtonStyle } from "../../Constant/Colors";
import "./ForgotPassword.css";
const { Title, Text } = Typography;

export default function ForgotPassword() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { theme } = useTheme();

  const onFinish = async (values) => {
    setLoading(true);
    setMessage(null);
    try {
      await sendPasswordResetEmail(auth, values.email);
      setMessage({
        type: "success",
        text: "Password reset email sent! Please check your inbox.",
      });
      form.resetFields();
    } catch (error) {
      console.error("Reset password error:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to send reset email.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="forgotPassword-container">
    <div className=" d-flex justify-content-center align-items-center vh-100">
      <Card
        style={{
          maxWidth: 400,
          width: "100%",
          padding: 20,
          borderRadius: "12px",
          boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
              background: "var(--postcardssections)",
        }}
      >
        <Title
          level={3}


        >
          <div className="title-forgot-password">Forgot Password</div>
        </Title>


        <Text className="title-text-password"
          style={{ display: "block", textAlign: "center", marginBottom: 20 }}
        >
          Enter your email address and we’ll send you a link to reset your
          password.
        </Text>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item 
            label={
              <span className="title-email-password">
                Email
              </span>
            }
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input className="title-input-enter-your-email" placeholder="Enter your email" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{
                ...gradientButtonStyle(theme.primarycolors, 180),
                height: "45px",
                borderRadius: "8px",
              }}
            >
              Send Reset Link
            </Button>
          </Form.Item>
        </Form>

        {message && (
          <Text
            type={message.type === "error" ? "danger" : "success"}
            style={{ display: "block", textAlign: "center", marginTop: 10 }}
          >
            {message.text}
          </Text>
        )}
      </Card>
    </div>
    </div>
  );
}
