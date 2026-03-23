import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { MessageCircle, Plus } from "react-feather";
import PresenceIndicator from "../common/PresenceIndicator";
import NewDMModal from "./NewDMModal";
import "./DirectMessagesList.css";

export default function DirectMessagesList({ users }) {
  const [conversations, setConversations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { conversationId } = useParams();

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", auth.currentUser.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const result = [];
      snapshot.forEach((doc) => {
        result.push({ ...doc.data(), id: doc.id });
      });
      result.sort((a, b) => {
        const aTime = a.lastMessage?.sentAt?.toDate?.() || new Date(0);
        const bTime = b.lastMessage?.sentAt?.toDate?.() || new Date(0);
        return bTime - aTime;
      });
      setConversations(result);
    });
    return unsubscribe;
  }, []);

  function getOtherUser(conversation) {
    const otherUid = conversation.participants.find(
      (uid) => uid !== auth.currentUser?.uid
    );
    return users[otherUid] || { displayName: "Unknown", photoURL: "", online: false };
  }

  return (
    <div className="dm-list">
      <div className="dm-header">
        <h4>Direct Messages</h4>
        <button
          className="add-dm-btn"
          onClick={() => setShowModal(true)}
          aria-label="New direct message"
        >
          <Plus size={16} />
        </button>
      </div>
      <ul>
        {conversations.map((conv) => {
          const other = getOtherUser(conv);
          return (
            <li
              key={conv.id}
              className={conversationId === conv.id ? "active" : ""}
            >
              <PresenceIndicator online={other.online} size={8} />
              <Link to={`/dm/${conv.id}`}>
                <span className="dm-name">{other.displayName}</span>
                {conv.lastMessage && (
                  <span className="dm-preview">{conv.lastMessage.text}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
      {showModal && (
        <NewDMModal users={users} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
