import ServerLink from './ServerLink';
import clientLogo from './assets/ey.png';
import { useState, useEffect } from "react";
import axios from "axios";
import InputServer from './InputServer';
import { FiServer } from "react-icons/fi";
import DropDownServer from './DropDownServer';
import { ImLoop2 } from "react-icons/im";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const [servers, setIServers] = useState([]);
  const [form, setForm] = useState({ serverName: "", serverURL: "", serverType: "", serverEnvironment: "" });



  // Load data
  useEffect(() => {
    axios.get("http://localhost:5000/servers").then(res => setIServers(res.data));
  }, []);

  // Add new item
  const addItem = () => {
    axios.post("http://localhost:5000/servers", form).then(() => {
      setForm({ serverName: "", serverURL: "", serverType: "", serverEnvironment: "" });
      axios.get("http://localhost:5000/servers").then(res => setIServers(res.data));
    });
  };

  return (
    <div className='containerASD'>
      <div className="logoContainer">
        <img src={clientLogo} alt="Client Logo" className='imgStyle' />
      </div>
      
      <div className='timePosition'>
        <ServerLink timeCheck={false} />
        <div className='spinContainer'>
          <ImLoop2 className="animate-spin-slow" size={12}/>
        </div>
      </div>

      <button
        onClick={openModal}
        className='modalButton'
      >
        Add Server
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
                <p className='formTItle'>New Server</p>
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
                  onClick={addItem}
                  style={{
                    padding: "8px 15px",
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                  }}
                >
                  Save
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
                      <p className='itemStyle'>EDIT | DELETE</p>
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
                  <ServerLink serverId={servers.serverId} serverName={servers.serverName} timeCheck={true} key={servers.serverId} />
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
                  <ServerLink serverId={servers.serverId} serverName={servers.serverName} timeCheck={true}  key={servers.serverId} />
              ))}
              <ServerLink serverId="ETOY" serverName="Ekang" timeCheck={true} />
            </div>
            <div className="data">
              <h4>Database</h4>
              {servers
                .filter(server => server.serverType === "production" && server.serverEnvironment === "database")
                .map((servers) => (
                  <ServerLink serverId={servers.serverId} serverName={servers.serverName} timeCheck={true}  key={servers.serverId} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
