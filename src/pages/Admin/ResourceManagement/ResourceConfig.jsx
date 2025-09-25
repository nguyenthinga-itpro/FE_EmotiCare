// src/pages/Admin/Resource/ResourceConfig.js
export const resourceColumnsConfig = [
  { title: "No.", dataIndex: "index", key: "index" },
  { title: "Title", dataIndex: "title", key: "title", type: "sorter" },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    type: "search",
  },
  {
    title: "Thumbnail",
    dataIndex: "image",
    key: "image",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    type: "tag",
    filters: ["video", "news"],
    tagColors: { video: "geekblue", news: "green" },
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    type: "tag",
  },
  { title: "Video", dataIndex: "video", key: "video" },
  { title: "Action", dataIndex: "action", key: "action" },
  {
    title: "Disable",
    dataIndex: "toggle",
    key: "toggle",
    align: "center",
  },
];
