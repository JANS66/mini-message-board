require("dotenv").config();
const { Client } = require("pg");

// SQL query to create the table structure
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        message_text TEXT NOT NULL,
        username VARCHAR(255) NOT NULL,
        added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

// SQL query to seed initial data
const seedDataQuery = `
    INSERT INTO messages (message_text, username) VALUES
    ('Hi there!', 'Amando'),
    ('Hello World!', 'Charles');
`;

async function main() {
  console.log("Connecting to the database...");

  // The Client automatically looks for the DATABASE_URL environment variable
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    // Enable SSL for secure connections to remote hosts like Render
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("Connected successfully.");

    console.log("Creating 'messages' table...");
    await client.query(createTableQuery);
    console.log("Table created successfully.");

    // Check if table is empty before seeding, to prevent duplication
    const res = await client.query("SELECT COUNT(*) FROM messages");
    if (parseInt(res.rows[0].count) === 0) {
      console.log("Seeding initial data...");
      await client.query(seedDataQuery);
      console.log("Data seeded successfully.");
    } else {
      console.log("Table already contains data. Skipping seeding.");
    }
  } catch (err) {
    console.error("Error initializing the database:", err);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
}

main();
