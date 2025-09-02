import ServerLink from './ServerLink';
import clientLogo from './assets/ey.png';
import { useState, useEffect } from "react";
import axios from "axios";
import InputServer from './InputServer';
import { FiServer } from "react-icons/fi";
import DropDownServer from './DropDownServer';
import { ImLoop2 } from "react-icons/im";
import { TbEdit } from "react-icons/tb";
import { RiDeleteBin5Line } from "react-icons/ri";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const openModal = () => setIsOpen(true);

  const closeModal = () => {
    setIsOpen(false);
    setEditingId(null);
    setForm({
      serverName: "",
      serverURL: "",
      serverType: "",
      serverEnvironment: ""
    });
  };

  const [servers, setIServers] = useState([]);
  const [form, setForm] = useState({ serverName: "", serverURL: "", serverType: "", serverEnvironment: "" });

  // ------------------------------
  const [statuses, setStatuses] = useState({});
  const [lastRefresh, setLastRefresh] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/servers").then(res => setIServers(res.data));
  }, []);

  // Function to check one website
  // Parameter url=urlServer name=serverId
  const checkWebsite = (url, serverIdStats) => {
    fetch(`http://localhost:5000/ping?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then((data) => {
        setStatuses((prev) => ({
          ...prev,
          [serverIdStats]: {
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

  // ------------------------------

  const saveItem = () => {
    if (!form.serverName || !form.serverURL || !form.serverType || !form.serverEnvironment) {
      alert("All fields are required!");
      return;
    }

    if(editingId){
      axios.put(`http://localhost:5000/servers/${editingId}`, form).then(() => {
        setForm({ serverName: "", serverURL: "", serverType: "", serverEnvironment: "" });
        setEditingId(null);
        axios.get("http://localhost:5000/servers").then(res => setIServers(res.data));
      });
    } else {
      axios.post("http://localhost:5000/servers", form).then(() => {
        setForm({ serverName: "", serverURL: "", serverType: "", serverEnvironment: "" });
        axios.get("http://localhost:5000/servers").then(res => setIServers(res.data));
      });
    }
  }

  // Delete item
  const deleteItem = (serverId) => {
    axios.delete(`http://localhost:5000/servers/${serverId}`).then(() => {
      axios.get("http://localhost:5000/servers").then(res => setIServers(res.data));
    });
  };

  return (
    <div className='containerASD'>
      <div className="logoContainer">
        <img src={clientLogo} alt="Client Logo" className='imgStyle' />
      </div>
      
      <div className='timePosition'>
        <div className="mainDivForTimeSpenner">
          <div className="timeTextContainer">
            <p className="lastRegreshStyle">Last Regreshed: </p> 
          </div>
          <p style={{ color:"black", marginLeft: 4, fontSize: 10, fontWeight: "bold"  }}>{lastRefresh}</p>
        </div>
        <div className='spinContainer'>
          <ImLoop2 className="animate-spin-slow" size={12}/>
        </div>
      </div>

      <button
        onClick={openModal}
        className='modalButton'
      >
        Server        
      </button>

      {/* ============================ Modal ============================ */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center", 
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
              minWidth: "280px",
              height: "460px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
              animation: "slideDown 0.3s ease-out"
            }}
          >
            
            <div className='containerHeader'>
              <div className='formContainerHeader'>
                <FiServer size={24} />
                <p className='formTItle'>{editingId ? "Update Server" : "New Server"}</p>
              </div>
              <p className='formDetails'>Add a server you want to track. You can edit this later.</p>
            </div>
            
            <form>
              <InputServer 
                label="Server Name"
                iconType={true}
                type="text"
                placeholder="e.g., Production API"
                value={form.serverName}
                inputDetails="Server name is required."
                onChange={(e) => setForm({ ...form, serverName: e.target.value })} />
              
              <InputServer 
                label="Server URL"
                iconType={false}
                type="url"
                placeholder="https://api.example.com"
                value={form.serverURL}
                inputDetails="Must be a reachable https(s) URL (no trailing spaces)."
                onChange={(e) => setForm({ ...form, serverURL: e.target.value })} />

              <div className='dropDownContainer'>
                <DropDownServer
                  label="Type"
                  name="serverType"
                  type={true}
                  value={form.serverType}
                  onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                  placeholder="Choose Type"
                  options={[
                    { value: "production", label: "Production" },
                    { value: "non-production", label: "Non-Production" },
                  ]}
                />

                <DropDownServer
                  label="Environment"
                  name="serverEnvironment"
                  type={false}
                  value={form.serverEnvironment}
                  onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                  placeholder="Choose Environment"
                  options={[
                    { value: "application", label: "Application" },
                    { value: "database", label: "Database" },
                  ]}
                />
              </div>
              
              <div style={{ textAlign: "right", borderTop: "1px solid gray", marginTop: "38px", paddingTop: "14px"  }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    padding: "8px 15px",
                    marginRight: "10px",
                    backgroundColor: "#ccc",
                    border: "none",
                    borderRadius: "5px",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveItem}
                  style={{
                    padding: "8px 15px",
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                  }}
                >
                  {editingId ? "Update Item" : "Save Item"}
                </button>
              </div>
            </form>
          </div>
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              minWidth: "480px",
              height: "460px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
              animation: "slideDown 0.3s ease-out",
              marginLeft: "14px"
            }}
          >
            <div className='containerHeader'>
              <div className='formContainerHeader'>
                <FiServer size={24} />
                <p className='formTItle'>List of Servers</p>
              </div>
              <p className='formDetails'>You can update or delete your server.</p>
            </div>

            
              <div className='serverContainerList'>
                <h5>Server Name</h5>
                <h5>Server URL</h5>
                <h5>Server Type</h5>
                <h5>Server Environment</h5>
                <h5>ACTIONS</h5>
              </div>

              <div className='mainServerListContainer'>
                <div>
                  {servers.map((servers) => (
                    <div className='ItemContainerList' key={servers.serverId}>
                      <p className='itemStyle'>{servers.serverName}</p>
                      <p className='itemStyle'>{servers.serverURL}</p>
                      <p className='itemStyle'>{servers.serverType}</p>
                      <p className='itemStyle'>{servers.serverEnvironment}</p>
                      <div className='itemStyle'>
                        <div style={{ flexDirection: 'row', display: 'flex'}}> 
                          <div style={{ cursor: 'pointer', marginRight: 28 }} 
                            onClick={() => {
                              setForm({
                                serverName: servers.serverName,
                                serverURL: servers.serverURL,
                                serverType: servers.serverType,
                                serverEnvironment: servers.serverEnvironment
                              }); 
                              setEditingId(servers.serverId)}}><TbEdit size={18} /></div>
                          <div style={{ cursor: 'pointer' }} onClick={() => deleteItem(servers.serverId)}><RiDeleteBin5Line size={18} /></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
          </div>
        </div>
      )}
      {/* ============================ Modal ============================ */}

      {/* Server List */}
      <div className="serverContainer">
        <div className="server">
          <h3>Non Production</h3>
          <div className="serverTypes">
            <div className="app">
              <h4>Application</h4>
              {servers
                .filter(server => server.serverType === "non-production" && server.serverEnvironment === "application")
                .map((servers) => (
                  <ServerLink serverName={servers.serverName} key={servers.serverId} serverHref={servers.serverURL} serverStatus={statuses[servers.serverId]?.isOnline}/>
              ))}
            </div>
          </div>
        </div>

        <div className="server">
          <h3>Production</h3>
          <div className="serverTypes">
            <div className="app">
              <h4>Application</h4>
              {servers
                .filter(server => server.serverType === "production" && server.serverEnvironment === "application")
                .map((servers) => (
                  <ServerLink serverName={servers.serverName} key={servers.serverId} serverHref={servers.serverURL}  serverStatus={statuses[servers.serverId]?.isOnline} />
              ))}
            </div>
            <div className="data">
              <h4>Database</h4>
              {servers
                .filter(server => server.serverType === "production" && server.serverEnvironment === "database")
                .map((servers) => (
                  <ServerLink serverName={servers.serverName} key={servers.serverId} serverHref={servers.serverURL}  serverStatus={statuses[servers.serverId]?.isOnline} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
