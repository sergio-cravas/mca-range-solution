/**
 * Credits to: https://stackoverflow.com/a/19277804/21627140
 */
const getClosestValueInArray = (value: number, array: number[]) => {
  const closest = array.reduce((prev, curr) => (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev));

  return closest;
};

export { getClosestValueInArray };
