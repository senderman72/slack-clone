import { useState } from "react";
import "./Message.css";
import "./MessageActions.css";
import "./ReactionPicker.css";
import "./ReactionBadge.css";
import { formatDistanceToNow } from "date-fns";
import { doc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db, auth } from "../../../firebase";
import MessageActions from "./MessageActions";
import ReactionPicker from "./ReactionPicker";
import ReactionBadge from "./ReactionBadge";

function formatTimestamp(createdAt) {
  if (!createdAt) return "";
  const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
  return formatDistanceToNow(date, { addSuffix: true });
}

function formatExactTime(createdAt) {
  if (!createdAt) return "";
  const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
  return date.toLocaleString();
}

export default function Message({ id, collectionPath, user, text, createdAt, editedAt, reactions, replyCount, onReply }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [showReactions, setShowReactions] = useState(false);

  const currentUid = auth.currentUser?.uid;
  const isOwn = user?.id === currentUid;
  const msgRef = doc(db, collectionPath, id);

  async function handleSaveEdit() {
    const trimmed = editText.trim();
    if (!trimmed || trimmed === text) {
      setEditing(false);
      setEditText(text);
      return;
    }
    await updateDoc(msgRef, { text: trimmed, editedAt: new Date() });
    setEditing(false);
  }

  async function handleDelete() {
    if (!window.confirm("Delete this message?")) return;
    await deleteDoc(msgRef);
  }

  async function handleReactionToggle(emoji) {
    const uid = currentUid;
    const currentReactions = reactions?.[emoji] || [];
    if (currentReactions.includes(uid)) {
      await updateDoc(msgRef, { [`reactions.${emoji}`]: arrayRemove(uid) });
    } else {
      await updateDoc(msgRef, { [`reactions.${emoji}`]: arrayUnion(uid) });
    }
  }

  function handleEditKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    }
    if (e.key === "Escape") {
      setEditing(false);
      setEditText(text);
    }
  }

  return (
    <div className="message-data">
      <img src={user?.photo_url} alt="" />
      <div className="message">
        <div className="message-header">
          <h3>{user?.name}</h3>
          <span className="message-time" title={formatExactTime(createdAt)}>
            {formatTimestamp(createdAt)}
          </span>
          {editedAt && <span className="message-edited">(edited)</span>}
        </div>
        {editing ? (
          <div className="message-edit">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleEditKeyDown}
              autoFocus
            />
            <div className="edit-actions">
              <button className="btn-cancel-edit" onClick={() => { setEditing(false); setEditText(text); }}>
                Cancel
              </button>
              <button className="btn-save-edit" onClick={handleSaveEdit}>
                Save
              </button>
            </div>
          </div>
        ) : (
          <p>{text}</p>
        )}
        {replyCount > 0 && (
          <button className="reply-count-btn" onClick={onReply}>
            {replyCount} {replyCount === 1 ? "reply" : "replies"}
          </button>
        )}
        {reactions && Object.keys(reactions).length > 0 && (
          <div className="reactions-row">
            {Object.entries(reactions).map(([emoji, userIds]) =>
              userIds.length > 0 ? (
                <ReactionBadge
                  key={emoji}
                  emoji={emoji}
                  userIds={userIds}
                  currentUserId={currentUid}
                  onToggle={handleReactionToggle}
                />
              ) : null
            )}
          </div>
        )}
      </div>
      <MessageActions
        isOwn={isOwn}
        onEdit={() => { setEditing(true); setEditText(text); }}
        onDelete={handleDelete}
        onReact={() => setShowReactions(!showReactions)}
        onReply={onReply}
      />
      {showReactions && (
        <ReactionPicker
          onSelect={handleReactionToggle}
          onClose={() => setShowReactions(false)}
        />
      )}
    </div>
  );
}
