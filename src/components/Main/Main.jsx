import React, { useState, useEffect } from "react";
import "./Main.css";
import Message from "./Message/Message";
import { useParams } from "react-router-dom";
import { AiOutlineSend } from "react-icons/ai";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db, auth } from "../../firebase";

export default function Main() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  console.log(messages);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, `channels/${id}/messages`),
        orderBy("createdAt", "desc"),
        limit(100)
      ),

      (data) => {
        const messages = [];
        data.forEach((doc) => {
          messages.push({ ...doc.data(), id: doc.id });
        });
        setMessages(messages);
      }
    );
    return unsubscribe;
  }, [id]);

  return (
    <div>
      <main>
        <div className="messages-container">
          {messages.length >= 0 ? (
            messages.map((message, index) => (
              <Message {...message} key={index} />
            ))
          ) : (
            <>
              <li id="message-loading">
                <div id="image"></div>

                <p>randodsmfgdsisdufghsdfghifsdghiuosdfghiuogdfs</p>
              </li>
            </>
          )}
        </div>
        <div className="message-box">
          <textarea
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            placeholder="Message name"
          />
          <div className="submit">
            <button
              disabled={!text}
              className="send"
              onClick={async () => {
                setText("");
                await addDoc(collection(db, `channels/${id}/messages`), {
                  text: text,
                  user: {
                    photo_url: auth.currentUser.photoURL,
                    id: auth.currentUser.uid,
                    name: auth.currentUser.displayName,
                  },
                  createdAt: new Date(),
                });
              }}
            >
              <AiOutlineSend />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
