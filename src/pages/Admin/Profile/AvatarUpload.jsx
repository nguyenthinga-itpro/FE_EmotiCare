import React, { useState } from "react";
import { Upload, Button, Avatar, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  uploadUserAvatar,
  updateUserImage,
  updateUser,
  updateUserRealtime,
} from "../../../redux/Slices/UserSlice";

export default function AvatarUpload({ userDetail }) {
  const dispatch = useDispatch();
  const [localLoading, setLocalLoading] = useState(false);
  //   const [preview, setPreview] = useState(null);

  const handleAvatarUpload = async ({ file }) => {
    // if (!userDetail) return toast.error("User not loaded yet");
    // setPreview(URL.createObjectURL(file));
    setLocalLoading(true);
    try {
      let imageUrl;
      if (userDetail.image) {
        const res = await dispatch(
          updateUserImage({ id: userDetail.id, file })
        ).unwrap();
        imageUrl = res.imageUrl;
      } else {
        imageUrl = await dispatch(uploadUserAvatar(file)).unwrap();
      }

      if (userDetail?.id) {
        const updated = await dispatch(
          updateUser({ id: userDetail.id, image: imageUrl })
        ).unwrap();
        dispatch(updateUserRealtime(updated));
      }
    } catch (err) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginBottom: 20 }}>
      <Spin spinning={localLoading}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Avatar
            size={100}
            src={userDetail.image || "https://i.pravatar.cc/150?img=3"}
          />
          <Upload
            showUploadList={false}
            beforeUpload={(file) => {
              handleAvatarUpload({ file });
              return false;
            }}
          >
            <Button
              shape="circle"
              icon={<UploadOutlined />}
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                transform: "translate(20%, 20%)",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6e8efb, #a777e3)",
                color: "#fff",
              }}
            />
          </Upload>
        </div>
      </Spin>
    </div>
  );
}
