import Main from "./components/Main/Main";
import {
  Route,
  Routes,
  Outlet,
  useNavigate,
  useParams,
} from "react-router-dom";
import SideBar from "./components/Sidebar/SideBar";
import TopNav from "./components/TopNav/TopNav";
import Login from "./components/Login/Login";
import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";

function Layout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, fetchingUser } = useAuth();
  console.log(currentUser);
  useEffect(() => {
    if (!currentUser && !fetchingUser) {
      navigate("/login");
    }
  }, [currentUser]);
  return (
    <>
      <TopNav />
      <SideBar />
      <div className={id ? "show-on-small-screens" : "hide-on-small-screens"}>
        <Outlet />
      </div>
    </>
  );
}

function App() {
  const [cartIsEmpty] = useState(false);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/channels/:id" element={<Main />} />
          <Route
            path="/channels"
            element={
              <div className="startpage">
                <h1>
                  Welcome to my slack clone👋🏽, choose a channel and start
                  chatting💬
                </h1>
              </div>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
