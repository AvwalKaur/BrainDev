function popupDisplay(content) {
    const overlay = document.createElement("div");
    overlay.id = "popup-overlay";

    const popup = document.createElement("div")
    popup.id = "popup-content"
    popup.innerHTML = `
        <button id="close-popup-btn">&times;</button>
        <br>
        ${content}
        `

    overlay.appendChild(popup)
    document.body.appendChild(overlay)

    document.body.classList.add("blur-active")

    // close the popup
    document.querySelector("#close-popup-btn").addEventListener('click', () => {
        document.body.classList.remove("blur-active")
        document.body.removeChild(overlay)
    })
}

// Function to fetch agent status and update badge color/text
function fetchAgentStatus(agentType, badgeId) {
    fetch(`http://localhost:5000/agent/${agentType}/status`)
        .then(res => res.json())
        .then(data => {
            const btn = document.getElementById(badgeId);
            btn.textContent = data.status;
            if (data.status === "Active") {
                btn.style.backgroundColor = "#5cb85c"; // Green
            } else if (data.status === "Down") {
                btn.style.backgroundColor = "#d9534f"; // Red
            } else {
                btn.style.backgroundColor = "#f0ad4e"; // Yellow
            }
        })
        .catch(err => console.error("Error fetching status:", err));
}

