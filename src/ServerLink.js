import { useState, useEffect } from "react";
import './App.css';
import { FaCircleCheck } from "react-icons/fa6";
import { FaCircleXmark } from "react-icons/fa6";

const ServerLink = ({ 
  serverId = null, 
  serverName = "", 
  timeCheck = false
}) => {
  // const db = require('better-sqlite3')('/db/database.db');

  const [statuses, setStatuses] = useState({});
    const [lastRefresh, setLastRefresh] = useState(null);
  
  // Function to check one website
  // Parameter url=urlServer name=serverId
  const checkWebsite = (url, serverId) => {
    fetch(`http://localhost:5000/ping?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then((data) => {
        setStatuses((prev) => ({
          ...prev,
          [serverId]: {
            isOnline: data.status === "up",
            url
          }
        }));
      })
  };

  useEffect(() => {
    // Check all manually defined sites
    const checkAll = () => {
      // List of Cloud Website
      checkWebsite("https://www.youtube.com/", "youtube");
      checkWebsite("https://githubasd.com/", "githubss");
      checkWebsite("https://github.com/", "github");
      checkWebsite("https://nodejs.org/en", "node");
      checkWebsite("https://laravel.com/", "laravel");
      checkWebsite("https://www.w3schools.com/php/", "w3school");
      checkWebsite("https://shopee.ph/", "shopee");
      checkWebsite("https://www.lazada.com.ph/", "lazada");
      checkWebsite("https://www.bpi.com.ph/", "bpi");

      // update the timestamp
      if (typeof setLastRefresh === "function") {
        setLastRefresh(new Date().toLocaleTimeString());
      }
    };

    checkAll();
    const interval = setInterval(checkAll, 5000); // refresh every 5 seconds
    return () => clearInterval(interval);
  }, [setLastRefresh]);
  return (
    <div>
    {timeCheck 
      ? (<a href={statuses[serverId]?.url} className="linkStyle" target="_blank" rel="noopener noreferrer">
          <div  className="linkContainer">
              { 
              statuses[serverId]?.isOnline
                  ? <FaCircleCheck size={18} className="iconStyleOnline" />
                  : <FaCircleXmark size={18} className="iconStyleOffline" />
              }
              <p style={{ fontSize: "16", paddingBottom: "3px" }}>{serverName}</p>
          </div>
      </a> )
      : (<div><p style={{ color:"black", margin: 0, marginLeft: 4, fontSize: 14  }}>Last Regreshed: {lastRefresh}</p></div> )
    }
    </div>
  )
};

export default ServerLink;