import { Edit2, Trash2, Smile, MessageSquare } from "react-feather";
import "./MessageActions.css";

export default function MessageActions({ isOwn, onEdit, onDelete, onReact, onReply }) {
  return (
    <div className="message-actions">
      <button onClick={onReact} aria-label="Add reaction">
        <Smile size={14} />
      </button>
      {onReply && (
        <button onClick={onReply} aria-label="Reply in thread">
          <MessageSquare size={14} />
        </button>
      )}
      {isOwn && (
        <>
          <button onClick={onEdit} aria-label="Edit message">
            <Edit2 size={14} />
          </button>
          <button onClick={onDelete} aria-label="Delete message" className="action-danger">
            <Trash2 size={14} />
          </button>
        </>
      )}
    </div>
  );
}
