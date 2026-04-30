const express = require("express");
const app = express();

app.get("/", (req, res) => {
  const version = process.env.APP_VERSION || "UPDATED";
  res.send(`${version} version running`);
});

app.listen(3000);