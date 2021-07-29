const express = require("express");

const app = express();

const PORT = 5000 | process.env.PORT;

app.get("/", (req, res) => {
  res.send("Express Server Running...");
});

app.listen(PORT, (err) => {
  if (err) throw err;
});
