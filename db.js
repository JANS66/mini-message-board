require("dotenv").config();
const { Pool } = require("pg");

// Determine if we are running in production (on Render)
const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Render requires SSL for external connections, but handles internal connections securely.
  // This rule automatically manages SSL setting depending on where the app is running.
  ssl: isProduction ? false : { rejectUnauthorized: false },
});

module.exports = {
  // Helper function to run queries
  query: (text, params) => pool.query(text, params),
};
