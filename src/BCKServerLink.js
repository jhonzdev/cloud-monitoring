import { useState, useEffect } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { FaCircleXmark } from "react-icons/fa6";
import axios from "axios";
import './App.css';

const ServerLink = ({ 
  serverId = null, 
  serverName = "", 
  timeCheck = false,
  href = ""
}) => {

  const [statuses, setStatuses] = useState({});
  const [lastRefresh, setLastRefresh] = useState(null);
  const [servers, setIServers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/servers").then(res => setIServers(res.data));
  }, []);

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
      servers.forEach(server => {
        checkWebsite(server.serverURL, server.serverId);
      });

      // update the timestamp
      if (typeof setLastRefresh === "function") {
        setLastRefresh(new Date().toLocaleTimeString());
      }
    };
    
    checkAll();
    const interval = setInterval(checkAll, 5000); // refresh every 5 seconds
    return () => clearInterval(interval);
  }, [servers, setLastRefresh]);

  return (
    <div>
    {timeCheck 
      ? (<a href={href} className="linkStyle" target="_blank" rel="noopener noreferrer">
          
          <div  className="linkContainer">
              {
              statuses[serverId]?.isOnline
                  ? <FaCircleCheck size={18} className="iconStyleOnline" />
                  : <FaCircleXmark size={18} className="iconStyleOffline" />
              }
              <p style={{ fontSize: "16", paddingBottom: "3px", overflow: "hidden", maxWidth: "126px" }}>{serverName}</p>
          </div>
      </a> )
      : (<div className="mainDivForTimeSpenner">
          <div className="timeTextContainer">
            <p className="lastRegreshStyle">Last Regreshed: </p> 
          </div>
          <p style={{ color:"black", marginLeft: 4, fontSize: 10, fontWeight: "bold"  }}>{lastRefresh}</p>
        </div>)
    }
    </div>
  )
};

export default ServerLink;