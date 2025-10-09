// src/pages/Verify.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail } from "../../redux/Slices/AuthSlice";
import "./Verify.css";

const { Title } = Typography;

export default function Verify() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { message, error } = useSelector((state) => state.user);
  const currentUser = useSelector((s) => s.user?.currentUser);
  const [bubbles, setBubbles] = useState([]);
  const [activeBubbles, setActiveBubbles] = useState(new Set());

  const colors = [
    "#ff4d4f",
    "#ffa940",
    "#52c41a",
    "#1890ff",
    "#f759ab",
    "#13c2c2",
  ];

  useEffect(() => {
    // tạo bubble animation
    const newBubbles = Array.from({ length: 100 }).map(() => {
      const duration = 3 + Math.random() * 4;
      const delay = Math.random() * 2;
      return {
        id: Math.random(),
        left: `${Math.random() * 100}vw`,
        size: `${30 + Math.random() * 30}px`,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: `${delay}s`,
        duration: `${duration}s`,
        totalTime: delay + duration,
      };
    });
    setBubbles(newBubbles);

    // gọi redux verifyEmail
    const email = currentUser?.email;
    if (email) {
      dispatch(verifyEmail({ email }));
    }

    // redirect sau khi animation xong
    const maxTime = Math.max(...newBubbles.map((b) => b.totalTime));
    const timer = setTimeout(() => navigate("/"), maxTime * 1000);

    return () => clearTimeout(timer);
  }, [dispatch, navigate]);

  const handleGlow = (id) => {
    setActiveBubbles((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setActiveBubbles((prev) => {
        const copy = new Set(prev);
        copy.delete(id);
        return copy;
      });
    }, 500);
  };

  return (
    <div className="verify-container">
      {bubbles.map((b) => (
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
        />
      ))}

      <Card className="verify-card">
        <Title level={2} className="verify-card-title">
          {error ? `Verification failed: ${error}` : message || "Verifying..."}
        </Title>
      </Card>
    </div>
  );
}
