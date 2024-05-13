'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import debounce from 'lodash.debounce';

import { getClosestValueInArray } from '@/shared/functions';
import { getRealThumbValue, getRelativeThumbPositionWithUserClick, getRelativeThumbValue } from './functions';

import styles from './range.module.scss';

const DEFAULT_RANGE_VALUES = [0, 50, 100];

type Props = {
  label?: string;
  rangeValues: number[];
  isFixedRange?: boolean;
  onUpdateRangeValue?: (prevIndex: number, newValue: number) => void;
  onChangeMinThumbValue: (min: number) => void;
  onChangeMaxThumbValue: (max: number) => void;
};

const Range = ({
  label = '',
  rangeValues = DEFAULT_RANGE_VALUES,
  isFixedRange,
  onUpdateRangeValue,
  onChangeMinThumbValue,
  onChangeMaxThumbValue,
}: Props) => {
  const rangeLabelId = useId();
  const rangeRef = useRef<HTMLDivElement>(null);
  const minThumbRef = useRef<HTMLDivElement>(null);
  const maxThumbRef = useRef<HTMLDivElement>(null);

  /**
   * Real min value of the range. E.g.: 1.99
   */
  const minValue = useMemo(() => rangeValues[0], [rangeValues]);
  /**
   * Real max value of the range. E.g.: 99.99
   */
  const maxValue = useMemo(() => rangeValues[rangeValues.length - 1], [rangeValues]);
  /**
   * Real current range for showing it on html attributes. E.g.: [1.99, 99.99]
   */
  const [currentValue, setCurrentValue] = useState<[number, number]>([minValue, maxValue]);

  const [isDraggingMin, setIsDraggingMin] = useState<boolean>(false);
  const [isDraggingMax, setIsDraggingMax] = useState<boolean>(false);

  /**
   * Real min thumb value over the range between min and max values. E.g.: 40.95
   */
  const [minThumbValue, setMinThumbValue] = useState<number>(minValue);
  /**
   * Real max thumb value over the range between min and max values. E.g.: 80
   */
  const [maxThumbValue, setMaxThumbValue] = useState<number>(maxValue);

  /**
   * Relative min thumb value over the range between min and max values. E.g.: 40.95
   */
  const [relativeMinThumbValue, setRelativeMinThumbValue] = useState<number>(0);
  /**
   * Relative max thumb value over the range between min and max values. E.g.: 80
   */
  const [relativeMaxThumbValue, setRelativeMaxThumbValue] = useState<number>(100);

  /**
   * Update the minimum thumb position to the value from 0% to 100% (or maxThumbRelativeValue)
   */
  const updateMinThumbPosition = useCallback(
    (valueRelativeToRange: number) => {
      const minRangeValue = 0;
      const maxRangeValue = Math.min(relativeMaxThumbValue, 100);

      valueRelativeToRange = Math.max(minRangeValue, valueRelativeToRange);
      valueRelativeToRange = Math.min(maxRangeValue, valueRelativeToRange);

      const numToSendRounded = getRealThumbValue(minValue, maxValue, valueRelativeToRange);

      setMinThumbValue(numToSendRounded);
      setRelativeMinThumbValue(valueRelativeToRange);
      setCurrentValue((prev) => [numToSendRounded, prev[1]]);

      onChangeMinThumbValue(numToSendRounded);
    },
    [relativeMaxThumbValue, minValue, maxValue, onChangeMinThumbValue]
  );

  /**
   * Update the maximum thumb position to the value from 0% (or minThumbRelativeValue) to 100%
   */
  const updateMaxThumbPosition = useCallback(
    (valueRelativeToRange: number) => {
      const minRangeValue = Math.max(0, relativeMinThumbValue);
      const maxRangeValue = 100;

      valueRelativeToRange = Math.max(minRangeValue, valueRelativeToRange);
      valueRelativeToRange = Math.min(maxRangeValue, valueRelativeToRange);

      const numToSendRounded = getRealThumbValue(minValue, maxValue, valueRelativeToRange);

      setMaxThumbValue(numToSendRounded);
      setRelativeMaxThumbValue(valueRelativeToRange);
      setCurrentValue((prev) => [prev[0], numToSendRounded]);

      onChangeMaxThumbValue(numToSendRounded);
    },
    [relativeMinThumbValue, minValue, maxValue, onChangeMaxThumbValue]
  );

  const handleOnMoveThumb = useCallback(
    (clientX: number) => {
      const rangeInput = rangeRef.current;
      const minThumb = minThumbRef.current;
      const maxThumb = maxThumbRef.current;

      if (!rangeInput || !minThumb || !maxThumb) return;

      if (isDraggingMin) {
        let valueRelativeToRange = getRelativeThumbPositionWithUserClick(minThumb, rangeInput, clientX);
        updateMinThumbPosition(valueRelativeToRange);
      }

      if (isDraggingMax) {
        let valueRelativeToRange = getRelativeThumbPositionWithUserClick(maxThumb, rangeInput, clientX);
        updateMaxThumbPosition(valueRelativeToRange);
      }
    },
    [isDraggingMax, isDraggingMin, updateMaxThumbPosition, updateMinThumbPosition]
  );

  const handleOnMoveStartThumb = useCallback(
    (clientX: number, thumb: 'min' | 'max') => {
      if (thumb === 'min') setIsDraggingMin(true);
      else setIsDraggingMax(true);

      handleOnMoveThumb(clientX);
    },
    [handleOnMoveThumb]
  );

  const handleOnMoveEndThumb = useCallback(() => {
    if (isDraggingMin && isFixedRange) {
      const newValue = getClosestValueInArray(minThumbValue, rangeValues, { max: maxThumbValue });

      const relativeNewValue = getRelativeThumbValue(minValue, maxValue, newValue);

      updateMinThumbPosition(relativeNewValue);
    }

    if (isDraggingMax && isFixedRange) {
      const newValue = getClosestValueInArray(maxThumbValue, rangeValues, { min: minThumbValue });
      const relativeNewValue = getRelativeThumbValue(minValue, maxValue, newValue);

      updateMaxThumbPosition(relativeNewValue);
    }

    setIsDraggingMin(false);
    setIsDraggingMax(false);
  }, [
    rangeValues,
    isFixedRange,
    minValue,
    maxValue,
    isDraggingMin,
    isDraggingMax,
    minThumbValue,
    maxThumbValue,
    updateMinThumbPosition,
    updateMaxThumbPosition,
  ]);

  const handleOnUpdateRangeValue = debounce((index: number, value) => {
    onUpdateRangeValue && onUpdateRangeValue(index, value);
  }, 250);

  useEffect(() => {
    document.addEventListener('mouseup', handleOnMoveEndThumb);
    document.addEventListener('touchend', handleOnMoveEndThumb);

    return () => {
      document.removeEventListener('mouseup', handleOnMoveEndThumb);
      document.removeEventListener('touchend', handleOnMoveEndThumb);
    };
  }, [handleOnMoveEndThumb, handleOnMoveThumb]);

  return (
    <div
      className={styles['range']}
      onMouseMove={(event) => handleOnMoveThumb(event.clientX)}
      onTouchMove={(event) => handleOnMoveThumb(event.touches?.[0]?.clientX)}
    >
      <label id={rangeLabelId} className={styles['range__label']}>
        {label}
      </label>

      <div
        ref={rangeRef}
        className={styles['range__input']}
        // aria-valuenow is not necessary due to aria-valuetext
        // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
        role="slider"
        aria-valuemin={minValue}
        aria-valuemax={maxValue}
        aria-valuetext={`Range between ${currentValue[0]} and ${currentValue[1]}`}
        aria-labelledby={rangeLabelId}
      >
        <div
          className={styles['range__input__selection']}
          style={{ left: `${relativeMinThumbValue}%`, width: `calc(${relativeMaxThumbValue}% - ${relativeMinThumbValue}%)` }}
        />

        <div
          data-testid="minimum-thumb"
          aria-label="Minimum thumb"
          ref={minThumbRef}
          className={styles['range__input__thumb']}
          style={{ left: `${relativeMinThumbValue}%` }}
          onMouseDown={(event) => {
            event.preventDefault();
            handleOnMoveStartThumb(event.clientX, 'min');
          }}
          onTouchStart={(event) => handleOnMoveStartThumb(event.touches?.[0]?.clientX, 'min')}
        />

        <div
          data-testid="maximum-thumb"
          aria-label="Maximum thumb"
          ref={maxThumbRef}
          className={styles['range__input__thumb']}
          style={{ left: `${relativeMaxThumbValue}%` }}
          onMouseDown={(event) => {
            event.preventDefault();
            handleOnMoveStartThumb(event.clientX, 'max');
          }}
          onTouchStart={(event) => handleOnMoveStartThumb(event.touches?.[0]?.clientX, 'max')}
        />
      </div>

      <div className={styles['range__input__range-values']}>
        {rangeValues.map((rangeValue: number, index, list) =>
          Boolean(onUpdateRangeValue) ? (
            <input
              data-cy="range-input-label"
              key={`range__value-${index}`}
              className={styles['range__input__range-values__input']}
              type="number"
              min={list[index - 1] || 0}
              max={list[index + 1] || undefined}
              defaultValue={rangeValue}
              onChange={(event) => handleOnUpdateRangeValue(index, +event.target.value)}
            />
          ) : (
            <label
              key={`range__value-${index}`}
              className={styles['range__input__range-values__label']}
              // !TODO: Pending to be commented at the tech review
              // style={{ left: `${Math.round((rangeValue * 100) / maxValue)}%` }}
            >
              {rangeValue}
            </label>
          )
        )}
      </div>
    </div>
  );
};

export { Range };
