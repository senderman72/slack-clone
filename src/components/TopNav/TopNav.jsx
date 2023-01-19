import React from "react";
import "./TopNav.css";
import { auth } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { ChevronLeft } from "react-feather";
import { Link, useParams } from "react-router-dom";

export default function TopNav() {
  const { currentUser } = useAuth();
  const { id } = useParams();

  if (!currentUser) {
    return <div className="loading"></div>;
  }

  return (
    <div className="top-nav">
      {id && (
        <Link to="/channels" className="hide-on-big-screens">
          <ChevronLeft />
        </Link>
      )}
      <img src={currentUser.photoURL} />
      <h3>{currentUser.displayName}</h3>
    </div>
  );
}
