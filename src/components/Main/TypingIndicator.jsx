import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../firebase";
import "./TypingIndicator.css";

export default function TypingIndicator({ parentCollection, parentId }) {
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    const typingRef = doc(db, parentCollection, parentId, "meta", "typing");
    const unsubscribe = onSnapshot(typingRef, (snapshot) => {
      if (!snapshot.exists()) {
        setTypingUsers([]);
        return;
      }
      const data = snapshot.data();
      const now = Date.now();
      const currentUid = auth.currentUser?.uid;
      const active = Object.entries(data)
        .filter(([uid, info]) => {
          if (uid === currentUid) return false;
          const ts = info?.timestamp;
          const timestamp = ts?.toDate ? ts.toDate().getTime() : (ts instanceof Date ? ts.getTime() : ts);
          return timestamp && now - timestamp < 5000;
        })
        .map(([, info]) => info?.name || "Someone");
      setTypingUsers(active);
    }, () => {
      // Doc may not exist yet, ignore errors
      setTypingUsers([]);
    });
    return unsubscribe;
  }, [parentCollection, parentId]);

  if (typingUsers.length === 0) return null;

  let text;
  if (typingUsers.length === 1) {
    text = `${typingUsers[0]} is typing`;
  } else if (typingUsers.length === 2) {
    text = `${typingUsers[0]} and ${typingUsers[1]} are typing`;
  } else {
    text = "Several people are typing";
  }

  return (
    <div className="typing-indicator">
      <span className="typing-dots">
        <span></span><span></span><span></span>
      </span>
      <span className="typing-text">{text}</span>
    </div>
  );
}
