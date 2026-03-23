import { useState } from "react";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase";
import { X, Search } from "react-feather";
import SearchResult from "./SearchResult";
import "./SearchPanel.css";

export default function SearchPanel({ onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    const term = searchQuery.trim().toLowerCase();
    if (!term) return;

    setLoading(true);
    setSearched(true);

    try {
      // Get all channels
      const channelsSnapshot = await getDocs(collection(db, "channels"));
      const allResults = [];

      // Search messages in each channel
      for (const channelDoc of channelsSnapshot.docs) {
        const channelName = channelDoc.data().name;
        const messagesRef = collection(db, `channels/${channelDoc.id}/messages`);
        const q = query(messagesRef, orderBy("createdAt", "desc"), limit(50));
        const messagesSnapshot = await getDocs(q);

        messagesSnapshot.forEach((msgDoc) => {
          const data = msgDoc.data();
          if (data.text?.toLowerCase().includes(term)) {
            allResults.push({
              id: msgDoc.id,
              channelId: channelDoc.id,
              channelName,
              ...data,
            });
          }
        });
      }

      setResults(allResults.slice(0, 20));
    } catch {
      setResults([]);
    }
    setLoading(false);
  }

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-panel" onClick={(e) => e.stopPropagation()}>
        <div className="search-header">
          <form onSubmit={handleSearch} className="search-form">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              autoFocus
            />
          </form>
          <button onClick={onClose} className="search-close" aria-label="Close search">
            <X size={18} />
          </button>
        </div>
        <div className="search-results">
          {loading && <p className="search-status">Searching...</p>}
          {!loading && searched && results.length === 0 && (
            <p className="search-status">No messages found</p>
          )}
          {!loading && results.map((result) => (
            <SearchResult key={`${result.channelId}-${result.id}`} {...result} onClose={onClose} />
          ))}
        </div>
      </div>
    </div>
  );
}
