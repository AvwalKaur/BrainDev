document.addEventListener("DOMContentLoaded", function () {
  // Agent selection handler
  const agentSelect = document.getElementById("agent-select");
  const agentDetails = document.getElementById("agent-details");

  agentSelect.addEventListener("change", function () {
    if (this.value) {
      agentDetails.classList.remove("hidden");
      updateAgentDetails(this.value);
    } else {
      agentDetails.classList.add("hidden");
    }
  });

  // Control buttons
  document.getElementById("agent-start").addEventListener("click", startAgent);
  document.getElementById("agent-stop").addEventListener("click", stopAgent);
  document.getElementById("agent-reset").addEventListener("click", resetAgent);
  document
    .getElementById("agent-update")
    .addEventListener("click", updateConfig);

  function startAgent() {
    const agent = document.getElementById("agent-select").value;
    showAlert(`Starting ${getAgentName(agent)}...`);
    setAgentStatus("status-success", "Active");
  }

  function stopAgent() {
    const agent = document.getElementById("agent-select").value;
    showAlert(`Stopping ${getAgentName(agent)}...`);
    setAgentStatus("status-danger", "Stopped");
  }

  function resetAgent() {
    const agent = document.getElementById("agent-select").value;
    showAlert(`Resetting ${getAgentName(agent)}...`);
    setAgentStatus("status-info", "Restarting");

    setTimeout(() => {
      setAgentStatus("status-success", "Active");
    }, 2000);
  }

  function updateConfig() {
    const config = document.getElementById("agent-config").value;
    try {
      JSON.parse(config); // Validate JSON
      showAlert("Configuration updated successfully!");
    } catch (e) {
      showAlert("Invalid JSON configuration: " + e.message);
    }
  }

  function setAgentStatus(statusClass, statusText) {
    const statusElement = document.getElementById("agent-status");
    statusElement.className = "status " + statusClass;
    statusElement.textContent = statusText;
  }

  function showAlert(message) {
    alert(message);
  }

  function getAgentName(agentKey) {
    const agentNameMap = {
      delivery: "DeliveryAgent",
      inventory: "InventoryAgent",
      pricing: "PricingAgent",
      fraud: "FraudDetectionAgent",
      customer: "CustomerServiceAgent",
      supply: "SupplyChainAgent",
      weather: "WeatherAgent",
      demand: "DemandForecastingAgent",
    };
    return agentNameMap[agentKey] || agentKey;
  }

  // Update agent details based on selection
  function updateAgentDetails(agent) {
    const agentNameMap = {
      delivery: "DeliveryAgent",
      inventory: "InventoryAgent",
      pricing: "PricingAgent",
      fraud: "FraudDetectionAgent",
      customer: "CustomerServiceAgent",
      supply: "SupplyChainAgent",
      weather: "WeatherAgent",
      demand: "DemandForecastingAgent",
    };

    const agentStatusMap = {
      delivery: "status-success",
      inventory: "status-success",
      pricing: "status-warning",
      fraud: "status-success",
      customer: "status-info",
      supply: "status-danger",
      weather: "status-success",
      demand: "status-success",
    };

    const statusTextMap = {
      "status-success": "Active",
      "status-warning": "Degraded",
      "status-danger": "Down",
      "status-info": "Learning",
    };

    const agentName = agentNameMap[agent];
    const statusClass = agentStatusMap[agent];
    const statusText = statusTextMap[statusClass];

    document.getElementById("agent-name").textContent = agentName;
    setAgentStatus(statusClass, statusText);

    // Update mock API response
    updateApiResponse(agent);

    // Update config based on agent
    updateAgentConfig(agent);
  }

  function updateApiResponse(agent) {
    const apiResponses = {
      delivery: {
        status: "success",
        action: "reroute",
        affected_routes: ["TRK-4592", "TRK-3821", "TRK-7743"],
        reason: "weather_alert",
        estimated_delay_reduction: "42 minutes",
        timestamp: new Date().toISOString(),
      },
      inventory: {
        status: "success",
        action: "rebalance",
        sku: "#459302",
        quantity: 342,
        from_warehouse: "12",
        to_warehouse: "7",
        reason: "demand_shift",
        timestamp: new Date().toISOString(),
      },
      pricing: {
        status: "success",
        action: "price_adjustment",
        products: ["A459302", "B382145", "C774356"],
        average_increase: "8.5%",
        reason: "demand_surge",
        timestamp: new Date().toISOString(),
      },
      fraud: {
        status: "success",
        action: "flag_transactions",
        count: 3,
        total_amount: "$1245.67",
        reason: "suspicious_pattern",
        timestamp: new Date().toISOString(),
      },
      customer: {
        status: "success",
        action: "update_responses",
        updated_topics: ["holiday_returns", "delivery_delays", "price_matches"],
        timestamp: new Date().toISOString(),
      },
      supply: {
        status: "error",
        message: "Agent unavailable",
        timestamp: new Date().toISOString(),
      },
      weather: {
        status: "success",
        alert: "Level 3 storm warning",
        region: "Northeast",
        confidence: "89%",
        timestamp: new Date().toISOString(),
      },
      demand: {
        status: "success",
        forecast: "increased",
        categories: ["Electronics", "Home Goods"],
        confidence: "92%",
        timestamp: new Date().toISOString(),
      },
    };

    document.getElementById("api-response").textContent = JSON.stringify(
      apiResponses[agent] || apiResponses.delivery,
      null,
      2
    );
  }

  function updateAgentConfig(agent) {
    const configTemplates = {
      delivery: {
        name: "DeliveryAgent",
        version: "2.3.1",
        description: "Optimizes delivery routes in real-time",
        parameters: {
          max_reroutes: 3,
          weather_sensitivity: 0.7,
          driver_fatigue_weight: 0.8,
          fuel_efficiency_weight: 0.6,
        },
        dependencies: ["WeatherAgent", "InventoryAgent"],
        update_frequency: "30s",
      },
      inventory: {
        name: "InventoryAgent",
        version: "1.8.4",
        description: "Balances inventory across warehouses",
        parameters: {
          rebalance_threshold: 0.15,
          emergency_threshold: 0.05,
          transport_cost_weight: 0.7,
          delivery_speed_weight: 0.5,
        },
        dependencies: ["DemandForecastingAgent"],
        update_frequency: "15m",
      },
      pricing: {
        name: "PricingAgent",
        version: "3.1.0",
        description: "Adjusts prices based on demand and inventory",
        parameters: {
          max_increase: 0.2,
          max_decrease: 0.15,
          competitor_weight: 0.6,
          demand_weight: 0.8,
          inventory_weight: 0.4,
        },
        dependencies: ["InventoryAgent", "DemandForecastingAgent"],
        update_frequency: "1h",
      },
    };

    const defaultConfig = {
      name: getAgentName(agent),
      version: "1.0.0",
      description: "Configuration for " + getAgentName(agent),
      parameters: {},
      dependencies: [],
      update_frequency: "1h",
    };

    const config = configTemplates[agent] || defaultConfig;
    document.getElementById("agent-config").value = JSON.stringify(
      config,
      null,
      2
    );
  }
});


