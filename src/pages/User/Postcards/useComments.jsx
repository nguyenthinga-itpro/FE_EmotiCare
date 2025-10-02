import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { rtdb } from "../../../config/firebase";
import { ref, onValue } from "firebase/database";
import {
  createComment,
  editComment,
  deleteComment,
} from "../../../redux/Slices/PostcardCommentSlice";
import { toast } from "react-toastify";

export const useComments = (currentUser) => {
  const dispatch = useDispatch();
  const [comments, setComments] = useState({});

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

  const buildNestedTree = (flat) => {
    const map = {};
    flat.forEach((c) => {
      c.replies = [];
      map[c.id] = c;
    });
    const tree = [];
    flat.forEach((c) =>
      c.parentId && map[c.parentId]
        ? map[c.parentId].replies.push(c)
        : tree.push(c)
    );
    return tree;
  };

  const addComment = (cardId, content, replyTo = null) => {
    if (!content.trim()) return;
    dispatch(
      createComment({
        postcardId: cardId,
        content,
        userId: currentUser?.uid,
        parentId: replyTo?.id || null,
      })
    );
  };

  const editExistingComment = async (id, content) => {
    if (!content.trim()) return;
    try {
      await dispatch(
        editComment({ id, userId: currentUser.uid, content })
      ).unwrap();
      toast.success("Comment edited!");
    } catch (err) {
      toast.error(err?.error || "Failed to edit comment");
    }
  };

  const deleteExistingComment = async (id) => {
    try {
      await dispatch(deleteComment({ id })).unwrap();
      toast.success("Comment deleted!");
    } catch (err) {
      toast.error(err?.error || "Failed to delete comment");
    }
  };

  const countCommentsTree = (nodes) => {
    let count = 0;
    const dfs = (n) =>
      n.forEach((c) => {
        count++;
        if (c.replies?.length) dfs(c.replies);
      });
    if (nodes) dfs(nodes);
    return count;
  };

  return {
    comments,
    addComment,
    editExistingComment,
    deleteExistingComment,
    countCommentsTree,
  };
};
