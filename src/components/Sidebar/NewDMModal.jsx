import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../firebase";
import PresenceIndicator from "../common/PresenceIndicator";
import "./NewDMModal.css";

export default function NewDMModal({ users, onClose }) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const currentUid = auth.currentUser?.uid;
  const userList = Object.entries(users)
    .filter(([uid]) => uid !== currentUid)
    .filter(([, user]) =>
      user.displayName?.toLowerCase().includes(search.toLowerCase())
    );

  async function startConversation(otherUid) {
    // Check if conversation already exists
    const participants = [currentUid, otherUid].sort();
    const q = query(
      collection(db, "conversations"),
      where("participants", "==", participants)
    );
    const existing = await getDocs(q);

    if (!existing.empty) {
      navigate(`/dm/${existing.docs[0].id}`);
      onClose();
      return;
    }

    // Create new conversation
    const docRef = await addDoc(collection(db, "conversations"), {
      participants,
      createdAt: serverTimestamp(),
      lastMessage: null,
    });
    navigate(`/dm/${docRef.id}`);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content new-dm-modal" onClick={(e) => e.stopPropagation()}>
        <h2>New message</h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          autoFocus
          className="dm-search-input"
        />
        <ul className="dm-user-list">
          {userList.map(([uid, user]) => (
            <li key={uid} onClick={() => startConversation(uid)}>
              <img src={user.photoURL} alt="" />
              <span>{user.displayName}</span>
              <PresenceIndicator online={user.online} size={8} />
            </li>
          ))}
          {userList.length === 0 && (
            <li className="no-results">No users found</li>
          )}
        </ul>
      </div>
    </div>
  );
}
