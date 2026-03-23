import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import "./SearchPanel.css";

export default function SearchResult({ channelId, channelName, user, text, createdAt, onClose }) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/channels/${channelId}`);
    onClose();
  }

  let timeAgo = "";
  if (createdAt) {
    const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    timeAgo = formatDistanceToNow(date, { addSuffix: true });
  }

  return (
    <div className="search-result" onClick={handleClick}>
      <div className="search-result-header">
        <span className="search-result-channel">#{channelName}</span>
        <span className="search-result-time">{timeAgo}</span>
      </div>
      <div className="search-result-body">
        <img src={user?.photo_url} alt="" />
        <div>
          <span className="search-result-user">{user?.name}</span>
          <p className="search-result-text">{text}</p>
        </div>
      </div>
    </div>
  );
}
