import React from "react";
import "./TopNav.css";
import { auth } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { ChevronLeft } from "react-feather";
import { Link, useParams } from "react-router-dom";

export default function TopNav() {
  const { currentUser, logOut } = useAuth();
  const { id } = useParams();

  if (!currentUser) {
    return <div className="loading"></div>;
  }

  const handleLogOut = () => {
    logOut();
  };

  return (
    <div className="top-nav">
      <button className="Logout-btn" onClick={handleLogOut}>
        Logga ut
      </button>{" "}
      <div>
        {" "}
        {id && (
          <Link to="/channels" className="hide-on-big-screens">
            <ChevronLeft className="go-back" />
          </Link>
        )}
      </div>
      <div></div>
      <div className="profile">
        <img src={currentUser.photoURL} />
        <h3>{currentUser.displayName}</h3>
      </div>
    </div>
  );
}
