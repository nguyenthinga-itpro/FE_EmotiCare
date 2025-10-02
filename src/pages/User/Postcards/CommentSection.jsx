import React from "react";
import { Modal, Input, Button, Avatar } from "antd";

export default function CommentSection({
  isOpen,
  onClose,
  card,
  comments,
  renderComments,
  replyTo,
  newComment,
  setNewComment,
  onSubmit,

  // ---- Edit Modal Props ----
  isEditOpen,
  onEditClose,
  editContent,
  setEditContent,
  onSaveEdit,

  // ---- Delete Modal Props ----
  isDeleteOpen,
  onDeleteClose,
  onConfirmDelete,
}) {
  return (
    <>
      {/* Modal bình luận chính */}
      <Modal
        open={isOpen}
        onCancel={onClose}
        footer={null}
        width={1300}
        title={card?.title}
        centered
        className="comment-container"
      >
        {card && (
          <div>
            {/* Render cây bình luận */}
            <div className="card-comment-container">
              {renderComments(comments[card.id] || [])}
            </div>

            {/* Nếu đang reply ai */}
            {replyTo && (
              <div className="text-comment" style={{ marginTop: 8 }}>
                Replying to <Avatar size={18} src={replyTo.avatar} />{" "}
                {replyTo.author}
              </div>
            )}

            {/* Ô nhập comment */}
            <Input.TextArea
              rows={3}
              style={{ marginTop: 8 }}
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="input-comment"
            />

            <Button
              style={{ marginTop: 8 }}
              onClick={onSubmit}
              disabled={!newComment.trim()}
              className="button-comment"
            >
              Comment
            </Button>
          </div>
        )}
      </Modal>

      {/* Modal sửa comment */}
      <Modal
        open={isEditOpen}
        onCancel={onEditClose}
        onOk={onSaveEdit}
        okText="Save"
        cancelText="Cancel"
        centered
      >
        <Input.TextArea
          rows={3}
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
        />
      </Modal>

      {/* ✅ Modal xác nhận xoá */}
      <Modal
        open={isDeleteOpen}
        onCancel={onDeleteClose}
        onOk={onConfirmDelete}
        okText="Delete"
        okType="danger"
        cancelText="Cancel"
        centered
      >
        <p>Are you sure you want to delete this comment?</p>
        <p style={{ color: "red" }}>This action cannot be undone.</p>
      </Modal>
    </>
  );
}
