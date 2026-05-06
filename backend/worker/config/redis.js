const { createClient } = require("redis");

const client = createClient({
  url: "redis://localhost:6379",
});

client.on("error", (err) => console.error("Redis Error:", err));

async function connectRedis() {
  if (!client.isOpen) {
    await client.connect();
    console.log("✅ Redis connected");
  }
}

module.exports = { client, connectRedis };
