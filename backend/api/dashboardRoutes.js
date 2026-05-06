const express = require("express");
const router = express.Router();

const pool = require("../../worker/db/postgres");
const { client: redisClient } = require("../../worker/config/redis");

// 🔹 GET /dashboard/live
router.get("/live", async (req, res) => {
  try {
    const KEY = "ims:dashboard";

    console.log("➡️ /dashboard/live called");

    // ✅ Check Redis type (avoid WRONGTYPE error)
    const type = await redisClient.type(KEY);

    let cached = null;

    if (type === "string") {
      cached = await redisClient.get(KEY);
    } else if (type !== "none") {
      console.log("⚠️ Wrong Redis type, deleting key...");
      await redisClient.del(KEY);
    }

    // ✅ Serve from cache
    if (cached) {
      console.log("⚡ Serving from Redis");
      return res.json(JSON.parse(cached));
    }

    console.log("📦 Fetching from Postgres...");

    // ✅ Fetch from DB
    const result = await pool.query(`
      SELECT id, component_id, severity, status, created_at
      FROM work_items
      ORDER BY created_at DESC
      LIMIT 50
    `);

    const data = result.rows;

    console.log("📊 Rows fetched:", data.length);

    // ✅ Save to Redis (TTL = 5 sec)
    await redisClient.setEx(KEY, 5, JSON.stringify(data));

    console.log("✅ Saved to Redis");

    res.json(data);

  } catch (err) {
    console.error("❌ ERROR in /dashboard/live:", err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
