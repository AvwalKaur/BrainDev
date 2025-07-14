const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const systemRoutes = require('./routes/system');
const loginRoutes = require('./routes/login');
app.use('/MindCare/login', loginRoutes);  // ✅ NEW

// Use routes
app.use('/system', systemRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
