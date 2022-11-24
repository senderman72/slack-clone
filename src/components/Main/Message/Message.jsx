import React from "react";
import "./Message.css";

export default function Message({ user, text, createdAt }) {
  return (
    <div className="message-data">
      <img src={user?.photo_url} alt="" />
      <div className="message">
        <h3>{user?.name}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}
