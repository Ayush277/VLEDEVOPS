const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Updated version");
});

app.listen(3000);