// BACKEND
const API_BASE_URL = "http://localhost:5000/api/v1";

// Function to fetch all agents
async function fetchAgents() {
  try {
    const response = await fetch(`${API_BASE_URL}/agents`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch agents");

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching agents:", error);
    return [];
  }
}

// Function to update agent status
async function updateAgentStatus(agentId, status) {
  try {
    const response = await fetch(`${API_BASE_URL}/agents/${agentId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) throw new Error("Failed to update agent status");

    return await response.json();
  } catch (error) {
    console.error("Error updating agent status:", error);
    throw error;
  }
}

// Function to update agent config
async function updateAgentConfig(agentId, config) {
  try {
    const response = await fetch(`${API_BASE_URL}/agents/${agentId}/config`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ configuration: config }),
    });

    if (!response.ok) throw new Error("Failed to update agent config");

    return await response.json();
  } catch (error) {
    console.error("Error updating agent config:", error);
    throw error;
  }
}

// Function to add API response
async function addApiResponse(agentId, responseData) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/agents/${agentId}/responses`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ data: responseData }),
      }
    );

    if (!response.ok) throw new Error("Failed to add API response");

    return await response.json();
  } catch (error) {
    console.error("Error adding API response:", error);
    throw error;
  }
}

// Login function
async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Login failed");

    const data = await response.json();
    localStorage.setItem("token", data.token);
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}