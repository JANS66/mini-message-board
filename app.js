require("dotenv").config(); // Load environment variables
const express = require("express");
const db = require("./db"); // Import database pool
const app = express();
const PORT = process.env.PORT || 3000;

// Import express-validator
const { body, validationResult } = require("express-validator");

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
  // Pass an empty errors array by default so the view doesnt crash on initial load
  res.render("form", { title: "New Message", errors: [], formData: {} });
});

// 3. New Message Submit Route (POST "/new") - Inserts data into DB
app.post(
  "/new",
  [
    // Validate username: Trim whitespace, ensure its not empty, max 50 characters
    body("messageUser")
      .trim()
      .notEmpty()
      .withMessage("Name is required.")
      .isLength({ max: 50 })
      .withMessage("Name cannot exceed 50 characters."),

    // Validate message: Trim whitespace, ensure its not empty, max 500 characters
    body("messageText")
      .trim()
      .notEmpty()
      .withMessage("Message text cannot be empty.")
      .isLength({ max: 500 })
      .withMessage("Message cannot exceed 500 characters."),
  ],
  async (req, res) => {
    // Extract any validation errors that occurred
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // If there are errors, rerender the form and pass the errors list along
      // Also send back the submitted data so the user doesnt have to retype everything
      return res.render("form", {
        title: "New Message",
        errors: errors.array(),
        formData: {
          messageUser: req.body.messageUser,
          messageText: req.body.messageText,
        },
      });
    }

    // If validation passes, safe data is available in req.body
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
  },
);

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
