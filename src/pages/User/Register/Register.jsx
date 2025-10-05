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
import {
  gradientTextStyle,
  gradientButtonStyle,
} from "../../../Constant/Colors";
import moment from "moment";
import OverlayLoader from "../../../components/OverlayLoader/OverlayLoader";
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
    <div className="login-container">
      <div className="container w-100">
        <div className="row w-100">
          {/* Register Form */}
          <div className="col-md-6 d-flex flex-column justify-content-center align-items-end">
            <div
              className="p-4 shadow-sm rounded bg-white bg-opacity-80"
              style={{
                maxWidth: "550px",
                width: "100%",
                background: "var(--postcardssections) !important",
              }}
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
                  Please enter your information to register an account.
                </Text>
              </div>
              <OverlayLoader loading={loading} />
              {/* Form */}
              <Form form={form} layout="vertical" onFinish={onFinish}>
                <div className="row">
                  {/* Cột 1 */}
                  <div className="col-md-6">
                    <Form.Item
                      className="form-name-username"
                      name="username"
                      label={
                        <span className="form-label-gradient">Username</span>
                      }
                      rules={[
                        {
                          required: true,
                          message: "Please input your username!",
                        },
                      ]}
                    >
                      <Input
                        className="input-gradient"
                        placeholder="Enter your username"
                      />
                    </Form.Item>

<Form.Item
  className="form-name-gender"
  name="gender"
  label={<span className="form-label-gradient">Gender</span>}
  rules={[{ required: true, message: "Please select your gender!" }]}
>
  <Select className="input-gradient" placeholder="Select your gender">
    <Option className="option-gradient" value="male">Male</Option>
    <Option className="option-gradient" value="female">Female</Option>
    <Option className="option-gradient" value="other">Other</Option>
  </Select>
</Form.Item>


  <Form.Item
    className="form-name-password"
    name="password"
    label={<span className="form-label-gradient">Password</span>}
    rules={[{ required: true, message: "Please input your password!" }]}
  >
    <Input.Password className="confirm-password-input-custom"  placeholder="********" />
  </Form.Item>
</div>

                  {/* Cột 2 */}
                  <div className="col-md-6">
                    <Form.Item
                      className="form-name-email"
                      name="email"
                      label={<span className="form-label-gradient">Email</span>}
                      rules={[
                        { required: true, message: "Please input your email!" },
                      ]}
                    >
                      <Input
                        className="input-gradient"
                        placeholder="Enter your email"
                      />
                    </Form.Item>

                    <Form.Item
                      className="form-name-birthday"
                      name="birthday"
                      label={
                        <span className="form-label-birthday">Birthday</span>
                      }
                      rules={[
                        {
                          required: true,
                          message: "Please select your birthday!",
                        },
                      ]}
                    >
                      <DatePicker
                        className="form-label-birthday-years"
                        dropdownClassName="birthday-dropdown"
                        style={{ width: "100%" }}
                        format="YYYY-MM-DD"
                        disabledDate={(current) =>
                          current && current > moment().endOf("day")
                        }
                      />
                    </Form.Item>

                    <Form.Item
                      className="form-name-confirmPassword"
                      name="confirmPassword"
                      label={
                        <span className="form-label-gradient">
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
                      <Input.Password
                        className="confirm-password-input-custom"
                        placeholder="********"
                      />
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
                  <Text className="account-wrapper">
                    <div className="account-text">You have an account.</div>
                    <Link
                      to="/login"
                      style={{
                        ...gradientTextStyle(theme.primarycolors, 180),
                      }}
                    >
                      <span className="link-register-for-free">
                        {" "}
                        Login here!
                      </span>
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
