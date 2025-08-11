import { useState, useEffect } from "react";
import './App.css';
import { FaCircleCheck } from "react-icons/fa6";
import { FaCircleXmark } from "react-icons/fa6";

function App() {
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
    <div style={{ padding: "20px" }}>
      <div className="logoContainer">
        <h1>Client Logo</h1>
      </div>

      <div className="serverContainer">
        <div className="server">
          <h3>Non Production</h3>
          <div className="serverTypes">
            <div className="app">
              <h4>Application</h4>
              <a href={statuses["YouTube"]?.url} className="linkStyle" target="_blank" rel="noopener noreferrer">
                <div  className="linkContainer">
                  { 
                    statuses["YouTube"]?.isOnline
                      ? <FaCircleCheck size={18} className="iconStyleOnline" />
                      : <FaCircleXmark size={18} className="iconStyleOffline" />
                  }
                  <p>YouTube</p>
                </div>
              </a>
            </div>

            <div className="data">
              <h4>Database</h4>
              <a href={statuses["GitHub"]?.url} className="linkStyle" target="_blank" rel="noopener noreferrer">
                <div  className="linkContainer">
                  { 
                    statuses["GitHub"]?.isOnline
                      ? <FaCircleCheck size={18} className="iconStyleOnline" />
                      : <FaCircleXmark size={18} className="iconStyleOffline" />
                  }
                  <p>GitHub</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="server">
          <h3>Production</h3>
          <div className="serverTypes">
            <div className="app">
              <h4>Application</h4>
              <a href={statuses["DEMO"]?.url} className="linkStyle" target="_blank" rel="noopener noreferrer">
                <div  className="linkContainer">
                  { 
                    statuses["DEMO"]?.isOnline
                      ? <FaCircleCheck size={18} className="iconStyleOnline" />
                      : <FaCircleXmark size={18} className="iconStyleOffline" />
                  }
                  <p>DEMO</p>
                </div>
              </a>
            </div>

            <div className="data">
              <h4>Database</h4>
              <a href={statuses["ZZZZ"]?.url} className="linkStyle" target="_blank" rel="noopener noreferrer">
                <div  className="linkContainer">
                  { 
                    statuses["ZZZZ"]?.isOnline
                      ? <FaCircleCheck size={18} className="iconStyleOnline" />
                      : <FaCircleXmark size={18} className="iconStyleOffline" />
                  }
                  <p>ORMB</p>
                </div>
              </a>
            </div>
          </div>
        </div>
        {/* 
        <p>
          <strong>Example Site:</strong>{" "}
          <span
            style={{ color: statuses["Example Site"]?.color || "gray" }}
          >
            {statuses["Example Site"]?.status || "Checking..."}
          </span>
        </p> */}
      </div>
    </div>
  );
}

export default App;
