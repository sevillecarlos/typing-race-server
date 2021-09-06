const mongoose = require("mongoose");

const userDataGameSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  points: {
    type: Number,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserDataGame", userDataGameSchema);
