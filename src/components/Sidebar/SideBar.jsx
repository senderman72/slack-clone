import "./SideBar.css";
import { useState, useEffect } from "react";
import SideBarChannels from "./SideBarChannels/SideBarChannels";
import DirectMessagesList from "./DirectMessagesList";
import { useParams } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

export default function SideBar() {
  const { id, conversationId } = useParams();
  const [users, setUsers] = useState({});
  const isViewing = id || conversationId;

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const result = {};
      snapshot.forEach((doc) => {
        result[doc.id] = doc.data();
      });
      setUsers(result);
    });
    return unsubscribe;
  }, []);

  return (
    <div
      className={
        "sidebar " + (isViewing ? "hide-on-small-screens" : "show-on-small-screens")
      }
    >
      <SideBarChannels />
      <DirectMessagesList users={users} />
    </div>
  );
}
