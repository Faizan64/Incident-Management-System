const express = require("express");
const router = express.Router();
const pool = require("../../worker/db/postgres");

// Submit RCA
router.post("/submit-rca", async (req, res) => {
  try {
    const {
      workItemId,
      rootCause,
      fix,
      prevention,
      startTime,
      endTime,
    } = req.body;

    // ✅ Validation
    if (
      !workItemId ||
      !rootCause ||
      !fix ||
      !prevention ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).send("All RCA fields are required");
    }

    // ✅ Check work item exists
    const itemCheck = await pool.query(
      "SELECT * FROM work_items WHERE id=$1",
      [workItemId]
    );

    if (itemCheck.rows.length === 0) {
      return res.status(404).send("Work item not found");
    }

    // ✅ Prevent duplicate RCA
    const existingRCA = await pool.query(
      "SELECT * FROM rca WHERE work_item_id=$1",
      [workItemId]
    );

    if (existingRCA.rows.length > 0) {
      return res.status(400).send("RCA already exists for this work item");
    }

    // ✅ MTTR calculation (safe)
    const mttrQuery = `SELECT ($2::timestamp - $1::timestamp) AS mttr`;
    const mttrResult = await pool.query(mttrQuery, [startTime, endTime]);

    const mttr = mttrResult.rows[0].mttr;

    // ✅ Insert RCA
    await pool.query(
      `INSERT INTO rca
      (work_item_id, root_cause, fix, prevention, start_time, end_time, mttr)
      VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        workItemId,
        rootCause,
        fix,
        prevention,
        startTime,
        endTime,
        mttr,
      ]
    );

    res.send({
      message: "RCA submitted",
      mttr,
    });

  } catch (err) {
    console.error("❌ ERROR in /rca/submit-rca:", err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
