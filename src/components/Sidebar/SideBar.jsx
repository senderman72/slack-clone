import "./SideBar.css";

import React from "react";
import SideBarChannels from "./SideBarChannels/SideBarChannels";
import { useParams } from "react-router-dom";

export default function SideBar() {
  const { id } = useParams();

  return (
    <div
      className={
        "sidebar " + (id ? "hide-on-small-screens" : "show-on-small-screens")
      }
    >
      <SideBarChannels />
    </div>
  );
}
