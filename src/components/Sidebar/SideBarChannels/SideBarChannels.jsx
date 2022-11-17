import React from "react";
import "./SideBarChannels.css";
import { Link } from "react-router-dom";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";

import { useState, useEffect } from "react";

export default function SideBarChannels() {
  const [channels, setChannels] = useState([]);

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
        {channels.map((channel) => (
          <li>
            <Link to={`/channels/${channel.id}`}>{channel.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
