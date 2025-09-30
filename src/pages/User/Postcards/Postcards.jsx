import React, { useEffect, useState } from "react";
import {
  HeartOutlined,
  HeartFilled,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Row,
  Col,
  Space,
  Tooltip,
  Button,
  Modal,
  Input,
  Avatar,
  Spin,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAllPostcards } from "../../../redux/Slices/PostcardSlice";
import {
  getFavoriteInfo,
  toggleFavorite,
} from "../../../redux/Slices/PostcardFavoriteSlice";
import { createComment } from "../../../redux/Slices/PostcardCommentSlice";
import { rtdb } from "../../../config/firebase";
import { ref, onValue } from "firebase/database";
import "./Postcards.css";

export default function Postcards() {
  const dispatch = useDispatch();
  const { paginatedPostcards = [], loading: pcLoading } = useSelector(
    (s) => s.postcard || {}
  );
  const { favorites } = useSelector((s) => s.favorite);
  const currentUser = useSelector((s) => s.user?.currentUser);

  const [flipped, setFlipped] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [comments, setComments] = useState({}); // { postcardId: [nested tree] }

  // Load postcards
  useEffect(() => {
    dispatch(getAllPostcards({ pageSize: 100 }));
  }, [dispatch]);

  useEffect(() => {
    setFlipped(Array(paginatedPostcards.length).fill(false));
  }, [paginatedPostcards.length]);

  // Realtime listener
  useEffect(() => {
    const commentsRef = ref(rtdb, "postcardComments");
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const grouped = {};

      Object.values(data).forEach((c) => {
        if (!grouped[c.postcardId]) grouped[c.postcardId] = [];
        grouped[c.postcardId].push(c);
      });

      const nested = {};
      Object.keys(grouped).forEach((pid) => {
        nested[pid] = buildNestedTree(grouped[pid]);
      });

      setComments(nested);
    });

    return () => unsubscribe();
  }, []);

  // Build nested tree
  const buildNestedTree = (flat) => {
    const map = {};
    flat.forEach((c) => {
      c.replies = [];
      map[c.id] = c;
    });
    const tree = [];
    flat.forEach((c) => {
      if (c.parentId && map[c.parentId]) map[c.parentId].replies.push(c);
      else tree.push(c);
    });
    return tree;
  };

  const handleFlip = (index) => {
    setFlipped((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      if (next[index] && paginatedPostcards[index]) {
        dispatch(
          getFavoriteInfo({
            postcardId: paginatedPostcards[index].id,
            userId: currentUser?.uid,
          })
        );
      }
      return next;
    });
  };

  const openModal = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
    setReplyTo(null); // reset khi mở modal mới
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
    setNewComment("");
    setReplyTo(null);
  };

  const handleLike = (postcardId) => {
    dispatch(toggleFavorite({ postcardId, userId: currentUser?.uid }));
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    if (!selectedCard) {
      console.warn("[DEBUG] No postcard selected for comment");
      return;
    }

    const payload = {
      postcardId: selectedCard.id,
      content: newComment,
      userId: currentUser?.uid,
      parentId: replyTo?.id || null, // đúng comment user chọn
    };

    console.log("[DEBUG] Sending comment:", payload);
    dispatch(createComment(payload));
    setNewComment("");
    setReplyTo(null);
  };

  const countCommentsTree = (nodes) => {
    let count = 0;
    const dfs = (n) => {
      n.forEach((c) => {
        count++;
        if (c.replies?.length) dfs(c.replies);
      });
    };
    if (nodes) dfs(nodes);
    return count;
  };

  // render nested comments
  const renderComments = (nodes, level = 0) =>
    nodes.map((node) => (
      <div
        key={node.id}
        style={{
          paddingLeft: 20 * level,
          marginBottom: 4,
          cursor: "pointer",
          borderLeft: level > 0 ? "1px solid #ddd" : "none",
          paddingTop: 4,
        }}
        onClick={(e) => {
          e.stopPropagation(); // tránh click parent
          console.log("[DEBUG] Set replyTo:", node);
          setReplyTo(node); // lưu đúng comment được click
        }}
      >
        <Space>
          <Avatar
            src={node.avatar || null}
            icon={!node.avatar ? <UserOutlined /> : null}
            size={24}
          />
          <div>
            <b>{node.author}</b>: {node.content}
          </div>
        </Space>
        {node.replies?.length ? renderComments(node.replies, level + 1) : null}
      </div>
    ));

  if (pcLoading)
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
        <Spin />
      </div>
    );

  return (
    <div>
      <Row gutter={[16, 16]} justify="center" style={{ marginTop: 20 }}>
        {paginatedPostcards.map((card, i) => {
          const fav = favorites[card.id] || {
            isFavorite: false,
            totalFavorites: 0,
          };
          const commentCount = countCommentsTree(comments[card.id]);
          return (
            <Col key={card.id} xs={24} sm={12} md={8} lg={6} xl={5}>
              <div
                className={`card-container ${flipped[i] ? "flipped" : ""}`}
                onClick={() => handleFlip(i)}
              >
                <div className="card-front">
                  <img src={card.image} alt={card.title} />
                </div>
                <div className="card-back">
                  <h2>{card.title}</h2>
                  <Space size="large">
                    <Tooltip title="Like">
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(card.id);
                        }}
                      >
                        {fav.isFavorite ? (
                          <HeartFilled style={{ color: "red" }} />
                        ) : (
                          <HeartOutlined />
                        )}{" "}
                        {fav.totalFavorites}
                      </span>
                    </Tooltip>
                    <Tooltip title="Comments">
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(card);
                        }}
                      >
                        <MessageOutlined /> {commentCount}
                      </span>
                    </Tooltip>
                  </Space>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>

      <Modal
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={1300}
        title={selectedCard?.title}
        centered
      >
        {selectedCard && (
          <>
            <div style={{ maxHeight: 400, overflowY: "auto" }}>
              {renderComments(comments[selectedCard.id] || [])}
            </div>
            {replyTo && (
              <div style={{ marginTop: 8, fontSize: 12, color: "#555" }}>
                Replying to {replyTo.author}
              </div>
            )}
            <Input.TextArea
              rows={3}
              style={{ marginTop: 8 }}
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              type="primary"
              style={{ marginTop: 8 }}
              onClick={handleAddComment}
            >
              Comment
            </Button>
          </>
        )}
      </Modal>
    </div>
  );
}
