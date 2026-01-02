const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: "postgresql://postgres:postgres@localhost:54322/postgres"
});

// Simple API endpoint
app.get("/rest/v1/companies", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM companies");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(54321, () => {
  console.log("API server running on port 54321");
});
