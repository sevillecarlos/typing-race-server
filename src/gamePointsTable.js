module.exports = (completeWords) => {
  console.log(completeWords);
  let point = Math.round(completeWords / (completeWords * 2));
  return point;
};
