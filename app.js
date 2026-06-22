const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

// MIDDLEWARE: This lets Express parse data sent from HTML forms
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const messages = [
  { text: "Hi there!", user: "Amando", added: new Date() },
  { text: "Hello World!", user: "Charles", added: new Date() },
];

// 1. Index Route (GET "/") - Displays all messages
app.get("/", (req, res) => {
  res.render("index", {
    title: "Mini Messageboard",
    messages: messages,
  });
});

// 2. New Message Form Route (GET "/new") - Displays the form
app.get("/new", (req, res) => {
  res.render("form", { title: "New Message" });
});

// 3. New Message Submit Route (POST "/new") - Handles form submission
app.post("/new", (req, res) => {
  const messageText = req.body.messageText;
  const messageUser = req.body.messageUser;

  // Add the new message to our array
  messages.push({ text: messageText, user: messageUser, added: new Date() });

  // Redirect the user back to the index page to see their message
  res.redirect("/");
});

// 4. Message Detail Route (GET "/message/:id")
app.get("/message/:id", (req, res) => {
  const messageId = req.params.id;
  const message = messages[messageId];

  // If the message doesnt exist, send a 404
  if (!message) {
    return res.status(404).send("Message not found!");
  }

  res.render("message-detail", { title: "Message Details", message: message });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
