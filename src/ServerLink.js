import { useState, useEffect } from "react";
import './App.css';
import { FaCircleCheck } from "react-icons/fa6";
import { FaCircleXmark } from "react-icons/fa6";

const ServerLink = ({ serverId, serverName }) => {
  const [statuses, setStatuses] = useState({});

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
      checkWebsite("https://github.com/", "node");
    };

    checkAll();
    const interval = setInterval(checkAll, 5000); // refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);
  return (
    <a href={statuses[serverId]?.url} className="linkStyle" target="_blank" rel="noopener noreferrer">
        <div  className="linkContainer">
            { 
            statuses[serverId]?.isOnline
                ? <FaCircleCheck size={18} className="iconStyleOnline" />
                : <FaCircleXmark size={18} className="iconStyleOffline" />
            }
            <p style={{ fontSize: "18px", paddingBottom: "2px" }}>{serverName}</p>
        </div>
    </a>
  )
};

export default ServerLink;