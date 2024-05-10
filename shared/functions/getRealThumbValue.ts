const getRealThumbValue = (maxValue: number, relativeToRangeValue: number): number => {
  const numToSend = (maxValue * (relativeToRangeValue / 100)) / 1;
  const numToSendRounded = Math.round(numToSend * 100) / 100;

  return numToSendRounded;
};

export { getRealThumbValue };
