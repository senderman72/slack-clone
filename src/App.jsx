import Main from "./components/Main/Main";
import { Route, Routes, Outlet, useNavigate } from "react-router-dom";
import SideBar from "./components/Sidebar/SideBar";
import TopNav from "./components/TopNav/TopNav";
import Login from "./components/Login/Login";
import { useState } from "react";
import { auth } from "./firebase";

function Layout() {
  const navigate = useNavigate();
  if (!auth.currentUser) {
    navigate("/login");
    return <></>;
  }
  return (
    <>
      <TopNav />
      <SideBar />
      <Outlet />
    </>
  );
}

function App() {
  const [cartIsEmpty] = useState(false);

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/channels/:id" element={<Main />} />
          <Route
            path="*"
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
