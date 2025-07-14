# NexusGrid - Cognitive Commerce Engine
**A centralized AI engine that monitors and coordinates all operational systems, making Walmart’s supply chain more cost-effective and operationally efficient.**

## The Real Problem ?

- Delivery, Inventory, and Supply Chain teams operate in silos, delaying crisis responses.
- Real-time disruptions (floods, strikes) cause **stockouts and delivery delays** before manual fixes can be implemented.
- Lack of real-time visibility of **truck locations, inventory levels, or supplier delays** forces reactive decision-making.

## Our Solution - Features 
### 1️⃣ Agent Control Center
- Visual dashboard showing **Delivery Agent, Inventory Agent, Supply Chain Agent** statuses.
- **Start, Stop, Reset controls** for each agent to simulate workflow controls.
- Live updates of **agent uptime and last 3 actions**.
- Demonstrates how **Walmart can control agents in real-time** during operations and crises.

### 2️⃣ Crisis Simulator
- Trigger **simulated crises (e.g., floods, strikes)** and observe their cascading impacts.
- View how **agent statuses change dynamically during crises**.
- Use to showcase **faster crisis response and recovery planning**.

### 3️⃣ Live Orchestration
- Live **map visualization** of moving trucks and fixed warehouses across Delhi.
- Real-time **truck movement simulation** to visualize delivery routes.
- Reflects **crisis-triggered changes**, rerouting trucks or pausing deliveries during emergencies.
- Provides an **interactive view of the Cognitive Commerce Engine in action.**

## How to Run Locally
1️⃣ **Clone the repository:**

```bash
git clone <repo-url>
cd <repo-folder>
```

2️⃣ **Install dependencies:**

```bash
npm install
```

3️⃣ **Configure environment:**

- Create a `.env` file with:
    ```
    PORT=5000
    MONGO_URI=<your-mongodb-uri>
    NODE_ENV=development
    ```
- Ensure MongoDB is running locally or use Atlas.

4️⃣ **Run the server:**

```bash
node server.js
```
or
```bash
nodemon server.js
```

5️⃣ **Open your browser:**

```
http://localhost:5500
```


## 🌟 Impact

- Enables **real-time decision-making** across Walmart’s delivery, inventory, and supply systems.
- Minimizes **losses during crises** by proactive rerouting and inventory management.
- Reduces **manual coordination delays** between teams.
- Builds a **foundation for scalable cognitive commerce orchestration** for large-scale retail supply chains.

### Contributors : 
- Bhavya Sinha, Avwal Kaur, Divyanshi Pal, Gunjan Ruhal
- Made with ❤️ by Team HERizon 
