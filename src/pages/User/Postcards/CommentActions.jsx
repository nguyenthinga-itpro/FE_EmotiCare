// src/components/CommentActions.jsx
import React from "react";
import { Button, Dropdown } from "antd";
import { MoreOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

export default function CommentActions({
  commentId,
  content,
  openDropdownId,
  setOpenDropdownId,
  openEditModal,
  openDeleteModal,
}) {
  const menuItems = [
    {
      key: "edit",
      label: (
        <span
          onClick={(e) => {
            e.stopPropagation();
            openEditModal(commentId, content);
          }}
        >
          <EditOutlined /> Edit
        </span>
      ),
    },
    {
      key: "delete",
      danger: true,
      label: (
        <span
          onClick={(e) => {
            e.stopPropagation();
            openDeleteModal(commentId);
          }}
        >
          <DeleteOutlined /> Delete
        </span>
      ),
    },
  ];

  return (
    <Dropdown
      trigger={["click"]}
      open={openDropdownId === commentId}
      onOpenChange={(flag) => setOpenDropdownId(flag ? commentId : null)}
      menu={{ items: menuItems }}
    >
      <Button
        type="text"
        icon={<MoreOutlined />}
        onClick={(e) => {
          e.stopPropagation();
          setOpenDropdownId(openDropdownId === commentId ? null : commentId);
        }}
      />
    </Dropdown>
  );
}
