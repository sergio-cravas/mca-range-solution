'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import debounce from 'lodash.debounce';

import { getRealThumbValue, getThumbPositionRelativeToRangeSlider, getClosestValueInArray } from '@/shared/functions';

import styles from './range.module.scss';

const DEFAULT_RANGE_VALUES = [0, 50, 100];

type Props = {
  label: string;
  rangeValues: number[];
  isFixedRange?: boolean;
  onUpdateRangeValue?: (prevIndex: number, newValue: number) => void;
  onChangeMinThumbValue: (min: number) => void;
  onChangeMaxThumbValue: (max: number) => void;
};

const Range = ({
  label,
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

  const minValue = useMemo(() => rangeValues[0], [rangeValues]);
  const maxValue = useMemo(() => rangeValues[rangeValues.length - 1], [rangeValues]);
  const [currentValue, setCurrentValue] = useState<[number, number]>([minValue, maxValue]);

  const [isDraggingMin, setIsDraggingMin] = useState<boolean>(false);
  const [isDraggingMax, setIsDraggingMax] = useState<boolean>(false);

  const [minThumbValue, setMinThumbValue] = useState<number>(minValue);
  const [maxThumbValue, setMaxThumbValue] = useState<number>(maxValue);

  /**
   * Update the minimum thumb position to the value from 0% to 100% (or maxThumbRelativeValue)
   */
  const updateMinThumbPosition = useCallback(
    (valueRelativeToRange: number) => {
      const minRangeValue = 0;
      const maxRangeValue = Math.min(maxThumbValue, 100);

      valueRelativeToRange = Math.max(minRangeValue, valueRelativeToRange);
      valueRelativeToRange = Math.min(maxRangeValue, valueRelativeToRange);

      const numToSendRounded = getRealThumbValue(maxValue, valueRelativeToRange);

      setMinThumbValue(valueRelativeToRange);
      setCurrentValue((prev) => [numToSendRounded, prev[1]]);

      onChangeMinThumbValue(numToSendRounded);
    },
    [maxThumbValue, maxValue, onChangeMinThumbValue]
  );

  /**
   * Update the maximum thumb position to the value from 0% (or minThumbRelativeValue) to 100%
   */
  const updateMaxThumbPosition = useCallback(
    (valueRelativeToRange: number) => {
      const minRangeValue = Math.max(0, minThumbValue);
      const maxRangeValue = 100;

      valueRelativeToRange = Math.max(minRangeValue, valueRelativeToRange);
      valueRelativeToRange = Math.min(maxRangeValue, valueRelativeToRange);

      const numToSendRounded = getRealThumbValue(maxValue, valueRelativeToRange);

      setMaxThumbValue(valueRelativeToRange);
      setCurrentValue((prev) => [prev[0], numToSendRounded]);

      onChangeMaxThumbValue(numToSendRounded);
    },
    [minThumbValue, maxValue, onChangeMaxThumbValue]
  );

  const handleOnMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>, thumb: 'min' | 'max') => {
      const rangeInput = rangeRef.current;
      const minThumb = minThumbRef.current;
      const maxThumb = maxThumbRef.current;

      if (!rangeInput || !minThumb || !maxThumb) return;

      if (thumb === 'min' && isDraggingMin) {
        let valueRelativeToRange = getThumbPositionRelativeToRangeSlider(minThumb, rangeInput, event.clientX);
        updateMinThumbPosition(valueRelativeToRange);
      }

      if (thumb === 'max' && isDraggingMax) {
        let valueRelativeToRange = getThumbPositionRelativeToRangeSlider(maxThumb, rangeInput, event.clientX);
        updateMaxThumbPosition(valueRelativeToRange);
      }
    },
    [isDraggingMax, isDraggingMin, updateMaxThumbPosition, updateMinThumbPosition]
  );

  const handleOnStartDragging = useCallback(
    (event: React.MouseEvent<HTMLDivElement>, thumb: 'min' | 'max') => {
      if (thumb === 'min') setIsDraggingMin(true);
      else setIsDraggingMax(true);

      handleOnMouseMove(event, thumb);

      event.preventDefault();
    },
    [handleOnMouseMove]
  );

  const handleOnEndDragging = useCallback(() => {
    if (isDraggingMin && isFixedRange) {
      const newValue = getClosestValueInArray(minThumbValue, rangeValues);
      updateMinThumbPosition(newValue);
    }

    if (isDraggingMax && isFixedRange) {
      const newValue = getClosestValueInArray(maxThumbValue, rangeValues);
      updateMaxThumbPosition(newValue);
    }

    setIsDraggingMin(false);
    setIsDraggingMax(false);
  }, [
    rangeValues,
    isFixedRange,
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
    document.addEventListener('mouseup', handleOnEndDragging);

    return () => {
      document.removeEventListener('mouseup', handleOnEndDragging);
    };
  }, [handleOnEndDragging]);

  return (
    <div className={styles['range']}>
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
          style={{ left: `${minThumbValue}%`, width: `calc(${maxThumbValue}% - ${minThumbValue}%)` }}
        />

        <div
          data-testid="minimum-thumb"
          aria-label="Minimum thumb"
          ref={minThumbRef}
          className={styles['range__input__thumb']}
          style={{ left: `${minThumbValue}%` }}
          onMouseMove={(event) => handleOnMouseMove(event, 'min')}
          onMouseDown={(event) => handleOnStartDragging(event, 'min')}
        />

        <div
          data-testid="maximum-thumb"
          aria-label="Maximum thumb"
          ref={maxThumbRef}
          className={styles['range__input__thumb']}
          style={{ left: `${maxThumbValue}%` }}
          onMouseMove={(event) => handleOnMouseMove(event, 'max')}
          onMouseDown={(event) => handleOnStartDragging(event, 'max')}
        />
      </div>

      <div className={styles['range__input__range-values']}>
        {rangeValues.map((rangeValue: number, index, list) =>
          Boolean(onUpdateRangeValue) ? (
            <input
              key={`range__value-${rangeValue}`}
              className={styles['range__input__range-values__input']}
              type="number"
              min={list[index - 1] || 0}
              max={list[index + 1] || undefined}
              defaultValue={rangeValue}
              onChange={(event) => handleOnUpdateRangeValue(index, +event.target.value)}
            />
          ) : (
            <label
              key={`range__value-${rangeValue}`}
              className={styles['range__input__range-values__label']}
              style={{ left: `${Math.round((rangeValue * 100) / maxValue)}%` }}
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
