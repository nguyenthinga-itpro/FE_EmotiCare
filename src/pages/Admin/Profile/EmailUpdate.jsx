import React, { useState } from "react";
import { Form, Input, Button, Spin } from "antd";
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import Api from "../../../api/api";
import { updateUserRealtime } from "../../../redux/Slices/UserSlice";
import { logout } from "../../../redux/Slices/AuthSlice";
import { toast } from "react-toastify";

export default function EmailUpdateFlow({ userDetail }) {
  const dispatch = useDispatch();
  const [formVerifyPassword] = Form.useForm();
  const [formEmail] = Form.useForm();
  const [step, setStep] = useState(1);
  const [pendingEmail, setPendingEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleVerifyPassword = async (values) => {
    setLoading(true);
    try {
      console.log("[Email Flow] Step 1: verify password", values);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");

      const credential = EmailAuthProvider.credential(
        user.email,
        values.currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      toast.success("Reauthentication successful!");
      setStep(2);
    } catch (err) {
      toast.error("Password verification failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerificationEmail = async (values) => {
    setLoading(true);
    const newEmail = values.newEmail?.trim();
    const currentPassword = formVerifyPassword
      .getFieldValue("currentPassword")
      ?.trim();
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");
      if (newEmail === user.email)
        return toast.error("New email cannot be the same as current email");
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      setPendingEmail(newEmail);
      await sendEmailVerification(user);
      console.log(`[Email Flow] Verification email sent to ${newEmail}`);
      setStep(3);
    } catch (err) {
      console.error("[Email Flow] handleSendVerificationEmail error:", err);
      toast.error(err.message || "Failed to send verification email");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckEmailVerified = async () => {
    setLoading(true);
    try {
      console.log("[Email Flow] Step 3: checking verification status");
      const auth = getAuth();
      await auth.currentUser.reload();
      const verified = auth.currentUser.emailVerified;
      setEmailVerified(verified);
      if (verified) {
        console.log("[Email Flow] Email verified");
        toast.success("Email verified! You can finalize update.");
      } else {
        toast.info("Email not verified yet. Please check your inbox.");
      }
    } catch (err) {
      console.error("[Email Flow] handleCheckEmailVerified error:", err);
      toast.error("Failed to check email verification: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizeEmailUpdate = async () => {
    setLoading(true);
    if (!emailVerified) return toast.error("Email not verified yet");
    if (!pendingEmail) return toast.error("No pending email to update");

    try {
      const userRef = doc(db, "users", userDetail.id);
      await updateDoc(userRef, { email: pendingEmail });
      await Api.patch(`/user/${userDetail.id}/email`, { email: pendingEmail });
      const updated = { ...userDetail, email: pendingEmail };
      dispatch(updateUserRealtime(updated));
      formEmail.resetFields();
      setStep(1);
      setEmailVerified(false);
      setPendingEmail("");
      toast.success("Email update successfully!");
      toast.info("You might login again after change email");
      await logout();
    } catch (err) {
      toast.error("Failed to finalize email update: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Overlay loading toàn màn hình */}
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

      {/* STEP 1 */}
      {step === 1 && (
        <Form
          form={formVerifyPassword}
          layout="vertical"
          onFinish={handleVerifyPassword}
        >
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[
              { required: true, message: "Please enter current password" },
            ]}
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
            Verify Password
          </Button>
        </Form>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <Form
          form={formEmail}
          layout="vertical"
          onFinish={handleSendVerificationEmail}
        >
          <Form.Item
            label="New Email"
            name="newEmail"
            rules={[
              { required: true, message: "Please enter new email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input />
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
            Send Verification Email
          </Button>
        </Form>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div>
          <Button
            type="default"
            style={{
              marginBottom: 16,
            }}
            onClick={handleCheckEmailVerified}
            disabled={loading}
          >
            Check Email Verified
          </Button>
          {emailVerified && (
            <Button
              type="primary"
              onClick={handleFinalizeEmailUpdate}
              style={{
                marginLeft: 16,
                background: "linear-gradient(135deg, #6e8efb, #a777e3)",
                border: "none",
                color: "#fff",
              }}
            >
              Finalize Email Update
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
