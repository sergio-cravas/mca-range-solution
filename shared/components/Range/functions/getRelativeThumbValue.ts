const getRelativeThumbValue = (minValue: number, maxValue: number, realValue: number): number => {
  const numToSend = ((realValue - minValue) / (maxValue - minValue)) * 100;

  return numToSend;
};

export { getRelativeThumbValue };
