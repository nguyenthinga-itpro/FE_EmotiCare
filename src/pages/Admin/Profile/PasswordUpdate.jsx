import { Form, Input, Button, Spin } from "antd";
import { useDispatch } from "react-redux";
import { updateUserPassword } from "../../../redux/Slices/UserSlice";
import { toast } from "react-toastify";
import { useState } from "react";

export default function PasswordForm() {
  const dispatch = useDispatch();
  const [formPassword] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const handlePasswordUpdate = async (values) => {
    setLoading(true);
    const { currentPassword, newPassword } = values;
    try {
      await dispatch(
        updateUserPassword({ currentPassword, newPassword })
      ).unwrap();
      formPassword.resetFields();
      toast.success("Password updated successfully!");
    } catch (err) {
      toast.error(err.message || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={formPassword}
      layout="vertical"
      onFinish={handlePasswordUpdate}
      style={{ position: "relative" }}
    >
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255,255,255,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <Spin size="large" />
        </div>
      )}
      <Form.Item       className="confirm-password-input-custom"

        label="Current Password"
        name="currentPassword"
        rules={[{ required: true, message: "Please enter current password" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item       className="confirm-password-input-custom"

        label="New Password"
        name="newPassword"
        rules={[{ required: true, message: "Please enter new password" }]}
      >
        <Input.Password />
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        disabled={loading}
        style={{
          background: "linear-gradient(135deg, #6e8efb, #a777e3)",
          border: "none",
          color: "#fff",
        }}
      >
        Change Password
      </Button>
    </Form>
  );
}
