module.exports = (gamePoint, userPoints, prevLevel, timer) => {
  let level = prevLevel;
  let points = gamePoint + userPoints;
  let time = timer;

  switch (prevLevel) {
    case "noob":
      if (points >= 50) {
        level = "pro";
        points = 0;
        time = 40;
      }
      break;
    case "pro":
      if (points >= 60) {
        level = "master";
        points = 0;
        time = 35;
      }
      break;
    case "master":
      if (points >= 70) {
        level = "hacker";
        points = 0;
        time = 30;
      }
      break;
    case "hacker":
      break;
    default:
      break;
  }
  return { points, level, time };
};
