import ServerLink from './ServerLink';

function App() {
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
              <ServerLink serverId="youtube" serverName="Youtube" />
              <ServerLink serverId="githubss" serverName="Github" />
            </div>

            
          </div>
        </div>

        <div className="server">
          <h3>Production</h3>
          <div className="serverTypes">
            <div className="app">
              <h4>Application</h4>
            </div>
            <div className="data">
              <h4>Database</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
