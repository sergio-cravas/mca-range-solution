import { fireEvent } from '@testing-library/react';

const clickAndMoveElement = (element: Element, movement: number) => {
  const elementPosition = element.getBoundingClientRect().left;

  fireEvent.mouseDown(element);
  fireEvent.mouseMove(element, { clientX: elementPosition + movement });
  fireEvent.mouseUp(element);
};

export { clickAndMoveElement };
