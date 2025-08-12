// server.js (password protected, immediate refresh)
const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

const PASSWORD = process.env.DASHBOARD_PASSWORD || '000000';
const PORT = process.env.PORT || 8080;

const app = express();

// Basic Auth middleware
app.use((req, res, next) => {
  const h = req.headers['authorization'] || '';
  if (h.startsWith('Basic ')) {
    const decoded = Buffer.from(h.slice(6), 'base64').toString('utf8');
    const parts = decoded.split(':');
    const pass = parts.slice(1).join(':'); // allow any username
    if (pass === PASSWORD) return next();
  }
  res.setHeader('WWW-Authenticate', 'Basic realm=\"Protected\"');
  return res.status(401).send('Authentication required.');
});

app.use(express.static(path.join(__dirname, 'public'), { etag: false, cacheControl: false }));

app.get('/api/refresh', (req, res) => {
  const child = spawn(process.execPath, [path.join(__dirname, 'fetcher.js')], { stdio: 'inherit' });
  child.on('close', (code) => console.log('Manual refresh finished with code', code));
  res.json({ ok: true, started: true, at: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log('Dashboard on http://localhost:' + PORT);
  console.log('Use any username and password = ' + PASSWORD);
});

// Hourly auto-refresh
setInterval(() => {
  console.log('Auto refresh started at', new Date().toISOString());
  const child = spawn(process.execPath, [path.join(__dirname, 'fetcher.js')], { stdio: 'inherit' });
  child.on('close', (code) => console.log('Auto refresh finished with code', code));
}, 60 * 60 * 1000);
