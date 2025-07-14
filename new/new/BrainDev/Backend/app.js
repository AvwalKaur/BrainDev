const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Global state for crisis management
let globalCrisis = false;
const agentStatus = {
    delivery: 'Active',
    inventory: 'Active',
    supply: 'Down'
};

// Middleware to handle crisis state
app.use((req, res, next) => {
    req.crisisMode = globalCrisis;
    req.agentStatus = agentStatus;
    next();
});

// Routes import
const deliveryRoute = require('./routes/deliveryAgent.js');
const inventoryRoute = require('./routes/inventoryAgent.js');
const supplyRoute = require('./routes/supplyAgent.js');
const crisisRoute = require('./routes/crisisRoute.js'); // New crisis route

app.use('/agent/delivery', deliveryRoute);
app.use('/agent/inventory', inventoryRoute);
app.use('/agent/supply', supplyRoute); // Fixed typo from 'supply' to 'supply'
app.use('/crisis', crisisRoute); // New crisis endpoint

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        message: "Backend server is running!",
        status: "OK",
        crisisMode: globalCrisis,
        agents: agentStatus
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        crisisImpact: globalCrisis ? 'Service may be degraded' : 'Normal operations'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Available routes:');
    console.log(`- GET / (health check)`);
    console.log(`- GET /agent/delivery/status`);
    console.log(`- POST /agent/delivery/control`);
    console.log(`- GET /agent/inventory/status`);
    console.log(`- POST /agent/inventory/control`);
    console.log(`- GET /agent/supply/status`);
    console.log(`- POST /agent/supply/control`);
    console.log(`- POST /crisis (trigger/resolve crisis)`);
});