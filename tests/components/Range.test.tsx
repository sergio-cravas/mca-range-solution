import React from 'react';

import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import { Range } from '@/shared/components';

test('Renders Range Input', () => {
  const props = {
    label: 'Range test',
    rangeValues: [0, 100],
    onChangeMinThumbValue: () => {},
    onChangeMaxThumbValue: () => {},
  };

  const component = render(<Range {...props} />);

  // Range must have label text specified as prop.
  component.getByText(props.label);

  // Range must have range values specified as prop.
  component.getByText(props.rangeValues[0]);
  component.getByText(props.rangeValues[1]);
});

test('Range Input have proper aria label properties', () => {
  const props = {
    label: 'Range test',
    rangeValues: [0, 100],
    onChangeMinThumbValue: () => {},
    onChangeMaxThumbValue: () => {},
  };

  const component = render(<Range {...props} />);

  // Range must have slider role.
  const rangeInput = component.getByRole('slider');

  expect(rangeInput).toHaveAttribute('aria-valuemin', String(props.rangeValues[0]));
  expect(rangeInput).toHaveAttribute('aria-valuemax', String(props.rangeValues[1]));
  expect(rangeInput).toHaveAttribute('aria-valuetext', `Range between ${props.rangeValues[0]} and ${props.rangeValues[1]}`);
});
