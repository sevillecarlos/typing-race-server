const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();
require("./config/db");

const auth = require("./routes/api/auth");
const userDataGame = require("./routes/api/userGameData");

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(auth).use(userDataGame);
app.use("/upload", express.static("upload"));

/////////////////////////////////////////////////////
app.get("/", (req, res) => {
  res.send("Server Express Up");
});

app.listen(PORT, (err) => {
  if (err) throw err;
});