// Function to control agent (start/stop/reset) and refresh status
// MODIFY controlAgent() function
function controlAgent(agentType, action, badgeId) {
    if (crisisActive && action === "stop") {
        console.log(`Action: ${action}, Crisis: ${crisisActive}`);
        popupDisplay(`
            <div style="color:#d9534f; text-align:center; padding:20px;">
                <h2><i class="fa-solid fa-triangle-exclamation"></i> EMERGENCY LOCK</h2>
                <p>Cannot stop ${agentType} agent during crisis!</p>
                <p>Please resolve the crisis first.</p>
                <button onclick="document.querySelector('#close-popup-btn').click()" 
                        style="margin-top:15px; padding:8px 15px; background:#d9534f; color:white; border:none; border-radius:4px;">
                    Understood
                </button>
            </div>
        `);
        return; // Exit function without API call
    }

    // Proceed with normal operation
    fetch(`http://localhost:5000/agent/${agentType}/control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: action })
    })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                popupDisplay(`<div style="color:#d9534f">${data.error}</div>`);
            } else {
                fetchAgentStatus(agentType, badgeId);
            }
        })
        .catch(err => {
            popupDisplay(`<div style="color:#d9534f">Network error: ${err.message}</div>`);
        });
}
// Maintain uptime and last actions for each agent
const agentStates = {
    delivery: {
        uptimeSeconds: 0,
        actions: [
            "11:04 AM – Sent ETA updates to 5 customers.",
            "10:52 AM – Rerouted 3 trucks to alternate paths.",
            "10:30 AM – Checked weather forecast for Northeast routes."
        ]
    },
    inventory: {
        uptimeSeconds: 0,
        actions: [
            "11:10 AM – Flagged low stock for SKU #98423.",
            "10:50 AM – Transferred 200 units from Warehouse A to B.",
            "10:25 AM – Updated reorder point for seasonal items."
        ]
    },
    supply: {
        uptimeSeconds: 0,
        actions: [
            "9:52 AM – Attempted to update shipment ETA from Supplier S-143.",
            "9:30 AM – Checked fuel surcharge impact on logistics costs.",
            "9:15 AM – Monitored supplier delays in Zone 4."
        ]
    }
};

// Increment uptime every second
setInterval(() => {
    agentStates.delivery.uptimeSeconds++;
    agentStates.inventory.uptimeSeconds++;
    agentStates.supply.uptimeSeconds++;
}, 1000);

// Simulate new actions every 20 seconds
setInterval(() => {
    const now = new Date().toLocaleTimeString();
    ["delivery", "inventory", "supply"].forEach(agent => {
        const action = crisisActive ?
            `${now} – Crisis: Emergency handling by ${agent}.` :
            `${now} – Routine update from ${agent}.`;
        agentStates[agent].actions.unshift(action);
        if (agentStates[agent].actions.length > 3) {
            agentStates[agent].actions.pop();
        }
    });
}, 20000);



window.addEventListener("DOMContentLoaded", () => {
    // Animated text functionality
    const messages = [
        "Monitoring supply chain operations...",
        "Optimizing delivery routes...",
        "Balancing inventory levels...",
        "All systems operational"
    ];
    let messageIndex = 0;
    const typingText = document.querySelector('.typing-text');
    const cursor = document.querySelector('.cursor');

    function typeWriter(text, i, callback) {
        if (i < text.length) {
            typingText.textContent += text.charAt(i);
            setTimeout(() => typeWriter(text, i + 1, callback), 100);
        } else if (callback) {
            setTimeout(callback, 1500);
        }
    }

    function eraseText(callback) {
        const text = typingText.textContent;
        if (text.length > 0) {
            typingText.textContent = text.substring(0, text.length - 1);
            setTimeout(() => eraseText(callback), 50);
        } else if (callback) {
            callback();
        }
    }

    function textAnimationLoop() {
        typeWriter(messages[messageIndex], 0, () => {
            eraseText(() => {
                messageIndex = (messageIndex + 1) % messages.length;
                textAnimationLoop();
            });
        });
    }

    textAnimationLoop();

    // Search functionality
    // Replace the existing search event listener with this:
    document.getElementById('search-agent').addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase().trim();
        const agents = {
            'delivery': document.getElementById('delivery-agent'),
            'inventory': document.getElementById('inventory-agent'),
            'supply': document.getElementById('supply-chain-agent')
        };

        // Show all if empty
        if (!searchTerm) {
            Object.values(agents).forEach(agent => {
                agent.style.display = 'flex';
            });
            return;
        }

        // Filter agents
        Object.entries(agents).forEach(([key, agent]) => {
            const shouldShow = key.includes(searchTerm) ||
                agent.querySelector('h3').textContent.toLowerCase().includes(searchTerm);
            agent.style.display = shouldShow ? 'flex' : 'none';
        });
    });
    const deliveryAgent = document.getElementById("delivery-agent")

    // create an overlay, add content to it, make the background as blur
    deliveryAgent.addEventListener('click', (e) => {
        if (e.target.tagName.toLowerCase() === 'button') {
            // Do nothing if a button was clicked
            return;
        }
        const uptimeMins = Math.floor(agentStates.delivery.uptimeSeconds / 60);
        const uptimeSecs = agentStates.delivery.uptimeSeconds % 60;
        const uptimeText = `${uptimeMins} min ${uptimeSecs} sec`;

        const lastActionsHTML = agentStates.delivery.actions.map(act => `<li>${act}</li>`).join('');

        popupDisplay(`
            <div class="deliveryAgentContent">
            <h2 style="text-align:center; padding:2rem;">DELIVERY AGENT <i class="fa-solid fa-truck" style="color: #00a82a;"></i></h2>
            <div class="desc">
                <h3>Description: </h3>
                <p>Optimizes last-mile delivery routes across all service regions.</p>
            </div>
            <br>
            <div class="currStatus">
                <h3>Current Status: </h3>
                <p>✅ Active</p>
            </div>
            <br>
            <div class="currTask">
                <h3>Current Task: </h3>
                <p>“Rerouting 3 trucks in Northeast due to weather disruption.”</p>
            </div>
            <br>
            <div class="uptime">
                <h3>Uptime: </h3>
                <p>${uptimeText}</p>
            </div>
            <br>
            <div class="lastActions">
                <h3>Last 3 Actions</h3>
                <p><ul>${lastActionsHTML}</ul></p>
            </div>
            <br>
            <div class="crisisRoles">
                <h3>Crisis Role: </h3>
                <p>Prioritizes emergency deliveries and reroutes trucks away from high-risk zones.</p>
            </div>
        </div>
            `)
    })

    const inventoryAgent = document.getElementById("inventory-agent")
    inventoryAgent.addEventListener('click', (e) => {
        if (e.target.tagName.toLowerCase() === 'button') {
            // Do nothing if a button was clicked
            return;
        }
        const uptimeMins = Math.floor(agentStates.inventory.uptimeSeconds / 60);
        const uptimeSecs = agentStates.inventory.uptimeSeconds % 60;
        const uptimeText = `${uptimeMins} min ${uptimeSecs} sec`;
        const lastActionsHTML = agentStates.inventory.actions.map(act => `<li>${act}</li>`).join('');
        popupDisplay(`
            <div class="inventoryAgent">
            <h2 style="text-align:center; padding:2rem;">INVENTORY AGENT <i class="fa-sharp fa-solid fa-warehouse" style="color: #74C0FC;"></i></h2>
            <div class="desc">
                <h3>Description: </h3>
                <p>Balances stock levels across warehouses and stores dynamically.</p>
            </div>
            <br>
            <div class="currStatus">
                <h3>Current Status: </h3>
                <p>✅ Active</p>
            </div>
            <br>
            <div class="currTask">
                <h3>Current Task: </h3>
                <p>“Monitoring stock for high-demand SKUs in Zone 3.”</p>
            </div>
            <br>
            <div class="uptime">
                <h3>Uptime: </h3>
                <p>${uptimeText}</p>
            </div>
            <br>
            <div class="lastActions">
                <h3>Last 3 Actions</h3>
                <p><ul>${lastActionsHTML}</ul></p>
            </div>
            <br>
            <div class="crisisRoles">
                <h3>Crisis Role: </h3>
                <p>Rebalances stock proactively to prevent outages during supply disruptions.</p>
            </div>
        </div>
            `)
    })

    const supplyAgent = document.getElementById("supply-chain-agent")
    supplyAgent.addEventListener('click', (e) => {
        if (e.target.tagName.toLowerCase() === 'button') {
            // Do nothing if a button was clicked
            return;
        }
        const uptimeMins = Math.floor(agentStates.supply.uptimeSeconds / 60);
        const uptimeSecs = agentStates.supply.uptimeSeconds % 60;
        const uptimeText = `${uptimeMins} min ${uptimeSecs} sec`;
        const lastActionsHTML = agentStates.supply.actions.map(act => `<li>${act}</li>`).join('');
        popupDisplay(`
            <div class="supplyChainAgent">
            <h2 style="text-align:center; padding:2rem;">SUPPLY CHAIN AGENT <i class="fa-solid fa-dolly" style="color: #FFD43B;"></i></h2>
            <div class="desc">
                <h3>Description: </h3>
                <p>Coordinates supplier schedules, shipments, and logistic pathways.</p>
            </div>
            <br>
            <div class="currStatus">
                <h3>Current Status: </h3>
                <p>❌ Down</p>
            </div>
            <br>
            <div class="currTask">
                <h3>Current Task: </h3>
                <p> “No active tasks. Agent is currently down.”</p>
            </div>
            <br>
            <div class="uptime">
                <h3>Uptime: </h3>
                <p>${uptimeText}</p>
            </div>
            <br>
            <div class="lastActions">
                <h3>Last 3 Actions (Before Going Down)</h3>
                <p><ul>${lastActionsHTML}</ul></p>
            </div>
            <br>
            <div class="reasonForDowntime">
                <h3>Reason for Downtime: </h3>
                <p>“Lost connectivity with supplier APIs at 10:02 AM.”</p>
            </div>
            <br>
            <div class="actionReq">
                <h3>Action Required: </h3>
                <p>✅ Please RESET or START the agent to resume supply chain monitoring.</p>
            </div>
        </div>
            `)
    })

    // Fetch initial status on page load for all agents
    fetchAgentStatus('delivery', 'delBtn');
    fetchAgentStatus('inventory', 'invBtn');
    fetchAgentStatus('supply', 'supplyBtn');

    // Delivery Agent Buttons
    document.getElementById('start-btn-delivery').addEventListener('click', () => {
        controlAgent('delivery', 'start', 'delBtn');
    });
    document.getElementById('stop-btn-delivery').addEventListener('click', () => {
        controlAgent('delivery', 'stop', 'delBtn');
    });
    document.getElementById('reset-btn-delivery').addEventListener('click', () => {
        controlAgent('delivery', 'reset', 'delBtn');
    });

    // Inventory Agent Buttons
    document.getElementById('start-btn-inventory').addEventListener('click', () => {
        controlAgent('inventory', 'start', 'invBtn');
    });
    document.getElementById('stop-btn-inventory').addEventListener('click', () => {
        controlAgent('inventory', 'stop', 'invBtn');
    });
    document.getElementById('reset-btn-inventory').addEventListener('click', () => {
        controlAgent('inventory', 'reset', 'invBtn');
    });

    // Supply Chain Agent Buttons
    document.getElementById('start-btn-supply').addEventListener('click', () => {
        controlAgent('supply', 'start', 'supplyBtn');
    });
    document.getElementById('stop-btn-supply').addEventListener('click', () => {
        controlAgent('supply', 'stop', 'supplyBtn');
    });
    document.getElementById('reset-btn-supply').addEventListener('click', () => {
        controlAgent('supply', 'reset', 'supplyBtn');
    });
    // Map
    // MAP INITIALIZATION
    const map = L.map('map').setView([28.6139, 77.2090], 11); // Center on Delhi

    // ADD TILE LAYER
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © OpenStreetMap contributors'
    }).addTo(map);

    // FUNCTION TO CREATE FONT AWESOME ICONS
    function createFAIcon(html, color) {
        return L.divIcon({
            html: `<i class="${html}" style="color:${color}; font-size: 16px;"></i>`,
            iconSize: [10, 10],
            className: 'fa-icon-marker'
        });
    }

    function getRandomCoords() {
        const baseLat = 28.6139; // Delhi
        const baseLng = 77.2090;
        const latOffset = (Math.random() - 0.5) * 0.2;  // +/- 0.1
        const lngOffset = (Math.random() - 0.5) * 0.2;  // +/- 0.1
        return [baseLat + latOffset, baseLng + lngOffset];
    }

    const trucks = Array.from({ length: 8 }, (_, i) => {
        const [lat, lng] = getRandomCoords();
        return {
            lat,
            lng,
            id: `Truck #${i + 1}`
        };
    });

    // REALISTIC WAREHOUSE LOCATIONS
    const warehouses = [
        { lat: 28.695785, lng: 76.933921, id: "Warehouse #1" }, // Kapasheda
        { lat: 28.592199, lng: 77.110522, id: "Warehouse #2" }, // Delhi Cantonment
        { lat: 28.562516, lng: 77.370218, id: "Warehouse #3" },  // Sector 49 Noida
        { lat: 28.563564, lng: 77.240115, id: "Warehouse #4" },  // Lajpat Nagar, Vikram Vihar
        { lat: 28.555627, lng: 77.099922, id: "Warehouse #5" },  // Near IGI Airport
        { lat: 28.647140, lng: 77.384706, id: "Warehouse #6" },  // IndiraPuram
        { lat: 28.665498, lng: 77.232008, id: "Warehouse #7" }// Old Delhi
    ];


    // Add this at the top with other variable declarations
    let crisisActive = false;

    // Add these missing functions
    function updateCrisisUI(data) {
        const statusColor = {
            'Active': '#5cb85c',
            'Degraded': '#f0ad4e',
            'Critical': '#ff6b6b',
            'Down': '#d9534f'
        };

        popupDisplay(`
        <div class="crisis-overlay">
            <h2 style="color:#d9534f;text-align:center;border-bottom:2px solid #d9534f;padding-bottom:10px;">
                <i class="fa-solid fa-triangle-exclamation"></i> CRISIS DASHBOARD
            </h2>
            
            <div class="crisis-header">
                <div class="crisis-alert">
                    <span class="blinking-alert">🚨 LIVE CRISIS MODE</span>
                    <span>Started: ${new Date().toLocaleTimeString()}</span>
                </div>
                <div class="crisis-stats">
                    <div><i class="fa-solid fa-clock"></i> Duration: ${data.duration}</div>
                    <div><i class="fa-solid fa-gauge-high"></i> Impact Level: High</div>
                </div>
            </div>
            
            <div class="agent-status-grid">
                ${Object.entries(data.agentStatuses).map(([agent, status]) => `
                    <div class="agent-status-card" style="border-left:4px solid ${statusColor[status]}">
                        <h3>${agent.toUpperCase()} AGENT</h3>
                        <div class="status-badge" style="background:${statusColor[status]}">
                            ${status}
                        </div>
                        <div class="agent-metrics">
                            <div><i class="fa-solid fa-truck"></i> ${agent === 'delivery' ? '5 Delays' : ''}</div>
                            <div><i class="fa-solid fa-warehouse"></i> ${agent === 'inventory' ? '3 Low Stocks' : ''}</div>
                            <div><i class="fa-solid fa-bolt"></i> ${status === 'Critical' ? 'NEEDS ATTENTION' : ''}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="timeline-section">
                <h3><i class="fa-solid fa-list-check"></i> CRISIS TIMELINE</h3>
                <div class="timeline">
                    ${data.actionsTaken.map((action, i) => `
                        <div class="timeline-item">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <span class="time">${new Date().toLocaleTimeString()}</span>
                                <p>${action}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="action-panel">
                <h3><i class="fa-solid fa-person-military-pointing"></i> OPERATIONS COMMAND</h3>
                <div class="action-buttons">
                    <button class="action-btn escalate"><i class="fa-solid fa-angles-up"></i> Escalate</button>
                    <button class="action-btn resources"><i class="fa-solid fa-truck-ramp-box"></i> Deploy Resources</button>
                    <button class="action-btn comms"><i class="fa-solid fa-bullhorn"></i> Notify Team</button>
                </div>
                <div class="resolution-progress">
                    <div class="progress-bar">
                        <div class="progress" style="width:${crisisActive ? '30%' : '80%'}">
                            ${crisisActive ? '30% Contained' : '80% Resolved'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
    }

    function updateResolutionUI(data) {
        console.log("Crisis resolved:", data);
        popupDisplay(`
        <h2 style="color:green;">CRISIS RESOLVED</h2>
        <p>${data.message}</p>
        <h3>Recovery Steps:</h3>
        <ul>
            ${data.recovery_steps.map(step => `<li>${step}</li>`).join('')}
        </ul>
    `);
    }
    // Update your existing crisis button handler in orchestration.js
    document.getElementById('trigger-crisis-btn').addEventListener('click', async () => {
        crisisActive = !crisisActive;
        const btn = document.getElementById('trigger-crisis-btn');

        if (crisisActive) {
            // Crisis Activation
            btn.textContent = "Resolving Crisis...";
            btn.classList.add('crisis-active');
            showCrisisEffects(true);
            degradeAllAgents();

            // Send to backend
            const response = await fetch('http://localhost:5000/crisis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ crisis: true })
            });

            const data = await response.json();
            updateCrisisUI(data);

        } else {
            // Crisis Resolution
            btn.textContent = "Crisis Resolved!";
            btn.classList.remove('crisis-active');
            btn.style.backgroundColor = "#5cb85c";
            showCrisisEffects(false);
            restoreAgentsGradually();

            // Send resolution to backend
            const response = await fetch('http://localhost:5000/crisis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ crisis: false })
            });

            const data = await response.json();
            updateResolutionUI(data);

            // Reset button after 3 seconds
            setTimeout(() => {
                btn.textContent = "Trigger Crisis";
                btn.style.backgroundColor = "#d9534f";
            }, 3000);
        }
    });

    // New helper functions
    function showCrisisEffects(activate) {
        const map = document.getElementById('map');
        if (activate) {
            map.style.filter = "sepia(0.8) hue-rotate(300deg)";
            document.querySelectorAll('.agent').forEach(a => {
                a.style.boxShadow = "0 0 15px red";
            });
        } else {
            map.style.filter = "";
            document.querySelectorAll('.agent').forEach(a => {
                a.style.boxShadow = "0 0 5px grey";
                a.style.animation = "celebrate 2s";
            });
        }
    }

    function degradeAllAgents() {
        // Visual degradation
        document.getElementById('delBtn').textContent = "Degraded";
        document.getElementById('delBtn').style.backgroundColor = "#f0ad4e";
        document.getElementById('invBtn').textContent = "Degraded";
        document.getElementById('invBtn').style.backgroundColor = "#f0ad4e";
        document.getElementById('supplyBtn').textContent = "Critical";
        document.getElementById('supplyBtn').style.backgroundColor = "#d9534f";

        // Update action logs
        const now = new Date().toLocaleTimeString();
        agentStates.delivery.actions.unshift(`${now} - CRISIS: Operating in degraded mode`);
        agentStates.inventory.actions.unshift(`${now} - CRISIS: Critical stock monitoring`);
        agentStates.supply.actions.unshift(`${now} - CRISIS: Emergency supplier contact`);
    }

    function restoreAgentsGradually() {
        // Stage 1: Immediate visual feedback
        setTimeout(() => {
            document.getElementById('supplyBtn').textContent = "Recovering";
            document.getElementById('supplyBtn').style.backgroundColor = "#5bc0de";
        }, 1000);

        // Stage 2: Partial recovery
        setTimeout(() => {
            document.getElementById('delBtn').textContent = "Recovering";
            document.getElementById('delBtn').style.backgroundColor = "#5bc0de";
            document.getElementById('invBtn').textContent = "Recovering";
            document.getElementById('invBtn').style.backgroundColor = "#5bc0de";

            // Update map markers
            trucks.forEach(t => {
                t.marker.setIcon(createFAIcon('fas fa-truck', '#5bc0de'));
            });
        }, 2000);

        // Stage 3: Full recovery
        setTimeout(() => {
            document.getElementById('delBtn').textContent = "Active";
            document.getElementById('delBtn').style.backgroundColor = "#5cb85c";
            document.getElementById('invBtn').textContent = "Active";
            document.getElementById('invBtn').style.backgroundColor = "#5cb85c";
            document.getElementById('supplyBtn').textContent = "Active";
            document.getElementById('supplyBtn').style.backgroundColor = "#5cb85c";

            // Restore map markers
            trucks.forEach(t => {
                t.marker.setIcon(createFAIcon('fas fa-truck', '#00a82a'));
            });
            warehouses.forEach(w => {
                w.marker.setIcon(createFAIcon('fas fa-warehouse', '#0071ce'));
            });

            // Update action logs
            const now = new Date().toLocaleTimeString();
            agentStates.delivery.actions.unshift(`${now} - SYSTEM: Normal operations resumed`);
            agentStates.inventory.actions.unshift(`${now} - SYSTEM: Stock levels stabilized`);
            agentStates.supply.actions.unshift(`${now} - SYSTEM: Supplier network restored`);
        }, 4000);
    }


    // ADD TRUCK MARKERS
    trucks.forEach(t => {
        t.marker = L.marker([t.lat, t.lng], { icon: createFAIcon('fas fa-truck', '#00a82a') })
            .addTo(map)
            .bindPopup(`${t.id}`);
    });

    // ADD WAREHOUSE MARKERS
    warehouses.forEach(w => {
        w.marker = L.marker([w.lat, w.lng], { icon: createFAIcon('fas fa-warehouse', '#0071ce') })
            .addTo(map)
            .bindPopup(`${w.id}`);
    });

    // MOVEMENT SIMULATION
    // Update your map movement simulation
    setInterval(() => {
        trucks.forEach(t => {
            if (crisisActive) {
                // Crisis movement - chaotic
                t.lat += (Math.random() - 0.8) * 0.01;
                t.lng += (Math.random() - 0.5) * 0.01;

                // Flash red during crisis
                if (Date.now() % 1000 < 200) {
                    t.marker.setIcon(createFAIcon('fas fa-truck', '#ff0000'));
                } else {
                    t.marker.setIcon(createFAIcon('fas fa-truck', '#ff6b6b'));
                }
            } else {
                // Normal movement - orderly
                t.lat += (Math.random() - 0.5) * 0.001;
                t.lng += 0.0005;
            }
            t.marker.setLatLng([t.lat, t.lng]);
        });

        // Warehouse status during crisis
        if (crisisActive && Date.now() % 5000 < 100) {
            const randomWarehouse = warehouses[Math.floor(Math.random() * warehouses.length)];
            randomWarehouse.marker.setIcon(createFAIcon('fas fa-warehouse', '#ff0000'));
            setTimeout(() => {
                if (crisisActive) { // Only if still in crisis
                    randomWarehouse.marker.setIcon(createFAIcon('fas fa-warehouse', '#ff6b6b'));
                }
            }, 1000);
        }
    }, 2000);


})
