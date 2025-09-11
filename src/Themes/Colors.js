// src/constants/Colors.js
export const themeLight = {
  primarycolors: ["#667eea", "#764ba2"],
  background: "#f5f5f5",
  text: "#0a0a0a",
};

export const themeDark = {
  primarycolors: ["#1a1a2e", "#16213e"],
  background: "#0a0a0a",
  text: "#ffffff",
};

// Style gradient text tái sử dụng
export const gradientTextStyle = (colors, angle) => ({
  background: `linear-gradient(${angle}deg, ${colors[0]}, ${colors[1]})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
});

export const gradientButtonStyle = (colors, angle) => ({
  background: `linear-gradient(${angle}deg, ${colors[0]}, ${colors[1]})`,
  // WebkitTextFillColor: "transparent",
});
// 0deg → ngang trái → phải

// 90deg → dọc trên → dưới

// 180deg → ngang phải → trái

// 270deg → dọc dưới → trên
