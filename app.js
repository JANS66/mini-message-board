const express = require("express");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", {
    title: "Home Page",
    message: "Welcome to my Express app!",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running smoothly at http://localhost:${PORT}`);
});
