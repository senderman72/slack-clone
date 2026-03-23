import { useState, useEffect, useRef, useCallback } from "react";
import "./Main.css";
import Message from "./Message/Message";
import FileUpload from "./FileUpload";
import TypingIndicator from "./TypingIndicator";
import ThreadPanel from "./Thread/ThreadPanel";
import { AiOutlineSend } from "react-icons/ai";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  doc,
  setDoc,
  deleteField,
} from "firebase/firestore";
import { db, auth } from "../../firebase";

export default function ChatView({ collectionPath, onMessageSent }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState([]);
  const [threadMessage, setThreadMessage] = useState(null);
  const typingTimeoutRef = useRef(null);

  // Parse parent collection and ID from path like "channels/abc/messages"
  const pathParts = collectionPath?.split("/") || [];
  const parentCollection = pathParts[0] || "";
  const parentId = pathParts[1] || "";

  // Mark channel as read when viewing it
  useEffect(() => {
    if (!parentCollection || !parentId || !auth.currentUser) return;
    const stateId = `${auth.currentUser.uid}__${parentId}`;
    const stateRef = doc(db, "userChannelState", stateId);
    setDoc(stateRef, { lastRead: new Date() }, { merge: true }).catch(() => {});
  }, [parentCollection, parentId]);

  useEffect(() => {
    if (!collectionPath) return;
    const unsubscribe = onSnapshot(
      query(
        collection(db, collectionPath),
        orderBy("createdAt", "desc"),
        limit(100)
      ),
      (data) => {
        const result = [];
        data.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id });
        });
        setMessages(result);
      }
    );
    return unsubscribe;
  }, [collectionPath]);

  const updateTyping = useCallback((isTyping) => {
    if (!parentCollection || !parentId) return;
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const typingRef = doc(db, parentCollection, parentId, "meta", "typing");
    if (isTyping) {
      setDoc(typingRef, {
        [uid]: {
          name: auth.currentUser.displayName,
          timestamp: new Date(),
        }
      }, { merge: true }).catch(() => {});
    } else {
      setDoc(typingRef, { [uid]: deleteField() }, { merge: true }).catch(() => {});
    }
  }, [parentCollection, parentId]);

  function handleTextChange(e) {
    setText(e.target.value);

    // Debounced typing indicator
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    updateTyping(true);
    typingTimeoutRef.current = setTimeout(() => {
      updateTyping(false);
    }, 3000);
  }

  async function handleSend() {
    const trimmed = text.trim();
    if (!trimmed && pendingAttachments.length === 0) return;

    const messageData = {
      text: trimmed,
      user: {
        photo_url: auth.currentUser.photoURL,
        id: auth.currentUser.uid,
        name: auth.currentUser.displayName,
      },
      createdAt: new Date(),
    };

    if (pendingAttachments.length > 0) {
      messageData.attachments = pendingAttachments;
    }

    setText("");
    setPendingAttachments([]);
    updateTyping(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    await addDoc(collection(db, collectionPath), messageData);

    // Update lastMessageAt on parent doc for unread tracking
    if (parentCollection && parentId) {
      const parentRef = doc(db, parentCollection, parentId);
      setDoc(parentRef, { lastMessageAt: new Date() }, { merge: true }).catch(() => {});
    }

    if (onMessageSent) {
      onMessageSent(trimmed);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleUploadComplete(attachment) {
    setPendingAttachments((prev) => [...prev, attachment]);
  }

  function removePendingAttachment(index) {
    setPendingAttachments((prev) => prev.filter((_, i) => i !== index));
  }

  // Cleanup typing on unmount
  useEffect(() => {
    return () => {
      updateTyping(false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [updateTyping]);

  // Filter out thread replies from main view
  const topLevelMessages = messages.filter((m) => !m.threadParentId);

  return (
    <main>
      <div className="messages-container">
        {topLevelMessages.map((message) => (
          <Message
            key={message.id}
            collectionPath={collectionPath}
            onReply={() => setThreadMessage(message)}
            {...message}
          />
        ))}
      </div>
      <TypingIndicator parentCollection={parentCollection} parentId={parentId} />
      {pendingAttachments.length > 0 && (
        <div className="pending-attachments">
          {pendingAttachments.map((att, i) => (
            <div key={i} className="pending-attachment">
              <span>{att.name}</span>
              <button onClick={() => removePendingAttachment(i)} aria-label="Remove attachment">
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="message-box">
        <FileUpload onUploadComplete={handleUploadComplete} />
        <textarea
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Write a message..."
        />
        <button
          disabled={!text.trim() && pendingAttachments.length === 0}
          className="send"
          onClick={handleSend}
        >
          <AiOutlineSend className="send-icon" />
        </button>
      </div>
      {threadMessage && (
        <ThreadPanel
          parentMessage={threadMessage}
          collectionPath={collectionPath}
          onClose={() => setThreadMessage(null)}
        />
      )}
    </main>
  );
}
