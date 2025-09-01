const express = require('express');
const axios = require('axios');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors()); // Allow React dev server to access API
app.use(express.json());


// =========================== API SECTION ===========================
// API endpoint to check website status
app.get('/ping', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: 'Missing URL' });
  }

  try {
    const response = await axios.get(url, { timeout: 5000 });
    res.json({ status: 'up', code: response.status });
  } catch (err) {
    res.json({ status: 'down', code: err.code || 0 });
  }
});

// =========================== DATABASE SECTION END ===========================
// Connect to SQLite DB
const db = new Database('mydb.sqlite');

// Create table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS servers (
    serverId INTEGER PRIMARY KEY AUTOINCREMENT,
    serverName TEXT NOT NULL,
    serverURL TEXT NOT NULL,
    serverType TEXT NOT NULL,
    serverEnvironment TEXT NOT NULL
  )
`).run();

// READ - Get all Server
app.get('/servers', (req, res) => {
  const rows = db.prepare('SELECT * FROM servers').all();
  res.json(rows);
});

// CREATE - Add new Server
app.post('/servers', (req, res) => {
  const { serverName, serverURL, serverType, serverEnvironment } = req.body;
  const stmt = db.prepare('INSERT INTO servers (serverName, serverURL, serverType, serverEnvironment) VALUES (?, ?, ?, ?)');
  stmt.run(serverName, serverURL, serverType, serverEnvironment);
  res.json({ status: 'Server added' });
});

// UPDATE - Edit Server
app.put('/servers/:serverId', (req, res) => {
  const { serverName, serverURL, serverType, serverEnvironment } = req.body;
  const { serverId } = req.params;
  const stmt = db.prepare('UPDATE servers SET serverName = ?, serverURL = ?, serverType = ?, serverEnvironment = ? WHERE serverId = ?');
  stmt.run(serverName, serverURL, serverType, serverEnvironment, serverId);
  res.json({ status: 'Server updated' });
});

// DELETE - Remove Server
app.delete('/servers/:serverId', (req, res) => {
  const { serverId } = req.params;
  const stmt = db.prepare('DELETE FROM servers WHERE serverId = ?');
  stmt.run(serverId);
  res.json({ status: 'Server deleted' });
});

// =========================== FRONTEND (React build) ===========================

// Serve static files from React build folder
app.use(express.static(path.join(__dirname, "build")));

// Catch-all route -> must be LAST
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});


// =========================== START SERVER ===========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';