module.exports = (gamePoint, prevLevel, timer) => {
  let level = prevLevel;
  let points = gamePoint;
  let time = timer;

  switch (prevLevel) {
    case "noob":
      if (gamePoint > 2) {
        level = "pro";
        points = 0;
        time = 40;
      }
      break;
    case "pro":
      if (gamePoint > 3) {
        level = "master";
        points = 0;
        time = 35;
      }
      break;
    case "master":
      if (gamePoint > 3) {
        level = "leave your mom basement please";
        points = 0;
        time = 30;
      }
      break;
    case "leave your mom basement please":
      break;
    default:
      break;
  }
  return { points, level, time };
};
