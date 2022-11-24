import React from "react";
import "./TopNav.css";
import { auth } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

export default function TopNav() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <div className="loading"></div>;
  }

  return (
    <div className="top-nav">
      <img src={currentUser.photoURL} />
      <h3>{currentUser.displayName}</h3>
    </div>
  );
}
