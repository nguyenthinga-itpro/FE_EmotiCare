import React, { useState, useRef, useEffect, useMemo } from "react";
import { Row, Spin, Avatar, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import FilterBar from "./FilterBar";
import PostcardItem from "./PostcardItem";
import CommentSection from "./CommentSection";
import CommentActions from "./CommentActions";
import Images from "../../../Constant/Images";
import { usePostcards } from "./usePostcards";
import { useComments } from "./useComments";
import {
  getFavoriteInfo,
  toggleFavorite,
} from "../../../redux/Slices/PostcardFavoriteSlice";
import "./Postcards.css";
import { useLocation } from "react-router-dom";
import OverlayLoader from "../../../components/OverlayLoader/OverlayLoader";

export default function Postcards() {
  const dispatch = useDispatch();
  const currentUser = useSelector((s) => s.user?.currentUser);
  const location = useLocation();
  const initialCategoryF = location.state?.category?.name;
  // filters
  const [categoryFilter, setCategoryFilter] = useState("");
  const [favoriteFilter, setFavoriteFilter] = useState(false);
  const [searchText, setSearchText] = useState("");

  // ✅ Khi có initialCategoryF thì set nó vào categoryFilter
  useEffect(() => {
    if (initialCategoryF) {
      setCategoryFilter(initialCategoryF); // Ví dụ initialCategoryF = "Happiness"
    }
  }, [initialCategoryF]);

  const filters = useMemo(
    () => ({
      categoryFilter,
      favoriteFilter,
      searchText,
    }),
    [categoryFilter, favoriteFilter, searchText]
  );

  const { cards, loadMore, loading, paginatedCategories, favorites } =
    usePostcards(10, filters);

  const {
    comments,
    addComment,
    editExistingComment,
    deleteExistingComment,
    countCommentsTree,
  } = useComments(currentUser);

  const scrollRef = useRef(null);
  const [flipped, setFlipped] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [replyTo, setReplyTo] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editState, setEditState] = useState({
    open: false,
    id: null,
    content: "",
  });
  const [deleteState, setDeleteState] = useState({ open: false, id: null });
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [newComment, setNewComment] = useState("");

  // flip array sync
  useEffect(() => setFlipped(Array(cards.length).fill(false)), [cards.length]);

  // infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current || loading) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMore(); // ✅ không dùng cursor nữa
      }
    };
    const container = scrollRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [loading, loadMore]);

  const handleFlip = (index) => {
    setFlipped((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      console.log("FLIP INDEX", index, "CARD", cards[index]?.id);
      if (next[index] && cards[index]) {
        dispatch(
          getFavoriteInfo({
            postcardId: cards[index].id,
            userId: currentUser?.uid,
          })
        );
        setSelectedCard(cards[index]);
      } else setSelectedCard(null);
      return next;
    });
  };

  const toggleAll = () => {
    setFlipped(Array(flipped.length).fill(!flipped.some((f) => f)));
  };

  const openModal = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
    setReplyTo(null);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
    setNewComment("");
    setReplyTo(null);
  };

  const handleLike = (postcardId) =>
    dispatch(toggleFavorite({ postcardId, userId: currentUser?.uid }));
  const handleAddComment = () => {
    if (selectedCard) {
      addComment(selectedCard.id, newComment, replyTo);
      setNewComment("");
      setReplyTo(null);
    }
  };
  const openEditModal = (id, content) =>
    setEditState({ open: true, id, content });
  const closeEditModal = () =>
    setEditState({ open: false, id: null, content: "" });
  const openDeleteModal = (id) => setDeleteState({ open: true, id });
  const onConfirmDelete = () => {
    deleteExistingComment(deleteState.id);
    setDeleteState({ open: false, id: null });
  };

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
          e.stopPropagation();
          setReplyTo(node);
        }}
      >
        <Space>
          <Avatar
            src={node.avatar}
            icon={!node.avatar ? <UserOutlined /> : null}
            size={24}
          />
          <div>
            <b>{node.author}</b>: {node.content}
            {node.userId === currentUser?.uid && (
              <CommentActions
                commentId={node.id}
                content={node.content}
                openDropdownId={openDropdownId}
                setOpenDropdownId={setOpenDropdownId}
                openEditModal={openEditModal}
                openDeleteModal={openDeleteModal}
              />
            )}
          </div>
        </Space>
        {node.replies?.length ? renderComments(node.replies, level + 1) : null}
      </div>
    ));

  return (
    <div className="postcards-container">
      <OverlayLoader loading={loading} />
      <section className="title-container">
        <div className="content">
          <h1 className="title-postcard-type">POST CARDS</h1>
        </div>
      </section>
      <div className="filter-bar-container">
        <FilterBar
          searchText={searchText}
          setSearchText={setSearchText}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          favoriteFilter={favoriteFilter}
          setFavoriteFilter={setFavoriteFilter}
          toggleAll={toggleAll}
          allOpen={flipped.every((f) => f === true)}
          paginatedCategories={paginatedCategories}
        />
      </div>
      <div className="postcards-scroll-container" ref={scrollRef}>
        <div className="postcards-scroll-content">
          <Row
            gutter={[16, 16]}
            justify="center"
            className="row-postcards-scroll"
          >
            {cards.map((card, i) => {
              const fav = favorites?.[card.id] || {
                isFavorite: false,
                totalFavorites: 0,
              };
              console.log("CARD:", card.id, "FAV STATE:", fav);
              const categoryDetail = paginatedCategories.find(
                (c) => c?.id === card.categoryId
              );
              const commentCount = countCommentsTree(comments[card.id]);
              return (
                <PostcardItem
                  key={card.id}
                  card={card}
                  categoryDetail={categoryDetail}
                  flipped={flipped[i]}
                  onFlip={() => handleFlip(i)}
                  fav={fav}
                  onLike={() => handleLike(card.id)}
                  onOpenModal={() => openModal(card)}
                  commentCount={commentCount}
                />
              );
            })}
          </Row>
          {loading && (
            <div style={{ textAlign: "center", padding: 20 }}>
              <Spin />
            </div>
          )}
        </div>
      </div>

      <CommentSection
        isOpen={isModalOpen}
        onClose={closeModal}
        card={selectedCard}
        comments={comments}
        renderComments={renderComments}
        replyTo={replyTo}
        setReplyTo={setReplyTo}
        newComment={newComment}
        setNewComment={setNewComment}
        onSubmit={handleAddComment}
        isEditOpen={editState.open}
        onEditClose={closeEditModal}
        editContent={editState.content}
        setEditContent={(c) => setEditState({ ...editState, content: c })}
        onSaveEdit={() => editExistingComment(editState.id, editState.content)}
        isDeleteOpen={deleteState.open}
        onDeleteClose={() => setDeleteState({ open: false, id: null })}
        onConfirmDelete={onConfirmDelete}
      />
    </div>
  );
}
