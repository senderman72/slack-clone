import React from "react";
import "./TopNav.css";
import { auth } from "../../firebase";

export default function TopNav() {
  return (
    <div className="top-nav">
      <img src={auth.currentUser.photoURL} alt="" />
      <h3>{auth.currentUser.displayName}</h3>
    </div>
  );
}
