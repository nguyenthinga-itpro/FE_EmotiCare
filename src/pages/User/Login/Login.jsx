import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginEmail, loginGoogle } from "../../../redux/Slices/AuthSlice";
import { Input, Button, Checkbox, Form, Typography, Space } from "antd";
import { useTheme } from "../../../Themes/ThemeContext";
import Videos from "../../../Constant/Videos";
import Images from "../../../Constant/Images";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";

import { gradientTextStyle, gradientButtonStyle } from "../../../Themes/Colors";

const { Text, Link } = Typography;

export default function LoginPage() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const { theme } = useTheme();

  const [form] = Form.useForm();

  const onFinish = (values) => {
    dispatch(loginEmail(values));
  };

  const handleGoogleLogin = () => {
    dispatch(loginGoogle());
  };

  return (
    <div className="w-100 vh-100 d-flex justify-content-center align-items-center">
      <div className="container w-100">
        <div className="row w-100">
          {/* Login Form */}
          <div className="col-md-6 d-flex flex-column justify-content-center align-items-end">
            <div
              className="p-4 shadow-sm rounded bg-white bg-opacity-80"
              style={{ maxWidth: "400px", width: "100%" }}
            >
              {/* Title */}
              <div className="title-login text-center mb-4">
                <Text
                  className="title"
                  style={gradientTextStyle(theme.primarycolors, 180)}
                >
                  WELCOME EMOTICARE
                </Text>
                <Text
                  className="subtitle d-block mt-2"
                  style={gradientTextStyle(theme.primarycolors, 180)}
                >
                  Please enter your information to login.
                </Text>
              </div>

              {/* Form */}
              <Form form={form} layout="vertical" onFinish={onFinish}>
                {/* Email */}
                <Form.Item
                  name="email"
                  label={
                    <span style={gradientTextStyle(theme.primarycolors, 180)}>
                      Email
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please input your email!" },
                  ]}
                >
                  <div className="input-gradient-wrapper">
                    <Input placeholder="Enter your email" />
                  </div>
                </Form.Item>

                <Form.Item
                  name="password"
                  label={
                    <span
                      style={{ ...gradientTextStyle(theme.primarycolors, 180) }}
                    >
                      Password
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <div className="input-gradient-wrapper-password">
                    <Input.Password placeholder="********" />
                  </div>
                </Form.Item>

                {/* Remember & Forgot */}
                <Form.Item name="remember" valuePropName="checked">
                  <Checkbox
                    className="custom-checkbox"
                    style={{
                      ...gradientTextStyle(theme.primarycolors, 180),
                    }}
                  >
                    Remember me
                  </Checkbox>

                  <Link
                    style={{
                      float: "right",
                      ...gradientTextStyle(theme.primarycolors, 180),
                    }}
                  >
                    Forgot password
                  </Link>
                </Form.Item>

                {/* Error */}
                {error && <Text type="danger">{error}</Text>}

                {/* Login Button */}
                <Form.Item>
                  <Button
                    htmlType="submit"
                    block
                    loading={loading}
                    style={{
                      ...gradientButtonStyle(theme.primarycolors, 180),
                      height: "50px",
                      fontSize: "16px",
                      borderRadius: "8px",
                      boxShadow: "0 8px 12px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    <Text className="button-text ">Log in</Text>
                  </Button>
                </Form.Item>
              </Form>

              {/* Google Login */}
              <Space direction="vertical" style={{ width: "100%" }}>
                <Button
                  onClick={handleGoogleLogin}
                  block
                  style={{
                    height: "50px",
                    fontSize: "16px",
                    borderRadius: "8px",
                    boxShadow: "0 8px 12px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  <img
                    src={Images.Google}
                    alt="Google"
                    className="google-image"
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 8,
                      ...gradientTextStyle(theme.primarycolors, 180),
                    }}
                  />
                  <Text
                    style={{
                      ...gradientTextStyle(theme.primarycolors, 180),
                    }}
                  >
                    {" "}
                    Sign in with Google
                  </Text>
                </Button>

                {/* Register Link */}
                <div className="link-register text-center mt-3">
                  <Text>
                    Don’t have an account?{" "}
                    <Link
                      style={{
                        ...gradientTextStyle(theme.primarycolors, 180),
                      }}
                    >
                      Register for free!
                    </Link>
                  </Text>
                </div>
              </Space>
            </div>
          </div>

          {/* Login Video */}
          <div className="col-md-6 d-flex justify-content-center align-items-center mt-4 mt-md-0">
            <video
              src={Videos.RobotLogin}
              className="img-fluid"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>
      </div>
    </div>
  );
}
