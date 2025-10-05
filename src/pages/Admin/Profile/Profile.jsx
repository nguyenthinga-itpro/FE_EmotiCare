  import React, { useEffect } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { Tabs, Form, Spin } from "antd";
  import { toast } from "react-toastify";
  import moment from "moment";
  import { getUserById, clearUserState } from "../../../redux/Slices/UserSlice";
  import UserDetail from "./UserDetail";
  import AccountForm from "./AccountForm";
  import EmailUpdate from "./EmailUpdate";
  import PasswordForm from "./PasswordUpdate";
  import AvatarUpload from "./AvatarUpload";
  import OverlayLoader from "../../../components/OverlayLoader/OverlayLoader";
  import { useTheme } from "../../../Themes/ThemeContext";
  const { TabPane } = Tabs;
  import "./Profile.css";
  export default function Profile() {
    const dispatch = useDispatch();
    const { theme } = useTheme();
    const currentUser = useSelector((state) => state.user.currentUser);
    const userId = currentUser?.uid;

    const userDetail = useSelector((state) => state.users.userDetail);
    console.log("userDetail", userDetail);
    const {
      loading,
      error,
      message: successMessage,
    } = useSelector((state) => state.users);
    const [formAccount] = Form.useForm();
    const [formEmail] = Form.useForm();
    useEffect(() => {
      if (userId) {                                                        
        console.log("[Profile] Fetching user detail for", userId);
        dispatch(getUserById(userId));
      }
    }, [dispatch, userId]);

    useEffect(() => {
      if (error) {
        toast.error(error);
        dispatch(clearUserState());
      }
      if (successMessage) {
        toast.success(successMessage);
        dispatch(clearUserState());
      }
    }, [error, successMessage, dispatch]);

    useEffect(() => {
      if (userDetail) {
        formAccount.setFieldsValue({
          name: userDetail.name || "",
          username: userDetail.username || "",
          address: userDetail.address || "",
          gender: userDetail.gender || "",
          dateOfBirth: userDetail.dateOfBirth
            ? moment(userDetail.dateOfBirth)
            : null,
        });
        formEmail.setFieldsValue({ newEmail: "" });
      }
    }, [userDetail, formAccount, formEmail]);

    if (!userDetail)
      return (
        <div  style={{ textAlign: "center", padding: 50 }}>
          <Spin size="large" />
          <p>Loading user data...</p>
        </div>
      );

    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
        <div
          style={{
            minWidth: "80%",
            margin: "0 auto",
            padding: 20,
            background: theme.profileBg,
            borderRadius: 20,
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          }}
        >
          <h2 className="profile-h2"></h2>
          <h2 className="profile-texth2">Profile</h2>

          <AvatarUpload className="update-password-anticon" userDetail={userDetail} />

          <Tabs defaultActiveKey="1" className="profile-tabs">
            <TabPane tab="View Detail" key="1">
              <UserDetail user={userDetail} />
            </TabPane>

            <TabPane tab="Update Account" key="2">
              <AccountForm user={userDetail} loading={loading} />
            </TabPane>
            <TabPane tab="Update Email" key="3">
              <EmailUpdate userDetail={userDetail} />
            </TabPane>
            <TabPane tab="Update Password" key="4">
              <PasswordForm />
            </TabPane>
          </Tabs>
          <OverlayLoader loading={loading} />
        </div>
      </div>
    );
  }
