const getThumbPositionRelativeToRangeSlider = (
  thumb: HTMLDivElement,
  rangeInput: HTMLDivElement,
  clickPosition: number
): number => {
  const sliderWidth = rangeInput.offsetWidth;
  const thumbHalfWidth = thumb.offsetWidth / 2;
  const initialPosition = rangeInput.getBoundingClientRect().left;

  let finalPosition = Math.round(((clickPosition - initialPosition - thumbHalfWidth) / sliderWidth) * 100);

  return finalPosition;
};

export { getThumbPositionRelativeToRangeSlider };
