export const faqColumnsConfig = [
  { title: "No.", dataIndex: "index", key: "index" },
  { title: "Question", dataIndex: "question", key: "question", type: "search" },
  { title: "Answer", dataIndex: "answer", key: "answer", type: "search" },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    type: "tag",
    filters: ["general", "privacy", "chatbox", "support"],
    tagColors: {
      general: "geekblue",
      privacy: "green",
      chatbox: "pink",
      support: "purple",
    },
  },
  { title: "Action", dataIndex: "action", key: "action" },
  {
    title: "Disable",
    dataIndex: "toggle",
    key: "toggle",
    align: "center",
  },
];
