// src/pages/Admin/Postcard/PostcardConfig.js
export const postcardColumnsConfig = [
  { title: "No.", dataIndex: "index", key: "index" },
  { title: "Title", dataIndex: "titleDisplay", key: "title", type: "sorter" },
  {
    title: "Message",
    dataIndex: "description",
    key: "description",
    type: "search",
  },
  {
    title: "Author",
    dataIndex: "author",
    key: "author",
    type: "search",
  },
  {
    title: "Image",
    dataIndex: "image",
    key: "image",
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    type: "tag",
  },
  { title: "Music", dataIndex: "musicDisplay", key: "music" },
  { title: "Action", dataIndex: "action", key: "action" },
  {
    title: "Disable",
    dataIndex: "toggle",
    key: "toggle",
    align: "center",
  },
];
