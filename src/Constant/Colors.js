export const gradientTextStyle = (colors = ["#000", "#fff"], angle = 0) => ({
  background: `linear-gradient(${angle}deg, ${colors[0]}, ${colors[1]})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
});

export const gradientButtonStyle = (
  colors = ["#6e8efb", "#a777e3"],
  angle = 0
) => ({
  background: `linear-gradient(${angle}deg, ${colors[0]}, ${colors[1]})`,
});

// 0deg → ngang trái → phải

// 90deg → dọc trên → dưới

// 180deg → ngang phải → trái

// 270deg → dọc dưới → trên
