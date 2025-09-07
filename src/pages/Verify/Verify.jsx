import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Card } from "antd";
import "./Verify.css";

const { Title } = Typography;

export default function Verify() {
  const navigate = useNavigate();
  const [bubbles, setBubbles] = useState([]);
  const [activeBubbles, setActiveBubbles] = useState(new Set());

  const colors = ["#ff4d4f", "#ffa940", "#52c41a", "#1890ff", "#f759ab", "#13c2c2"];

  useEffect(() => {
  const newBubbles = Array.from({ length: 100 }).map(() => {
    const duration = 6 + Math.random() * 4; // 6-10 giây
    const delay = Math.random() * 5; // 0-5 giây
    return {
      id: Math.random(),
      left: `${Math.random() * 100}vw`,
      size: `${30 + Math.random() * 30}px`,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: `${delay}s`,
      duration: `${duration}s`,
      totalTime: delay + duration, // dùng để tính redirect
    };
  });

  setBubbles(newBubbles);

  // Tìm thời gian lớn nhất
  const maxTime = Math.max(...newBubbles.map(b => b.totalTime));

  // Tự động chuyển về home sau khi tất cả bay xong
  const timer = setTimeout(() => navigate("/"), maxTime * 1000);
  return () => clearTimeout(timer);
}, [navigate]);


  const handleGlow = (id) => {
    setActiveBubbles(prev => new Set(prev).add(id));
    setTimeout(() => {
      setActiveBubbles(prev => {
        const copy = new Set(prev);
        copy.delete(id);
        return copy;
      });
    }, 500);
  };

  return (
    <div className="verify-container">
      {bubbles.map(b => (
        <div
          key={b.id}
          className={`bubble ${activeBubbles.has(b.id) ? "active" : ""}`}
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            backgroundColor: b.color,
            animationDelay: b.delay,
            animationDuration: b.duration,
          }}
          onClick={() => handleGlow(b.id)}
        ></div>
      ))}

      <Card className="verify-card">
        <Title level={2} className="verify-card-title">
       Welcome to EmotiCare! We’re thrilled to have you here!
        </Title>
      </Card>
    </div>
  );
}
