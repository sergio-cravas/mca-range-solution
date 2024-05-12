/**
 * Updated to avoid that min and max thumbs values the same.
 * Credits to: https://stackoverflow.com/a/19277804/21627140
 */
const getClosestValueInArray = (value: number, array: number[], { min, max }: { min?: number; max?: number }) => {
  let closest = array.reduce((prev, curr) => (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev));

  if (Boolean(max) && closest === max) {
    let indexOfNewValue = array.findIndex((i) => i === closest);

    closest = array[Math.max(0, indexOfNewValue - 1)];
  }

  if (Boolean(min) && closest === min) {
    let indexOfNewValue = array.findIndex((i) => i === closest);

    closest = array[Math.min(array.length - 1, indexOfNewValue + 1)];
  }

  return closest;
};

export { getClosestValueInArray };
