const express = require('express');
const router = express.Router();

// Add global variable to track crisis start time
let crisisStartTime = null;

router.post('/', (req, res) => {
    const { crisis } = req.body;

    if (typeof crisis !== 'boolean') {
        return res.status(400).json({
            error: 'Invalid request',
            message: 'Crisis parameter must be boolean'
        });
    }

    // Update global crisis state
    req.crisisMode = crisis;

    // Track crisis duration
    if (crisis) {
        crisisStartTime = new Date();
    } else {
        crisisStartTime = null;
    }

    // Update agent statuses based on crisis state
    if (crisis) {
        // During crisis, degrade services more dramatically
        req.agentStatus.delivery = Math.random() > 0.3 ? 'Degraded' : 'Critical';
        req.agentStatus.inventory = Math.random() > 0.3 ? 'Degraded' : 'Critical';
        req.agentStatus.supply = Math.random() > 0.5 ? 'Down' : 'Critical';
    } else {
        // When crisis ends, restore services
        req.agentStatus.delivery = 'Active';
        req.agentStatus.inventory = 'Active';
        req.agentStatus.supply = 'Active'; // Or keep as 'Down' if you prefer
    }

    // Enhanced response with more crisis details
    res.json({
        success: true,
        message: `Crisis mode ${crisis ? 'activated' : 'deactivated'}`,
        crisisMode: crisis,
        timestamp: new Date().toISOString(),
        duration: crisis ? "Ongoing" : calculateCrisisDuration(),
        agentStatuses: req.agentStatus,
        actionsTaken: crisis ? [
            'Alerted all regional managers',
            'Activated emergency supply channels',
            'Prioritized essential deliveries',
            'Suspended non-critical operations'
        ] : [
            'Restoring standard operating procedures',
            'Verifying system integrity',
            'Reconnecting with suppliers',
            'Generating incident report'
        ],
        nextSteps: crisis ? [
            'Monitor supply chain disruptions',
            'Prepare contingency inventory',
            'Update customer ETAs'
        ] : [
            'Review crisis response metrics',
            'Identify improvement areas',
            'Schedule post-mortem meeting'
        ]
    });
});

router.get('/status', (req, res) => {
    res.json({
        crisisMode: req.crisisMode,
        since: crisisStartTime || "Not active",
        duration: req.crisisMode ? calculateCrisisDuration() : "N/A",
        affectedAgents: Object.entries(req.agentStatus)
            .filter(([_, status]) => status !== 'Active')
            .map(([agent, status]) => ({ agent, status })),
        systemImpact: req.crisisMode ? "High - Emergency protocols active" : "Normal"
    });
});

// Helper function to calculate crisis duration
function calculateCrisisDuration() {
    if (!crisisStartTime) return "N/A";
    const seconds = Math.floor((new Date() - crisisStartTime) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    return `${hours > 0 ? hours + 'h ' : ''}${minutes % 60}m ${seconds % 60}s`;
}

module.exports = router;