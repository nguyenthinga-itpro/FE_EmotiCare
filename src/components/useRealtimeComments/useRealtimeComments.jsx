import { useEffect } from "react";
import { adminRTDB } from "../../config/firebase"; // client RTDB
import { useDispatch } from "react-redux";
import { setComments } from "../../../redux/Slices/PostcardCommentSlice";

export default function useRealtimeComments(postcardId) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!postcardId) return;

    const commentsRef = adminRTDB.ref("postcardComments");
    const query = commentsRef.orderByChild("postcardId").equalTo(postcardId);

    const listener = query.on("value", (snapshot) => {
      const data = snapshot.val() || {};
      dispatch(setComments({ postcardId, comments: data }));
    });

    return () => query.off("value", listener);
  }, [postcardId, dispatch]);
}
