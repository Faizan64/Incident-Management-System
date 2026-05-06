const express = require("express");
const router = express.Router();
const pool = require("../../worker/db/postgres");
const { canTransition } = require("../workflow/stateMachine");
const { validateRCA } = require("../workflow/rcaService");

// Update status
router.post("/update-status", async (req, res) => {
  try {
    const { workItemId, newStatus } = req.body;

    // ✅ Basic validation
    if (!workItemId || !newStatus) {
      return res.status(400).send("workItemId and newStatus are required");
    }

    // ✅ Fetch work item
    const result = await pool.query(
      "SELECT * FROM work_items WHERE id=$1",
      [workItemId]
    );

    const item = result.rows[0];

    if (!item) {
      return res.status(404).send("Work item not found");
    }

    // ✅ Prevent redundant updates
    if (item.status === newStatus) {
      return res.status(400).send("Already in this state");
    }

    // ✅ Validate transition
    if (!canTransition(item.status, newStatus)) {
      return res.status(400).send(
        `Invalid transition from ${item.status} to ${newStatus}`
      );
    }

    // ✅ RCA validation before closing
    if (newStatus === "CLOSED") {
      const isValid = await validateRCA(workItemId);
      if (!isValid) {
        return res.status(400).send("RCA required before closing");
      }
    }

    // ✅ Build query safely
    let query = "";
    let values = [newStatus, workItemId];

    if (newStatus === "RESOLVED") {
      query = `
        UPDATE work_items 
        SET status=$1, resolved_at=NOW(), updated_at=NOW() 
        WHERE id=$2
      `;
    } else if (newStatus === "CLOSED") {
      query = `
        UPDATE work_items 
        SET status=$1, closed_at=NOW(), updated_at=NOW() 
        WHERE id=$2
      `;
    } else {
      query = `
        UPDATE work_items 
        SET status=$1, updated_at=NOW() 
        WHERE id=$2
      `;
    }

    await pool.query(query, values);

    res.send({
      message: "Status updated",
      from: item.status,
      to: newStatus,
    });

  } catch (err) {
    console.error("❌ ERROR in /workflow/update-status:", err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
