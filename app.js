require("dotenv").config(); // Load environment variables
const express = require("express");
const db = require("./db"); // Import database pool
const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

// MIDDLEWARE: This lets Express parse data sent from HTML forms
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// 1. Index Route (GET "/") - Displays all messages from DB
app.get("/", async (req, res) => {
  try {
    // Query the database, ordering by the 'added' date descending (newest first)
    const { rows } = await db.query(
      "SELECT * FROM messages ORDER BY added DESC",
    );

    res.render("index", {
      title: "Mini Messageboard",
      messages: rows, // 'rows' is an array of objects matching DB columns
    });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).send("Internal Server Error");
  }
});

// 2. New Message Form Route (GET "/new") - Displays the form
app.get("/new", (req, res) => {
  res.render("form", { title: "New Message" });
});

// 3. New Message Submit Route (POST "/new") - Inserts data into DB
app.post("/new", async (req, res) => {
  const { messageText, messageUser } = req.body;

  try {
    // Parameterized query ($1, $2) prevents SQL Injection attacks
    const insertQuery = `
      INSERT INTO messages (message_text, username)
      VALUES ($1, $2)
    `;
    await db.query(insertQuery, [messageText, messageUser]);

    res.redirect("/");
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).send("Error saving your message.");
  }
});

// 4. Message Detail Route (GET "/message/:id") - Fetches a single message by ID
app.get("/message/:id", async (req, res) => {
  const messageId = req.params.id;

  try {
    const { rows } = await db.query("SELECT * FROM messages WHERE id = $1", [
      messageId,
    ]);
    const message = rows[0]; // Take the first matching row

    if (!message) {
      return res.status(404).send("Message not found!");
    }

    res.render("message-detail", {
      title: "Message Details",
      message: message,
    });
  } catch (err) {
    console.error("Error fetching message details:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
