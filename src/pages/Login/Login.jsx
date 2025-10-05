import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginEmail, loginGoogle } from "../../redux/Slices/AuthSlice";
import { Input, Button, Checkbox, Form, Typography, Space } from "antd";
import { useTheme } from "../../Themes/ThemeContext";
import Videos from "../../Constant/Videos";
import Images from "../../Constant/Images";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { gradientTextStyle, gradientButtonStyle } from "../../Constant/Colors";

const { Text } = Typography;

export default function LoginPage() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const res = await dispatch(loginEmail(values)).unwrap(); // unwrap để bắt lỗi
      const role = res.user.role; // lấy role từ response
      console.log("role", role);
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "user") {
        navigate("/user");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await dispatch(loginGoogle()).unwrap(); // unwrap để bắt lỗi
      const role = res.user.role; // lấy role từ response
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };

  return (
    <div className="login-container">
      <div className="container w-100">
        <div className="row w-100">
          {/* Login Form */}
          <div className="col-md-6 d-flex flex-column justify-content-center align-items-end">
            
            <div
              className="custom-card"
            >
              {/* Title */}
              <div className="title-login text-center mb-4">
                <Text
                  className="title-lg"
                  style={gradientTextStyle(theme.primarycolors, 180)}
                >
                  WELCOME EMOTICARE
                </Text>
                <Text
                  className="subtitle-tx d-block mt-2"
                  style={gradientTextStyle(theme.primarycolors, 180)}
                >
                  Please enter your information to login.
                </Text>
              </div>

              {/* Form */}
              <Form form={form} layout="vertical" onFinish={onFinish}>
                {/* Email */}
                <Form.Item
  className="form-name-email"
  name="email"
  label={<span className="form-label-gradient">Email</span>}
  rules={[{ required: true, message: "Please input your email!" }]}
>
  <div className="input-gradient-wrapper">
    <Input
      className="input-gradient"
      placeholder="Enter your email"
    />
  </div>
</Form.Item>

<Form.Item
  className="form-name-password"
  name="password"
  label={<span className="form-label-gradient">Password</span>}
  rules={[{ required: true, message: "Please input your password!" }]}
>
  <div className="input-gradient-wrapper">
    <Input.Password
      className="confirm-password-input-custom"
      placeholder="********"
    />
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
                    className="forgot-password"
                    to="/forgotpassword"
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
                    className="google-gradientTextStyle"
                    style={{
                      ...gradientTextStyle(theme.primarycolors, 180),
                    }}
                  >
                    Sign in with Google
                  </Text>
                </Button>

                {/* Register Link */}
                <div className="link-register text-center mt-3">
                  <Text>
                    Don’t have an account?
                    <Link
                      to="/register"
                      style={{
                        ...gradientTextStyle(theme.primarycolors, 180),
                      }}
                    >
                      <span className="link-register-for-free">
                        {" "}
                        Register for free!
                      </span>
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
