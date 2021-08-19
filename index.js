const express = require("express");
const cors = require("cors");
const app = express();


require("dotenv").config();
require("./config/db");


const auth = require("./routes/api/auth");
const userDataGame = require("./routes/api/userGameData");

const PORT = 5000 | process.env.PORT;

app.use(cors());
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(auth).use(userDataGame);


/////////////////////////////////////////////////////
app.get("/", (req, res) => {
  res.send("Express Server Running...");
});

app.listen(PORT, (err) => {
  if (err) throw err;
});
