import Main from "./components/Main/Main";
import DMView from "./components/Main/DMView";
import {
  Route,
  Routes,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import SideBar from "./components/Sidebar/SideBar";
import TopNav from "./components/TopNav/TopNav";
import Login from "./components/Login/Login";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, fetchingUser } = useAuth();

  // Determine if viewing a specific channel or DM
  const isViewing =
    /^\/channels\/[^/]+/.test(location.pathname) ||
    /^\/dm\/[^/]+/.test(location.pathname);

  useEffect(() => {
    if (!currentUser && !fetchingUser) {
      navigate("/login");
    }
  }, [currentUser, fetchingUser]);

  return (
    <>
      <TopNav />
      <SideBar />
      <div className={isViewing ? "show-on-small-screens" : "hide-on-small-screens"}>
        <Outlet />
      </div>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/channels/:id" element={<Main />} />
          <Route path="/dm/:conversationId" element={<DMView />} />
          <Route
            path="/channels"
            element={
              <div className="startpage">
                <h1>Select a channel to start chatting</h1>
              </div>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
