import "./ReactionBadge.css";

export default function ReactionBadge({ emoji, userIds, currentUserId, onToggle }) {
  const isActive = userIds.includes(currentUserId);
  const count = userIds.length;

  return (
    <button
      className={`reaction-badge ${isActive ? "reaction-active" : ""}`}
      onClick={() => onToggle(emoji)}
    >
      <span className="reaction-emoji">{emoji}</span>
      <span className="reaction-count">{count}</span>
    </button>
  );
}
