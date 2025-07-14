// Crisis scenario data
const crisisScenarios = {
  storm: {
    name: "Major Storm in Northeast Region",
    impacts: {
      low: { delivery: 5, inventory: 3, financial: 5000, response: 30 },
      medium: { delivery: 12, inventory: 8, financial: 15000, response: 45 },
      high: { delivery: 25, inventory: 15, financial: 35000, response: 75 },
      extreme: { delivery: 50, inventory: 30, financial: 75000, response: 120 },
    },
    events: [
      {
        time: 0,
        agent: "WeatherAgent",
        action: "Detected storm pattern",
        severity: "warning",
      },
      {
        time: 5,
        agent: "DeliveryAgent",
        action: "Rerouting trucks",
        severity: "info",
      },
      {
        time: 12,
        agent: "InventoryAgent",
        action: "Adjusting stock levels",
        severity: "info",
      },
      {
        time: 25,
        agent: "System",
        action: "Stabilized deliveries",
        severity: "success",
      },
    ],
  },
  "price-surge": {
    name: "Commodity Price Surge",
    impacts: {
      low: { delivery: 2, inventory: 5, financial: 8000, response: 25 },
      medium: { delivery: 3, inventory: 12, financial: 25000, response: 40 },
      high: { delivery: 5, inventory: 25, financial: 60000, response: 65 },
      extreme: { delivery: 10, inventory: 45, financial: 120000, response: 90 },
    },
    events: [
      {
        time: 0,
        agent: "MarketAgent",
        action: "Detected price surge",
        severity: "warning",
      },
      {
        time: 8,
        agent: "PricingAgent",
        action: "Adjusted pricing",
        severity: "info",
      },
      {
        time: 15,
        agent: "InventoryAgent",
        action: "Optimized stock",
        severity: "info",
      },
      {
        time: 30,
        agent: "System",
        action: "Stabilized pricing",
        severity: "success",
      },
    ],
  },
  "warehouse-fire": {
    name: "Warehouse Fire in Memphis",
    impacts: {
      low: { delivery: 8, inventory: 10, financial: 10000, response: 40 },
      medium: { delivery: 15, inventory: 25, financial: 30000, response: 60 },
      high: { delivery: 30, inventory: 50, financial: 70000, response: 90 },
      extreme: {
        delivery: 60,
        inventory: 100,
        financial: 150000,
        response: 150,
      },
    },
    events: [
      {
        time: 0,
        agent: "FacilityAgent",
        action: "Reported fire",
        severity: "danger",
      },
      {
        time: 5,
        agent: "InventoryAgent",
        action: "Assessed damage",
        severity: "warning",
      },
      {
        time: 12,
        agent: "DeliveryAgent",
        action: "Rerouted shipments",
        severity: "info",
      },
      {
        time: 25,
        agent: "System",
        action: "Minimized disruption",
        severity: "success",
      },
    ],
  },
};

// DOM elements
const elements = {
  crisisType: document.getElementById("crisis-type"),
  crisisSeverity: document.getElementById("crisis-severity"),
  crisisDuration: document.getElementById("crisis-duration"),
  triggerBtn: document.getElementById("trigger-crisis"),
  stopBtn: document.getElementById("stop-crisis"),
  progressBar: document.getElementById("progress-bar-fill"),
  progressText: document.getElementById("progress-text"),
  simulationProgress: document.getElementById("simulation-progress"),
  simulationResults: document.getElementById("simulation-results"),
  deliveryImpact: document.getElementById("delivery-impact"),
  inventoryImpact: document.getElementById("inventory-impact"),
  financialImpact: document.getElementById("financial-impact"),
  responseTime: document.getElementById("response-time"),
  crisisTimeline: document.getElementById("crisis-timeline"),
  crisisMap: document.getElementById("crisis-map"),
  replayBtn: document.getElementById("replay-simulation"),
  exportBtn: document.getElementById("export-simulation"),
  reportBtn: document.getElementById("generate-report"),
};

// Simulation state
let simulationState = {
  running: false,
  interval: null,
  timeouts: [],
  currentScenario: null,
  currentSeverity: null,
  duration: 0,
  elapsed: 0,
};

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  elements.triggerBtn.addEventListener("click", startSimulation);
  elements.stopBtn.addEventListener("click", stopSimulation);
  elements.replayBtn.addEventListener("click", replaySimulation);
  elements.exportBtn.addEventListener("click", exportResults);
  elements.reportBtn.addEventListener("click", generateReport);
});

function startSimulation() {
  const scenario = crisisScenarios[elements.crisisType.value];
  const severity = elements.crisisSeverity.value;
  const duration = parseInt(elements.crisisDuration.value) * 60; // Convert to seconds

  if (!scenario) {
    alert("Please select a crisis scenario");
    return;
  }

  // Reset previous simulation
  stopSimulation();

  // Set up new simulation
  simulationState = {
    running: true,
    interval: null,
    timeouts: [],
    currentScenario: scenario,
    currentSeverity: severity,
    duration: duration,
    elapsed: 0,
  };

  // Update UI
  elements.triggerBtn.disabled = true;
  elements.stopBtn.style.display = "inline-block";
  elements.simulationProgress.style.display = "block";
  elements.simulationResults.style.display = "none";
  elements.crisisTimeline.innerHTML = "";
  elements.crisisMap.querySelector(
    ".map-placeholder"
  ).textContent = `Simulating: ${scenario.name}`;

  // Schedule events
  scenario.events.forEach((event) => {
    const timeout = setTimeout(() => {
      addTimelineEvent(event.time, event.agent, event.action, event.severity);

      // Update impacts when system stabilizes
      if (
        event.action.includes("Stabilized") ||
        event.action.includes("Minimized")
      ) {
        updateImpactMetrics(scenario.impacts[severity]);
      }
    }, event.time * 1000);

    simulationState.timeouts.push(timeout);
  });

  // Start progress timer
  simulationState.interval = setInterval(updateProgress, 1000);
}

