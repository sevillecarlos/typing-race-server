const router = require("express").Router();
const UserDataGame = require("../../models/UserDataGame");
const gamePointsTable = require("../../src/gamePointsTable");
const gameLevelTable = require("../../src/gameLevelTable");

//add game data for the user
router.post("/add-user-game-data", async (req, res) => {
  const { email, completeWords } = req.body;

  const userPoint = gamePointsTable(completeWords);

  try {
    const user = await UserDataGame.find({
      email: email,
    });

    const [userData] = user;

    const { points, level, time } = gameLevelTable(
      userPoint,
      userData.points,
      userData.level,
      userData.time
    );

    userData.points = points;
    userData.level = level;
    userData.time = time;

    if (userData.save()) {
      res.json({ user });
    }
  } catch (error) {
    res.json({ error });
  }
});

router.post("/get-user-data-game", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserDataGame.findOne({ email: email });

    if (user) {
      res.json({ user });
    }
  } catch (error) {
    res.json({ error });
  }
});

router.put("/restart-game", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserDataGame.findOne({ email: email });

    if (user) {
      user.points = 0;
      user.level = "noob";
      user.time = 45;
      if (user.save()) res.json({ user });
    }
  } catch (error) {
    res.json({ error });
  }
});

module.exports = router;
