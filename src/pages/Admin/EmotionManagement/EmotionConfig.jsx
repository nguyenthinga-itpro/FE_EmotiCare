export const emotionColumnsConfig = [
  { title: "No.", dataIndex: "index", type: "index", width: 70 },
  { title: "Name", dataIndex: "detail", key: "detail" },
  {
    title: "Category",
    dataIndex: "category",
    type: "tag",
  },
  {
    title: "Emoji",
    dataIndex: "emoji",
  },
  { title: "Action", dataIndex: "action", key: "update" },
  {
    title: "Disable",
    dataIndex: "toggle",
    key: "toggle",
    align: "center",
  },
];