function stopSimulation() {
  clearInterval(simulationState.interval);
  simulationState.timeouts.forEach(clearTimeout);

  if (simulationState.running) {
    // Calculate partial results if stopped early
    const progress = simulationState.elapsed / simulationState.duration;
    const scenario = simulationState.currentScenario;
    const severity = simulationState.currentSeverity;

    const partialImpacts = {
      delivery: Math.round(scenario.impacts[severity].delivery * progress),
      inventory: Math.round(scenario.impacts[severity].inventory * progress),
      financial: Math.round(scenario.impacts[severity].financial * progress),
      response: Math.round(
        scenario.impacts[severity].response * (1 + progress)
      ), // Longer response if incomplete
    };

    updateImpactMetrics(partialImpacts);
    addTimelineEvent(
      simulationState.elapsed,
      "System",
      "Simulation stopped manually",
      "warning"
    );
  }

  // Reset state
  simulationState.running = false;

  // Update UI
  elements.triggerBtn.disabled = false;
  elements.stopBtn.style.display = "none";
  elements.simulationResults.style.display = "block";
}

function updateProgress() {
  simulationState.elapsed++;
  const percent = Math.min(
    100,
    (simulationState.elapsed / simulationState.duration) * 100
  );

  elements.progressBar.style.width = `${percent}%`;
  elements.progressText.textContent = `${Math.round(percent)}% complete`;

  if (simulationState.elapsed >= simulationState.duration) {
    completeSimulation();
  }
}

function completeSimulation() {
  clearInterval(simulationState.interval);
  simulationState.running = false;

  // Update UI
  elements.triggerBtn.disabled = false;
  elements.stopBtn.style.display = "none";
  elements.progressBar.style.width = "100%";
  elements.progressText.textContent = "100% complete";
  elements.simulationResults.style.display = "block";
  elements.crisisMap.querySelector(".map-placeholder").textContent =
    "Simulation Complete";
}

function addTimelineEvent(time, agent, action, severity) {
  const eventElement = document.createElement("div");
  eventElement.className = "log-entry";

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const timestamp = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  eventElement.innerHTML = `
        <div class="timestamp">${timestamp}</div>
        <div class="agent">${agent}</div>
        <div class="action">${action}</div>
        <div class="severity status status-${severity}">
            ${severity.charAt(0).toUpperCase() + severity.slice(1)}
        </div>
    `;

  elements.crisisTimeline.appendChild(eventElement);
}

function updateImpactMetrics(impacts) {
  elements.deliveryImpact.textContent = impacts.delivery;
  elements.inventoryImpact.textContent = impacts.inventory;
  elements.financialImpact.textContent = `$${impacts.financial.toLocaleString()}`;
  elements.responseTime.textContent = `${impacts.response}s`;
}

function replaySimulation() {
  if (simulationState.currentScenario) {
    startSimulation();
  } else {
    alert("No simulation to replay");
  }
}

function exportResults() {
  alert("Export functionality would save results to a file");
  // In a real implementation, this would generate a CSV or JSON file
}

function generateReport() {
  alert("Report generation would create a PDF with simulation results");
  // In a real implementation, this would call a PDF generation service
}
document.getElementById("trigger-crisis").addEventListener("click", async () => {
  const type = document.getElementById("crisis-type").value;
  const severity = document.getElementById("crisis-severity").value;
  const duration = document.getElementById("crisis-duration").value;

  if (!type) {
    alert("Please select a crisis type.");
    return;
  }

  document.getElementById("progress-bar-fill").style.width = "0%";
  document.getElementById("progress-text").textContent = "0% complete";

  try {
    const response = await fetch("/api/simulations/trigger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, severity, duration })
    });

    const data = await response.json();

    if (data.success) {
      document.getElementById("delivery-impact").textContent = data.estimatedImpact.delivery;
      document.getElementById("inventory-impact").textContent = data.estimatedImpact.inventory;
      document.getElementById("financial-impact").textContent = `$${data.estimatedImpact.financial}`;
      document.getElementById("response-time").textContent = `${data.estimatedImpact.responseTime}s`;
      document.getElementById("simulation-results").style.display = "block";

      let percent = 0;
      const interval = setInterval(() => {
        if (percent >= 100) {
          clearInterval(interval);
          document.getElementById("progress-text").textContent = "Simulation complete";
        } else {
          percent += 10;
          document.getElementById("progress-bar-fill").style.width = percent + "%";
          document.getElementById("progress-text").textContent = `${percent}% complete`;
        }
      }, 200);
    } else {
      alert("Simulation failed.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while triggering the simulation.");
  }
});
