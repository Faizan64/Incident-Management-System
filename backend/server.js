const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const { connectQueue, sendToQueue } = require("./config/rabbitmq");
const { connectRedis } = require("../worker/config/redis");

const workflowRoutes = require("./api/workflowRoutes");
const rcaRoutes = require("./api/rcaRoutes");
const dashboardRoutes = require("./api/dashboardRoutes");

const app = express();

// 🔹 Middlewares
app.use(express.json());
app.use(cors());

// 🔹 Rate limiter (protect ingestion API)
const limiter = rateLimit({
  windowMs: 1000,
  max: 100,
});
app.use(limiter);

// 🔹 Simple request counter (observability)
let requestCount = 0;

// 🔹 Health check
app.get("/health", (req, res) => {
  res.send("OK");
});

// 🔹 Signal ingestion API
app.post("/signal", async (req, res) => {
  try {
    const { componentId, message, severity } = req.body;

    if (!componentId || !message || !severity) {
      return res.status(400).send("Missing required fields");
    }

    console.log("📥 API received:", req.body);

    sendToQueue(req.body);

    console.log("📤 Sent to RabbitMQ");

    requestCount++;
    res.send("Signal queued");
  } catch (err) {
    console.error("❌ Error in /signal:", err);
    res.status(500).send("Internal Server Error");
  }
});

// 🔹 Routes
app.use("/workflow", workflowRoutes);
app.use("/rca", rcaRoutes);
app.use("/dashboard", dashboardRoutes);

// 🔹 Throughput logging (every 5 sec)
setInterval(() => {
  console.log(`🚀 Throughput: ${requestCount} signals / 5 sec`);
  requestCount = 0;
}, 5000);

// 🔹 Start server AFTER dependencies connect
async function startServer() {
  try {
    // ✅ Connect Redis FIRST (FIXES your 500 error)
    await connectRedis();
    console.log("✅ Redis connected");

    // ✅ Connect RabbitMQ
    await connectQueue();
    console.log("✅ RabbitMQ connected");

    // ✅ Start server
    app.listen(3000, "127.0.0.1", () => {
      console.log("🚀 Server running on port 3000");
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
