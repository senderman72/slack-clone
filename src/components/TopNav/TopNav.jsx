import { useState } from "react";
import "./TopNav.css";
import { useAuth } from "../../context/AuthContext";
import { ChevronLeft, Search } from "react-feather";
import { Link, useLocation } from "react-router-dom";
import SearchPanel from "../Search/SearchPanel";

export default function TopNav() {
  const { currentUser, logOut } = useAuth();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);

  const isViewing =
    /^\/channels\/[^/]+/.test(location.pathname) ||
    /^\/dm\/[^/]+/.test(location.pathname);

  if (!currentUser) {
    return <div className="loading"></div>;
  }

  return (
    <>
      <div className="top-nav">
        <div className="top-nav-brand">
          {isViewing && (
            <Link to="/channels" className="hide-on-big-screens">
              <ChevronLeft className="go-back" />
            </Link>
          )}
          <img src="/pulse.svg" alt="Pulse" />
          <span>Pulse</span>
        </div>
        <div className="top-nav-right">
          <button
            className="search-btn"
            onClick={() => setShowSearch(true)}
            aria-label="Search messages"
          >
            <Search size={18} />
          </button>
          <div className="profile">
            <img src={currentUser.photoURL} alt="" />
            <h3>{currentUser.displayName}</h3>
          </div>
          <button className="logout-btn" onClick={logOut}>
            Log out
          </button>
        </div>
      </div>
      {showSearch && <SearchPanel onClose={() => setShowSearch(false)} />}
    </>
  );
}
