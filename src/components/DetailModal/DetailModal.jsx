import React from "react";
import { Modal, Descriptions } from "antd";
import { marked } from "marked";
import DOMPurify from "dompurify";

export default function DetailModal({ visible, onClose, data, fields, title }) {
  return (
    <Modal
      open={visible}
      title={title}
      footer={null}
      onCancel={onClose}
      width={600}
      centered
    >
      {data && (
        <Descriptions column={1} bordered size="small">
          {fields.map((field) => (
            <Descriptions.Item key={field.key} label={field.label}>
              {field.render ? (
                field.render(data)
              ) : field.type === "html" ? (
                <div
                  style={{ whiteSpace: "pre-wrap" }}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      marked
                        .parse(data[field.key] || "")
                        .replace(
                          /<img /g,
                          '<img style="max-width:400px; height:auto; border-radius:6px; display:block; margin:8px 0;" '
                        )
                    ),
                  }}
                />
              ) : (
                data[field.key] || "N/A"
              )}
            </Descriptions.Item>
          ))}
        </Descriptions>
      )}
    </Modal>
  );
}
