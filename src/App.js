import ServerLink from './ServerLink';
import clientLogo from './assets/ey.png';
import { useState, useEffect } from "react";
import axios from "axios";
import InputServer from './InputServer';
import { FiServer } from "react-icons/fi";
import DropDownServer from './DropDownServer';
import { AiOutlineReload } from "react-icons/ai";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const [servers, setIServers] = useState([]);
  const [form, setForm] = useState({ serverName: "", serverURL: "" });



  // Load data
  useEffect(() => {
    axios.get("http://localhost:5000/servers").then(res => setIServers(res.data));
  }, []);

  // Add new item
  const addItem = () => {
    axios.post("http://localhost:5000/servers", form).then(() => {
      setForm({ serverName: "", serverURL: "" });
      axios.get("http://localhost:5000/servers").then(res => setIServers(res.data));
    });
  };

  return (
    <div className='containerASD'>
      <div className="logoContainer">
        <img src={clientLogo} alt="Client Logo" className='imgStyle' />
      </div>
      
      <div className='timePosition'>
        <AiOutlineReload className="w-6 h-6 animate-spin-slow" />
        <ServerLink timeCheck={false} />
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
              minWidth: "300px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
              animation: "slideDown 0.3s ease-out",
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
                  name="type"
                  type={true}
                  value={form.type}
                  onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                  placeholder="Choose Type"
                  options={[
                    { value: "production", label: "Production" },
                    { value: "non-production", label: "Non-Production" },
                  ]}
                />

                <DropDownServer
                  label="Environment"
                  name="environment"
                  type={false}
                  value={form.environment}
                  onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                  placeholder="Choose Environment"
                  options={[
                    { value: "application", label: "Application" },
                    { value: "database", label: "Database" },
                  ]}
                />
              </div>
              
              <p>---TEST---</p>
              <ul>
                {servers.map((servers) => (
                  <li key={servers.id}>
                    {servers.serverName} - {servers.serverUrl}
                  </li>
                ))}
              </ul>

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
              <ServerLink serverId="youtube" serverName="Youtube" timeCheck={true} />
              <ServerLink serverId="githubss" serverName="Github {Error}" timeCheck={true}/>
              <ServerLink serverId="github" serverName="Github" timeCheck={true}/>
              <ServerLink serverId="node" serverName="Node Js" timeCheck={true}/>
              <ServerLink serverId="laravel" serverName="Laravel" timeCheck={true}/>
            </div>
          </div>
        </div>

        <div className="server">
          <h3>Production</h3>
          <div className="serverTypes">
            <div className="app">
              <h4>Application</h4>
              <ServerLink serverId="w3school" serverName="W3School" timeCheck={true}/>
              <ServerLink serverId="shopee" serverName="Shopee" timeCheck={true}/>
            </div>
            <div className="data">
              <h4>Database</h4>
              <ServerLink serverId="lazada" serverName="Lazada" timeCheck={true}/>
              <ServerLink serverId="bpi" serverName="BPI" timeCheck={true}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
