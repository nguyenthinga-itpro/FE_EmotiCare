export const chatColumnsConfig = [
  { title: "No.", dataIndex: "index", type: "index", width: 70 },
  { title: "Name", dataIndex: "nameDisplay", key: "name" },
  { title: "System Prompt", dataIndex: "systemPrompt", key: "systemPrompt" },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    type: "html",
  },
  {
    title: "Category",
    dataIndex: "category",
    type: "tag",
  },
  {
    title: "Default Greeting",
    dataIndex: "defaultGreeting",
    key: "defaultGreeting",
    render: (text) => text || "N/A",
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
