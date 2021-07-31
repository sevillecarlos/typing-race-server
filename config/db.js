const mongoose = require("mongoose");

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@cluster0.ptojb.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database Conected"))
  .catch((e) => console.log("Error:", e));

module.export = mongoose;
