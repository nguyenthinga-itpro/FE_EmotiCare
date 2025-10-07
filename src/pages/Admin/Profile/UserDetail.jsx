import { Card, Descriptions } from "antd";
import { useTheme } from "../../../Themes/ThemeContext";
const formatValue = (key, val) => {
  if (!val) return "N/A";
  if (val._seconds) {
    const d = new Date(val._seconds * 1000);
    return key === "dateOfBirth" ? d.toLocaleDateString() : d.toLocaleString();
  }
  if (key === "dateOfBirth") {
    const d = new Date(val);
    if (!isNaN(d.getTime())) return d.toLocaleDateString();
  }
  return String(val);
};

export default function UserDetail({ user }) {
  const { theme } = useTheme();
  const fields = {
    name: "Full name",
    email: "Email",
    address: "Address",
    gender: "Gender",
    dateOfBirth: "Date of Birth",
    role: "Role",
    createdAt: "Created At",
    updatedAt: "Updated At",
  };

  return (
    <Card
      title="Profile Details"
      bordered={false}
      style={{
        width: "100%",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        background: theme.profileBgDetail,
        padding: 30,
        color: "#333",
      }}
    >
      <Descriptions
        column={2}
        labelStyle={{
          fontWeight: "600",
          color: theme.labelStyleProfileDeatail,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "200px",
          display: "inline-block",
        }}
        contentStyle={{
          color: theme.contentStyleProfileDeatail,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "200px",
          display: "inline-block",
          fontWeight: "normal",
        }}
      >
        {Object.entries(fields).map(([key, label]) => (
          <Descriptions.Item key={key} label={label}>
            {user[key] ? formatValue(key, user[key]) : "N/A"}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </Card>
  );
}
