import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../../redux/Slices/AuthSlice";
import {
  Input,
  Button,
  Form,
  Typography,
  Space,
  Select,
  DatePicker,
} from "antd";
import { useTheme } from "../../../Themes/ThemeContext";
import Videos from "../../../Constant/Videos";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Register.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { gradientTextStyle, gradientButtonStyle } from "../../../Constant/Colors";
import moment from "moment";

const { Text } = Typography;

export default function RegisterPage() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const { theme } = useTheme();

  const [form] = Form.useForm();

  const onFinish = (values) => {
    dispatch(
      register({
        name: values.username,
        email: values.email,
        password: values.password,
        gender: values.gender,
        birthday: values.birthday,
      })
    )
      .unwrap() // nếu dùng createAsyncThunk
      .then(() => {
        toast.success(
          "Account registration successful! Please check your email!"
        );
      })
      .catch((err) => {
        toast.error(`Register fail: ${err}`);
      });
  };

  return (
    <div className="w-100 vh-100 d-flex justify-content-center align-items-center">
      <div className="container w-100">
        <div className="row w-100">
          {/* Register Form */}
          <div className="col-md-6 d-flex flex-column justify-content-center align-items-end">
            <div
              className="p-4 shadow-sm rounded bg-white bg-opacity-80"
              style={{ maxWidth: "550px", width: "100%" }}
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
                  Please enter your information to register an account.
                </Text>
              </div>

              {/* Form */}
              <Form form={form} layout="vertical" onFinish={onFinish}>
                <div className="row">
                  {/* Cột 1 */}
                  <div className="col-md-6">
                    <Form.Item
                      name="username"
                      label={
                        <span
                          style={gradientTextStyle(theme.primarycolors, 180)}
                        >
                          Username
                        </span>
                      }
                      rules={[
                        {
                          required: true,
                          message: "Please input your username!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter your username" />
                    </Form.Item>

                    <Form.Item
                      name="gender"
                      label={
                        <span
                          style={gradientTextStyle(theme.primarycolors, 180)}
                        >
                          Gender
                        </span>
                      }
                      rules={[
                        {
                          required: true,
                          message: "Please select your gender!",
                        },
                      ]}
                    >
                      <Select placeholder="Select your gender">
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                        <Option value="other">Other</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="password"
                      label={
                        <span
                          style={gradientTextStyle(theme.primarycolors, 180)}
                        >
                          Password
                        </span>
                      }
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                      ]}
                    >
                      <Input.Password placeholder="********" />
                    </Form.Item>
                  </div>

                  {/* Cột 2 */}
                  <div className="col-md-6">
                    <Form.Item
                      name="email"
                      label={
                        <span
                          style={gradientTextStyle(theme.primarycolors, 180)}
                        >
                          Email
                        </span>
                      }
                      rules={[
                        { required: true, message: "Please input your email!" },
                      ]}
                    >
                      <Input placeholder="Enter your email" />
                    </Form.Item>

                    <Form.Item
                      name="birthday"
                      label={
                        <span
                          style={gradientTextStyle(theme.primarycolors, 180)}
                        >
                          Birthday
                        </span>
                      }
                      rules={[
                        {
                          required: true,
                          message: "Please select your birthday!",
                        },
                      ]}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        format="YYYY-MM-DD"
                        disabledDate={(current) =>
                          current && current > moment().endOf("day")
                        }
                      />
                    </Form.Item>

                    <Form.Item
                      name="confirmPassword"
                      label={
                        <span
                          style={gradientTextStyle(theme.primarycolors, 180)}
                        >
                          Confirm Password
                        </span>
                      }
                      dependencies={["password"]}
                      rules={[
                        {
                          required: true,
                          message: "Please confirm your password!",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("The two passwords do not match!")
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password placeholder="********" />
                    </Form.Item>
                  </div>
                </div>

                {/* Submit Button */}
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
                    }}
                  >
                    <Text className="button-text">Register</Text>
                  </Button>
                </Form.Item>
              </Form>

              <Space direction="vertical" style={{ width: "100%" }}>
                {/* Login Link */}
                <div className="link-register text-center mt-3">
                  <Text>
                    You have an account.
                    <Link
                      to="/login"
                      style={{
                        ...gradientTextStyle(theme.primarycolors, 180),
                      }}
                    >
                      <span> Login here!</span>
                    </Link>
                  </Text>
                </div>
              </Space>
            </div>
          </div>

          {/* Register Video */}
          <div className="col-md-6 d-flex justify-content-center align-items-center mt-4 mt-md-0">
            <video
              src={Videos.RobotRegister}
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
