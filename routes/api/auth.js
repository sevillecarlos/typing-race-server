const router = require("express").Router();
const User = require("../../models/User");
const UserDataGame = require("../../models/UserDataGame");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const signUpValidate = Joi.object({
  fullName: Joi.string().min(6).max(255).required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(255).required(),
});

const signInValidate = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
});

//register
router.post("/signup", async (req, res) => {
  const { error } = signUpValidate.validate(req.body);
  console.log(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const user = new User();
  // user.userPhoto = req.body.userPhoto;
  user.fullName = req.body.fullName
  user.email = req.body.email
  user.password = password;

  const existEmail = await User.findOne({ email: req.body.email });

  if (existEmail) {
    return res.status(400).json({ error: "Email already exist" });
  }

  try {
    const newUser = await user.save();

    const userData = new UserDataGame({
      email: newUser.email,
      points: 0,
      level: "noob",
      time: 45,
    });

    userData.save();

    const jwtToken = jwt.sign(
      {
        name: newUser.fullName,
        email: newUser.email,
        id: newUser._id,
      },
      process.env.TOKEN_SECRET
    );

    res.json({
      jwtToken,
    });
  } catch (err) {
    res.status(400).json({ err });
  }
});

//login
router.post("/signin", async (req, res) => {
  const { error } = signInValidate.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ error: "User don't exist" });

  const confirmPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!confirmPassword)
    return res.status(400).json({ error: "Incorrect password" });

  const jwtToken = jwt.sign(
    {
      email: user.email,
      name: user.fullName,
    },
    process.env.TOKEN_SECRET
  );

  res.header("auth-token", jwtToken).json({
    jwtToken,
  });
});

router.post("/get-user", async (req, res) => {
  const user = await User.findOne({ _id: req.body._id });
  console.log(user);
  try {
    res.json({
      email: user.email,
      name: user.fullName,
    });
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
