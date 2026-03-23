import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../firebase";
import ChatView from "./ChatView";

export default function DMView() {
  const { conversationId } = useParams();

  // Update lastMessage when sending (handled in ChatView's addDoc)
  // We wrap ChatView and also update conversation's lastMessage on send
  return (
    <ChatView
      collectionPath={`conversations/${conversationId}/messages`}
      onMessageSent={async (text) => {
        await updateDoc(doc(db, "conversations", conversationId), {
          lastMessage: {
            text,
            sentBy: auth.currentUser.uid,
            sentAt: serverTimestamp(),
          },
        });
      }}
    />
  );
}
