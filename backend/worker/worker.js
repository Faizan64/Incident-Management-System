const amqp = require("amqplib");
const { client: redisClient, connectRedis } = require("./config/redis");
const Signal = require("./db/mongo");
const pool = require("./db/postgres");

// 🔥 Batch config
let buffer = [];
const BATCH_SIZE = 100;
const FLUSH_INTERVAL = 2000;

// 🔥 Flush signals to MongoDB
async function flushBatch() {
  if (buffer.length === 0) return;

  try {
    await Signal.insertMany(buffer);
    console.log(`✅ Inserted ${buffer.length} signals`);
    buffer = [];
  } catch (err) {
    console.error("❌ Batch insert error:", err);
  }
}

// Auto flush every 2 sec
setInterval(flushBatch, FLUSH_INTERVAL);

// 🔥 Core signal processing
async function processSignal(signal) {
  const key = signal.componentId;

  try {
    // ✅ ATOMIC REDIS DEBOUNCE (FIXED)
    const isNew = await redisClient.set(key, "active", {
      NX: true,
      EX: 10,
    });

    // Always add to batch buffer
    buffer.push(signal);

    // Flush batch if size reached
    if (buffer.length >= BATCH_SIZE) {
      await flushBatch();
    }

    // If new incident → create Work Item
    if (isNew) {
      console.log("🚨 NEW incident:", key);

      await pool.query(
        "INSERT INTO work_items (component_id, severity, status) VALUES ($1,$2,$3)",
        [signal.componentId, signal.severity, "OPEN"]
      );

      // Update dashboard cache
      await redisClient.lPush(
        "dashboard:incidents",
        JSON.stringify({
          componentId: signal.componentId,
          severity: signal.severity,
          status: "OPEN",
          createdAt: new Date(),
        })
      );
    } else {
      console.log("⚡ Debounced signal:", key);
    }
  } catch (err) {
    console.error("❌ Processing error:", err);
    throw err;
  }
}

// 🔥 Start worker
async function start() {
  try {
    // 1. Connect Redis FIRST
    await connectRedis();
    console.log("Redis SET type:", typeof redisClient.set);

    // 2. Connect RabbitMQ
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue("signals", {
      durable: true,
    });

    // 🔥 PERFORMANCE BOOST
    channel.prefetch(100);

    console.log("🚀 Worker started...");

    // 3. Consume messages
    channel.consume("signals", async (msg) => {
      if (msg !== null) {
        const signal = JSON.parse(msg.content.toString());

        try {
          await processSignal(signal);
          channel.ack(msg);
        } catch (err) {
          console.error("❌ Message failed:", err);
          channel.nack(msg, false, true); // retry
        }
      }
    });
  } catch (err) {
    console.error("❌ Worker startup error:", err);
  }
}

// Run worker
start();
