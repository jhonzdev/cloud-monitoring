import { useState, useEffect } from "react";
import './App.css';
import { FaCircleCheck } from "react-icons/fa6";
import { FaCircleXmark } from "react-icons/fa6";

const ServerLink = ({ nameSever }) => {
  const [statuses, setStatuses] = useState({});

  // Function to check one website
  const checkWebsite = (url, name) => {
    fetch(`http://localhost:5000/ping?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then((data) => {
        setStatuses((prev) => ({
          ...prev,
          [name]: {
            isOnline: data.status === "up",
            url
          }
        }));
      })
  };

  useEffect(() => {
    // Check all manually defined sites
    const checkAll = () => {
      checkWebsite("https://www.youtube.com/", "YouTube");
      checkWebsite("https://www.github.com/", "GitHub");
      checkWebsite("https://example-database.com", "DEMO");
    };

    checkAll();
    const interval = setInterval(checkAll, 5000); // refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);
  return (
    <a href={statuses[nameSever]?.url} className="linkStyle" target="_blank" rel="noopener noreferrer">
        <div  className="linkContainer">
            { 
            statuses[nameSever]?.isOnline
                ? <FaCircleCheck size={18} className="iconStyleOnline" />
                : <FaCircleXmark size={18} className="iconStyleOffline" />
            }
            <p>{nameSever}</p>
        </div>
    </a>
  )
};

export default ServerLink;