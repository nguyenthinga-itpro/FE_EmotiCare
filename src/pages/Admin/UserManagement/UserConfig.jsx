export const userColumnsConfig = [
  { title: "No.", dataIndex: "index", type: "index", width: 70 },
  { title: "Account", dataIndex: "accountCell", type: "search" },
  {
    title: "Role",
    dataIndex: "role",
    type: "tag",
    filters: ["admin", "user"],
    tagColors: { admin: "geekblue", user: "green" },
  },
  {
    title: "Gender",
    dataIndex: "gender",
    type: "tag",
    filters: ["male", "female"],
    tagColors: { male: "blue", female: "pink" },
    width: 120,
  },
  { title: "Birthday", dataIndex: "dateOfBirth", type: "sorter" },
  { title: "Last activity", dataIndex: "lastActive", type: "sorter" },
  {
    title: "Disable",
    dataIndex: "toggle",
    key: "toggle",
    align: "center",
  },
];
