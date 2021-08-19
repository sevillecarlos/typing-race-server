const router = require("express").Router();
const User = require("../../models/User");
const UserDataGame = require("../../models/UserDataGame");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const DIR = "./upload/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4() + "-" + fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("File type not accepted (.png, .jpg, .jpeg)"));
    }
  },
});

////////////////////////////////////////////////////////////////

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
router.post("/signup", upload.array("imagesArray", 8), async (req, res) => {
  const reqFiles = [];

  const url = req.protocol + "://" + req.get("host");

  for (var i = 0; i < req.files.length; i++) {
    reqFiles.push(url + "/upload/" + req.files[i].filename);
  }

  const { error } = signUpValidate.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const user = new User();
  // user.userPhoto = req.body.userPhoto;
  user.fullName = req.body.fullName;
  user.email = req.body.email;
  user.password = password;
  user.imagesArray = reqFiles;

  const existEmail = await User.findOne({ email: req.body.email });

  if (existEmail) {
    return res.json({ error: "Email already exist" });
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
  if (!user) return res.json({ error: "User don't exist" });

  const confirmPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!confirmPassword) return res.json({ error: "Incorrect password" });

  const jwtToken = jwt.sign(
    {
      email: user.email,
      name: user.fullName,
    },
    process.env.TOKEN_SECRET
  );
  try {
    res.header("auth-token", jwtToken).json({
      jwtToken,
    });
  } catch (error) {
    console.log(error);
  }
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
    res.json({
      error: "malo",
    });
  }
});
module.exports = router;
