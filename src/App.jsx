import { useState } from "react";
import Main from "./components/Main/Main";
import { Route, Routes, Outlet } from "react-router-dom";
import SideBar from "./components/Sidebar/SideBar";
import Login from "./components/Login/Login";

function Layout() {
  return (
    <>
      <SideBar />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/channels/:id" element={<Main />} />
          <Route path="*" element={<p>404</p>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
