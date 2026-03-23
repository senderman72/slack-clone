import "./SideBarChannels.css";
import { Hash, Plus, Trash2 } from "react-feather";
import { Link, useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../../../firebase";
import { collection, onSnapshot, deleteDoc, doc, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import CreateChannelModal from "../CreateChannelModal";

export default function SideBarChannels() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [unreadMap, setUnreadMap] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "channels"), (snapshot) => {
      const result = [];
      snapshot.forEach((doc) => {
        result.push({ ...doc.data(), id: doc.id });
      });
      setChannels(result);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Listen for user's read states
  useEffect(() => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;
    const q = query(
      collection(db, "userChannelState"),
      where("__name__", ">=", `${uid}__`),
      where("__name__", "<=", `${uid}__\uf8ff`)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const map = {};
      snapshot.forEach((doc) => {
        const channelId = doc.id.split("__")[1];
        map[channelId] = doc.data().lastRead;
      });
      setUnreadMap(map);
    }, () => {
      // Query may fail if index doesn't exist; fall back gracefully
    });
    return unsubscribe;
  }, []);

  function isUnread(channel) {
    if (!channel.lastMessageAt) return false;
    if (id === channel.id) return false; // Currently viewing
    const lastRead = unreadMap[channel.id];
    if (!lastRead) return true; // Never read
    const lastMsg = channel.lastMessageAt?.toDate ? channel.lastMessageAt.toDate() : new Date(channel.lastMessageAt);
    const lastReadDate = lastRead?.toDate ? lastRead.toDate() : new Date(lastRead);
    return lastMsg > lastReadDate;
  }

  async function handleDelete(e, channelId) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Delete this channel? This cannot be undone.")) return;
    await deleteDoc(doc(db, "channels", channelId));
    if (id === channelId) {
      navigate("/channels");
    }
  }

  return (
    <div className="side-bar-channels">
      <div className="channels-header">
        <h4>Channels</h4>
        <button
          className="add-channel-btn"
          onClick={() => setShowModal(true)}
          aria-label="Create channel"
        >
          <Plus size={16} />
        </button>
      </div>
      <ul>
        {loading ? (
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <li key={i} id="sidebar-skeleton">
                <div></div>
                <p>{"channel".padEnd(6 + i, "x")}</p>
              </li>
            ))}
          </>
        ) : channels.length > 0 ? (
          channels.map((channel) => (
            <li key={channel.id} className={id === channel.id ? "active" : ""}>
              <Hash size={12} style={{ flexShrink: 0 }} />
              <Link to={`/channels/${channel.id}`} className={isUnread(channel) ? "unread" : ""}>
                {channel.name}
              </Link>
              {isUnread(channel) && <span className="unread-dot" />}
              {channel.createdBy === auth.currentUser?.uid && (
                <button
                  className="delete-channel-btn"
                  onClick={(e) => handleDelete(e, channel.id)}
                  aria-label="Delete channel"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </li>
          ))
        ) : (
          <li className="no-channels">
            <p>No channels yet</p>
          </li>
        )}
      </ul>
      {showModal && <CreateChannelModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
