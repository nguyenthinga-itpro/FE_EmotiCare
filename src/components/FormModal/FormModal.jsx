import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import DOMPurify from "dompurify";
import EmojiPicker from "emoji-picker-react";

// CKEditor config
const editorConfig = {
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "underline",
    "link",
    "bulletedList",
    "numberedList",
    "blockQuote",
    "|",
    "insertTable",
    "undo",
    "redo",
  ],
};

export default function FormModal({
  visible,
  onCancel,
  onSubmit,
  form,
  title,
  fields,
}) {
  const [editorValues, setEditorValues] = useState({});
  const [showEmoji, setShowEmoji] = useState(null); // field đang mở emoji

  useEffect(() => {
    if (visible) {
      const values = form.getFieldsValue();
      setEditorValues(values || {});
    } else {
      setEditorValues({});
      setShowEmoji(null);
    }
  }, [visible, form]);

  // === xử lý chọn emoji ===
  const handleEmojiClick = (emojiData, fieldName, single = false) => {
    const emoji = emojiData.emoji;
    if (single) {
      form.setFieldsValue({ [fieldName]: emoji });
      setEditorValues((prev) => ({ ...prev, [fieldName]: emoji }));
    } else {
      const newValue = (editorValues[fieldName] || "") + emoji;
      setEditorValues((prev) => ({ ...prev, [fieldName]: newValue }));
      form.setFieldsValue({ [fieldName]: newValue });
    }
    setShowEmoji(null);
  };

  // === handle Save ===
  const handleOk = async () => {
    try {
      let values = await form.validateFields();

      // sanitize editor values
      Object.keys(editorValues).forEach((key) => {
        values[key] = DOMPurify.sanitize(editorValues[key] || "");
      });

      await onSubmit(values); // ✅ truyền data ra ngoài
      onCancel(); // đóng modal
    } catch (err) {
      console.log("Validate failed:", err);
    }
  };

  return (
    <Modal className="modal-container"
      open={visible}
      title={title}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Save"
      cancelText="Cancel"
      width={700}
      centered
      
    >
      <Form layout="vertical" form={form}>
        {fields.map((f) => {
          // === INPUT ===
          if (f.type === "input")
            return (
              <Form.Item
                key={f.name}
                name={f.name}
                label={f.label}
                rules={f.rules}
              >
                <Input />
              </Form.Item>
            );

          // === EMOJI ONLY ===
          if (f.type === "emoji")
            return (
              <Form.Item
                key={f.name}
                name={f.name}
                label={f.label}
                rules={f.rules}
              >
                <div style={{ position: "relative" }}>
                  <Input
                    value={form.getFieldValue(f.name)}
                    readOnly
                    suffix={
                      <Button
                        type="text"
                        onClick={() =>
                          setShowEmoji(showEmoji === f.name ? null : f.name)
                        }
                      >
                        😀
                      </Button>
                    }
                  />
                  {showEmoji === f.name && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "40px",
                        right: "0",
                        zIndex: 1000,
                      }}
                    >
                      <EmojiPicker
                        onEmojiClick={(emojiData) =>
                          handleEmojiClick(emojiData, f.name, true)
                        }
                      />
                    </div>
                  )}
                </div>
              </Form.Item>
            );

          // === TEXTAREA (CKEditor + Emoji) ===
          if (f.type === "textarea")
            return (
              <Form.Item
                key={f.name}
                name={f.name}
                label={f.label}
                rules={f.rules}
              >
                <div style={{ position: "relative" }}>
                  <CKEditor
                    editor={ClassicEditor}
                    config={editorConfig}
                    data={editorValues[f.name] || ""}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setEditorValues({ ...editorValues, [f.name]: data });
                      form.setFieldsValue({ [f.name]: data });
                    }}
                  />

                  <Button
                    type="text"
                    onClick={() =>
                      setShowEmoji(showEmoji === f.name ? null : f.name)
                    }
                    style={{
                      position: "absolute",
                      bottom: "8px",
                      right: "8px",
                      zIndex: 10,
                      border: "none",
                      background: "transparent",
                    }}
                  >
                    😀
                  </Button>
                  {showEmoji === f.name && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "50px",
                        left: "0",
                        zIndex: 1000,
                      }}
                    >
                      <EmojiPicker
                        onEmojiClick={(emojiData) =>
                          handleEmojiClick(emojiData, f.name)
                        }
                      />
                    </div>
                  )}
                </div>
              </Form.Item>
            );

          // === SELECT ===
          if (f.type === "select")
            return (
              <Form.Item
                key={f.name}
                name={f.name}
                label={f.label}
                rules={f.rules}
              >
                <Select options={f.options} />
              </Form.Item>
            );

          // === UPLOAD ===
          if (f.type === "upload")
            return (
              <Form.Item key={f.name} label={f.label}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <Upload
                    fileList={f.fileList}
                    beforeUpload={() => false} // chặn upload tự động
                    onChange={({ fileList }) => {
                      // Chỉ giữ 1 file
                      const newFileList = fileList.slice(-1);
                      f.setFileList(newFileList);

                      // Lấy file hiện tại để preview và lưu vào form
                      if (newFileList[0]) {
                        const file = newFileList[0];
                        const url = URL.createObjectURL(file.originFileObj);
                        form.setFieldsValue({ [f.name]: url });
                      }
                    }}
                    accept={f.accept || "image/*"}
                    maxCount={1}
                  >
                    <Button
                      icon={<UploadOutlined />}
                className="button-select-file"
  
                    >
                      {f.buttonText || "Select File"}
                    </Button>
                  </Upload>

                  {/* Preview ảnh */}
                  {form.getFieldValue(f.name) && (
                    <img
                      src={form.getFieldValue(f.name)}
                      alt="Preview"
                      style={{
                        width: 100,
                        height: "auto",
                        borderRadius: 6,
                      }}
                    />
                  )}
                </div>
              </Form.Item>
            );

          // === HTML INPUT ===
          {
            /* if (f.type === "html")
            return (
              <Form.Item
                key={f.name}
                name={f.name}
                label={f.label}
                rules={f.rules}
              >
                <Input.TextArea
                  rows={5}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEditorValues((prev) => ({ ...prev, [f.name]: value }));
                    form.setFieldsValue({ [f.name]: value });
                  }}
                />
              </Form.Item>
            ); */
          }

          return null;
        })}
      </Form>
    </Modal>
  );
}
