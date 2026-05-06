const pool = require("../../worker/db/postgres");

async function validateRCA(workItemId) {
  const result = await pool.query(
    "SELECT * FROM rca WHERE work_item_id=$1",
    [workItemId]
  );

  if (result.rows.length === 0) return false;

  const rca = result.rows[0];

  return (
    rca.root_cause &&
    rca.fix &&
    rca.prevention &&
    rca.start_time &&
    rca.end_time
  );
}

module.exports = { validateRCA };
