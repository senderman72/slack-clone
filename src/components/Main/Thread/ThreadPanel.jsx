import { useState, useEffect } from "react";
import { X } from "react-feather";
import { AiOutlineSend } from "react-icons/ai";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db, auth } from "../../../firebase";
import Message from "../Message/Message";
import "./ThreadPanel.css";

export default function ThreadPanel({ parentMessage, collectionPath, onClose }) {
  const [replies, setReplies] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!parentMessage?.id) return;
    const q = query(
      collection(db, collectionPath),
      where("threadParentId", "==", parentMessage.id),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const result = [];
      snapshot.forEach((doc) => {
        result.push({ ...doc.data(), id: doc.id });
      });
      setReplies(result);
    });
    return unsubscribe;
  }, [parentMessage?.id, collectionPath]);

  async function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) return;
    setText("");

    await addDoc(collection(db, collectionPath), {
      text: trimmed,
      user: {
        photo_url: auth.currentUser.photoURL,
        id: auth.currentUser.uid,
        name: auth.currentUser.displayName,
      },
      createdAt: new Date(),
      threadParentId: parentMessage.id,
    });

    // Increment reply count on parent message
    const parentRef = doc(db, collectionPath, parentMessage.id);
    await updateDoc(parentRef, { replyCount: increment(1) }).catch(() => {});
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === "Escape") {
      onClose();
    }
  }

  return (
    <div className="thread-panel">
      <div className="thread-header">
        <h3>Thread</h3>
        <button onClick={onClose} className="thread-close" aria-label="Close thread">
          <X size={18} />
        </button>
      </div>
      <div className="thread-parent">
        <Message
          {...parentMessage}
          collectionPath={collectionPath}
        />
      </div>
      <div className="thread-divider">
        <span>{replies.length} {replies.length === 1 ? "reply" : "replies"}</span>
      </div>
      <div className="thread-replies">
        {replies.map((reply) => (
          <Message
            key={reply.id}
            collectionPath={collectionPath}
            {...reply}
          />
        ))}
      </div>
      <div className="thread-input">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Reply..."
        />
        <button disabled={!text.trim()} className="send" onClick={handleSend}>
          <AiOutlineSend size={16} />
        </button>
      </div>
    </div>
  );
}
