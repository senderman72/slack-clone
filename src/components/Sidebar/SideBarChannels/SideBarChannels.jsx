import React from "react";
import "./SideBarChannels.css";
import { Hash } from "react-feather";

import { Link, useParams } from "react-router-dom";
import { db } from "../../../firebase";

import { collection, getDocs } from "firebase/firestore";

import { useState, useEffect } from "react";

export default function SideBarChannels() {
  const [channels, setChannels] = useState([]);
  const { id } = useParams();

  async function getChannels() {
    const data = await getDocs(collection(db, "channels"));
    const channels = [];
    data.forEach((doc) => {
      channels.push({ ...doc.data(), id: doc.id });
    });
    setChannels(channels);
  }
  console.log(channels);
  useEffect(() => {
    getChannels();
  }, []);

  return (
    <div className="side-bar-channels">
      <ul>
        {channels.length > 0 ? (
          channels.map((channel,index) => (
            <li key={index} className={id === channel.id ? "active" : ""}>
              <Hash size={12} style={{ flexShrink: "0" }} />
              <Link to={`/channels/${channel.id}`}>{channel.name}</Link>
            </li>
          ))
        ) : (
          <>
            <li id="sidebar-skeleton">
              <div></div>
              <p>randodsm</p>
            </li>
            <li id="sidebar-skeleton">
              <div></div>
              <p>randoffm</p>
            </li>
            <li id="sidebar-skeleton">
              <div></div>
              <p>randomsdfsdfs</p>
            </li>
            <li id="sidebar-skeleton">
              <div></div>
              <p>randomsdgksgsg</p>
            </li>
            <li id="sidebar-skeleton">
              <div></div>
              <p>randofsdfm</p>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
