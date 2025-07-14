const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const statusFile = path.join(__dirname, '../data/deliveryStatus.json');

router.get('/status', (req, res) => {
    const status = JSON.parse(fs.readFileSync(statusFile));
    res.json(status);
});

router.post('/control', (req, res) => {
    const { action } = req.body;
    let statusData = JSON.parse(fs.readFileSync(statusFile));

    if (action === 'start') {
        statusData.status = 'Active';
    } else if (action === 'stop') {
        statusData.status = 'Down';
    } else if (action === 'reset') {
        statusData.status = 'Resetting...';
        setTimeout(() => {
            statusData.status = 'Active';
            fs.writeFileSync(statusFile, JSON.stringify(statusData));
        }, 3000);
    } else {
        return res.status(400).json({ error: "Invalid action" });
    }

    fs.writeFileSync(statusFile, JSON.stringify(statusData));
    res.json({ message: `Delivery Agent is now ${statusData.status}` });
});

module.exports = router;
