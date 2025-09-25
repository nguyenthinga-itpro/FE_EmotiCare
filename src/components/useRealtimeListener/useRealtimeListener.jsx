import { useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

export default function useRealtimeListener({
  db,
  collectionName,
  dispatchAdd,
  dispatchUpdate,
  dispatchRemove,
  active = true,
}) {
  useEffect(() => {
    if (!active) return;
    if (!db || !collectionName) return;
    const q = query(
      collection(db, collectionName),
      orderBy("updatedAt", "desc"),
      limit(1)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const record = { id: change.doc.id, ...change.doc.data() };
        if (record.createdAt instanceof Timestamp)
          record.createdAt = record.createdAt.toDate().toISOString();
        if (record.updatedAt instanceof Timestamp)
          record.updatedAt = record.updatedAt.toDate().toISOString();

        if (change.type === "added") dispatchAdd(record);
        if (change.type === "modified") dispatchUpdate(record);
        if (change.type === "removed") dispatchRemove(record.id);
      });
    });
    return () => unsub();
  }, [db, collectionName, dispatchAdd, dispatchUpdate, dispatchRemove, active]);
}
