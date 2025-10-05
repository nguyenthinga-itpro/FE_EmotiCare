import React, { useEffect } from "react";
import { Form, Input, Button, Select, DatePicker } from "antd";
import { useDispatch } from "react-redux";
import {
  updateUser,
  updateUserRealtime,
} from "../../../redux/Slices/UserSlice";
import { toast } from "react-toastify";
import moment from "moment";

const { Option } = Select;

export default function AccountForm({ user, loading }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name || "",
        address: user.address || "",
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth ? moment(user.dateOfBirth) : null,
      });
    }
  }, [user, form]);

  const handleSubmit = async (values) => {
    try {
      const updated = await dispatch(
        updateUser({ id: user.id, ...values })
      ).unwrap();
      dispatch(updateUserRealtime(updated));
    } catch (err) {
      toast.error("Update failed: " + err.message);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please input your name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Address" name="address">
        <Input />
      </Form.Item>
      <Form.Item className="gender-gradient" label="Gender" name="gender">
        <Select>
          <Option className="option-gradient" value="male">Male</Option>
          <Option className="option-gradient" value="female">Female</Option>
          <Option className="option-gradient" value="other">Other</Option>
        </Select>
      </Form.Item>
      <Form.Item className="dateOfBirth-gradient" label="Date of Birth" name="dateOfBirth">
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        disabled={loading}
        style={{
          background: "linear-gradient(135deg, #6e8efb, #a777e3)",
          border: "none",
          color: "#fff",
          fontWeight: "bold",
          borderRadius: "8px",
          opacity: loading ? 0.6 : 1, // mờ khi disable
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        Update Account
      </Button>
    </Form>
  );
}
