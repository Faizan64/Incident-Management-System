const { Pool } = require("pg");

const pool = new Pool({
  user: "ims",
  host: "localhost",
  database: "imsdb",
  password: "ims123",
  port: 5432,
});

module.exports = pool;
