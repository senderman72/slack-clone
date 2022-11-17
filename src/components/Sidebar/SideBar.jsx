import "./SideBar.css";

import React from "react";
import SideBarChannels from "./SideBarChannels/SideBarChannels";

export default function SideBar() {
  return (
    <div className="sidebar">
      <SideBarChannels />
    </div>
  );
}
