import "./TopNav.css";
import { useAuth } from "../../context/AuthContext";
import { ChevronLeft } from "react-feather";
import { Link, useLocation } from "react-router-dom";

export default function TopNav() {
  const { currentUser, logOut } = useAuth();
  const location = useLocation();

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
          <div className="profile">
            <img src={currentUser.photoURL} alt="" />
            <h3>{currentUser.displayName}</h3>
          </div>
          <button className="logout-btn" onClick={logOut}>
            Log out
          </button>
        </div>
      </div>
    </>
  );
}
