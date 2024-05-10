'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import debounce from 'lodash.debounce';

import { getRealBulletValue, getBulletPositionRelativeToRangeSlider, getClosestValueInArray } from '@/shared/functions';

import styles from './range.module.scss';

const DEFAULT_RANGE_VALUES = [0, 50, 100];

type Props = {
  label: string;
  rangeValues: number[];
  isFixedRange?: boolean;
  onUpdateRangeValue?: (prevIndex: number, newValue: number) => void;
  onChangeMinBulletValue: (min: number) => void;
  onChangeMaxBulletValue: (max: number) => void;
};

const Range = ({
  label,
  rangeValues = DEFAULT_RANGE_VALUES,
  isFixedRange,
  onUpdateRangeValue,
  onChangeMinBulletValue,
  onChangeMaxBulletValue,
}: Props) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const minBulletRef = useRef<HTMLDivElement>(null);
  const maxBulletRef = useRef<HTMLDivElement>(null);

  const minValue = useMemo(() => rangeValues[0], [rangeValues]);
  const maxValue = useMemo(() => rangeValues[rangeValues.length - 1], [rangeValues]);

  const [isDraggingMin, setIsDraggingMin] = useState<boolean>(false);
  const [isDraggingMax, setIsDraggingMax] = useState<boolean>(false);

  const [minBulletValue, setMinBulletValue] = useState<number>(minValue);
  const [maxBulletValue, setMaxBulletValue] = useState<number>(maxValue);

  const updateMinBulletPosition = useCallback(
    (valueRelativeToRange: number) => {
      const minRangeValue = 0;
      const maxRangeValue = Math.min(maxBulletValue, 100);

      valueRelativeToRange = Math.max(minRangeValue, valueRelativeToRange);
      valueRelativeToRange = Math.min(maxRangeValue, valueRelativeToRange);

      const numToSendRounded = getRealBulletValue(maxValue, valueRelativeToRange);

      onChangeMinBulletValue(numToSendRounded);
      setMinBulletValue(valueRelativeToRange);
    },
    [maxBulletValue, maxValue, onChangeMinBulletValue]
  );

  const updateMaxBulletPosition = useCallback(
    (valueRelativeToRange: number) => {
      const minRangeValue = Math.max(0, minBulletValue);
      const maxRangeValue = 100;

      valueRelativeToRange = Math.max(minRangeValue, valueRelativeToRange);
      valueRelativeToRange = Math.min(maxRangeValue, valueRelativeToRange);

      const numToSendRounded = getRealBulletValue(maxValue, valueRelativeToRange);

      onChangeMaxBulletValue(numToSendRounded);
      setMaxBulletValue(valueRelativeToRange);
    },
    [minBulletValue, maxValue, onChangeMaxBulletValue]
  );

  const handleOnMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>, bullet: 'min' | 'max') => {
      const rangeInput = inputRef.current;
      const minBullet = minBulletRef.current;
      const maxBullet = maxBulletRef.current;

      if (!rangeInput || !minBullet || !maxBullet) return;

      if (bullet === 'min' && isDraggingMin) {
        let valueRelativeToRange = getBulletPositionRelativeToRangeSlider(minBullet, rangeInput, event.clientX);
        updateMinBulletPosition(valueRelativeToRange);
      }

      if (bullet === 'max' && isDraggingMax) {
        let valueRelativeToRange = getBulletPositionRelativeToRangeSlider(maxBullet, rangeInput, event.clientX);
        updateMaxBulletPosition(valueRelativeToRange);
      }
    },
    [isDraggingMax, isDraggingMin, updateMaxBulletPosition, updateMinBulletPosition]
  );

  const handleOnStartDragging = useCallback(
    (event: React.MouseEvent<HTMLDivElement>, bullet: 'min' | 'max') => {
      if (bullet === 'min') setIsDraggingMin(true);
      else setIsDraggingMax(true);

      handleOnMouseMove(event, bullet);

      event.preventDefault();
    },
    [handleOnMouseMove]
  );

  const handleOnEndDragging = useCallback(() => {
    if (isDraggingMin && isFixedRange) {
      const newValue = getClosestValueInArray(minBulletValue, rangeValues);
      updateMinBulletPosition(newValue);
    }

    if (isDraggingMax && isFixedRange) {
      const newValue = getClosestValueInArray(maxBulletValue, rangeValues);
      updateMaxBulletPosition(newValue);
    }

    setIsDraggingMin(false);
    setIsDraggingMax(false);
  }, [
    rangeValues,
    isFixedRange,
    isDraggingMin,
    isDraggingMax,
    minBulletValue,
    maxBulletValue,
    updateMinBulletPosition,
    updateMaxBulletPosition,
  ]);

  useEffect(() => {
    document.addEventListener('mouseup', handleOnEndDragging);

    return () => {
      document.removeEventListener('mouseup', handleOnEndDragging);
    };
  }, [handleOnEndDragging]);

  const handleOnUpdateRangeValue = debounce((index: number, value) => {
    onUpdateRangeValue && onUpdateRangeValue(index, value);
  }, 250);

  return (
    <div className={styles['range']}>
      <label className={styles['range__label']}>{label}</label>

      <div ref={inputRef} className={styles['range__input']}>
        <div
          className={styles['range__input__selection']}
          style={{ left: `${minBulletValue}%`, width: `calc(${maxBulletValue}% - ${minBulletValue}%)` }}
        />

        <div
          ref={minBulletRef}
          className={styles['range__input__bullet']}
          style={{ left: `${minBulletValue}%` }}
          onMouseMove={(event) => handleOnMouseMove(event, 'min')}
          onMouseDown={(event) => handleOnStartDragging(event, 'min')}
        />

        <div
          ref={maxBulletRef}
          className={styles['range__input__bullet']}
          style={{ left: `${maxBulletValue}%` }}
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
              min={list[index - 1] || minValue}
              max={list[index + 1] || maxValue}
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
