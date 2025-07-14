const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/users.json');

// Ensure file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
}

// POST /MindCare/login for both signup and login
router.post('/', (req, res) => {
  const { name, username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: 'Username and password required.' });
  }

  const users = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

  // Signup
  if (name) {
    const existing = users.find(u => u.username === username);
    if (existing) {
      return res.status(409).json({ msg: 'Username already exists.' });
    }
    users.push({ name, username, password });
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8');
    return res.status(201).json({ msg: 'User created.' });
  }

  // Login
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ msg: 'Invalid credentials.' });
  }

  return res.status(200).json({ msg: 'Login successful.' });
});

module.exports = router;
