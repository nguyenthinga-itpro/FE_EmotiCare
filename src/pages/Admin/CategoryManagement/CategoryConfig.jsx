export const categoryColumnsConfig = [
  { title: "No.", dataIndex: "index", type: "index", width: 70 },
  { title: "Name", dataIndex: "detail", key: "detail", type: "sorter" },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Image",
    dataIndex: "image",
    key: "image",
  },
  { title: "Action", dataIndex: "action", key: "update" },
  {
    title: "Disable",
    dataIndex: "toggle",
    key: "toggle",
    align: "center",
  },
];
