const getRealThumbValue = (minValue: number, maxValue: number, relativeValue: number): number => {
  const numToSend = minValue + (relativeValue / 100) * (maxValue - minValue);
  const numToSendRounded = Math.round(numToSend * 100) / 100;

  return numToSendRounded;
};

export { getRealThumbValue };
