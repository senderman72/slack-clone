import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import "./CreateChannelModal.css";

export default function CreateChannelModal({ onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "channels"), {
        name: trimmed,
        description: description.trim(),
        createdBy: auth.currentUser.uid,
        createdAt: new Date(),
      });
      onClose();
    } catch (err) {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Create a channel</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Channel name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. general"
              maxLength={50}
              autoFocus
            />
          </label>
          <label>
            Description <span className="optional">(optional)</span>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this channel about?"
              maxLength={200}
            />
          </label>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-create" disabled={!name.trim() || loading}>
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
