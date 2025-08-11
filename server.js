const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors()); // Allow React dev server to access API

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});