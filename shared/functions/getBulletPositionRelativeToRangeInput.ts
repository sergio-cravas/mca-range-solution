const getBulletPositionRelativeToRangeSlider = (
  bullet: HTMLDivElement,
  rangeInput: HTMLDivElement,
  clickPosition: number
): number => {
  const sliderWidth = rangeInput.offsetWidth;
  const bulletHalfWidth = bullet.offsetWidth / 2;
  const initialPosition = rangeInput.getBoundingClientRect().left;

  let finalPosition = Math.round(((clickPosition - initialPosition - bulletHalfWidth) / sliderWidth) * 100);

  return finalPosition;
};

export { getBulletPositionRelativeToRangeSlider };
