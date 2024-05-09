import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { getRealBulletValue, getBulletPositionRelativeToRangeSlider } from '@/shared/functions';

import styles from './stepRange.module.scss';

const DEFAULT_RANGE_VALUES = [0, 50, 100];

type Props = {
  label: string;
  rangeValues: number[];
  onChangeMinBulletValue: (min: number) => void;
  onChangeMaxBulletValue: (max: number) => void;
};

const StepRange = ({ label, rangeValues = DEFAULT_RANGE_VALUES, onChangeMinBulletValue, onChangeMaxBulletValue }: Props) => {
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
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rangeInput = inputRef.current;
      const minBullet = minBulletRef.current;

      if (isDraggingMin && rangeInput && minBullet) {
        let valueRelativeToRange = getBulletPositionRelativeToRangeSlider(minBullet, rangeInput, event.clientX);

        const minRangeValue = 0;
        const maxRangeValue = Math.min(maxBulletValue, 100);

        valueRelativeToRange = Math.max(minRangeValue, valueRelativeToRange);
        valueRelativeToRange = Math.min(maxRangeValue, valueRelativeToRange);

        const numToSendRounded = getRealBulletValue(maxValue, valueRelativeToRange);

        onChangeMinBulletValue(numToSendRounded);
        setMinBulletValue(valueRelativeToRange);
      }
    },
    [isDraggingMin, maxBulletValue, maxValue, onChangeMinBulletValue]
  );

  const updateMaxBulletPosition = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rangeInput = inputRef.current;
      const maxBullet = maxBulletRef.current;

      if (isDraggingMax && rangeInput && maxBullet) {
        let valueRelativeToRange = getBulletPositionRelativeToRangeSlider(maxBullet, rangeInput, event.clientX);

        const minRangeValue = Math.max(0, minBulletValue);
        const maxRangeValue = 100;

        valueRelativeToRange = Math.max(minRangeValue, valueRelativeToRange);
        valueRelativeToRange = Math.min(maxRangeValue, valueRelativeToRange);

        const numToSendRounded = getRealBulletValue(maxValue, valueRelativeToRange);

        onChangeMaxBulletValue(numToSendRounded);
        setMaxBulletValue(valueRelativeToRange);
      }
    },
    [isDraggingMax, minBulletValue, maxValue, onChangeMaxBulletValue]
  );

  const handleOnStartDragging = useCallback(
    (event: React.MouseEvent<HTMLDivElement>, bullet: 'min' | 'max') => {
      if (bullet === 'min') {
        setIsDraggingMin(true);
        updateMinBulletPosition(event);
      } else {
        setIsDraggingMax(true);
        updateMaxBulletPosition(event);
      }

      event.preventDefault();
    },
    [updateMaxBulletPosition, updateMinBulletPosition]
  );

  const handleOnEndDragging = useCallback(() => {
    setIsDraggingMin(false);
    setIsDraggingMax(false);

    setMinBulletValue(20);
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleOnEndDragging);

    return () => {
      document.removeEventListener('mouseup', handleOnEndDragging);
    };
  }, [handleOnEndDragging]);

  return (
    <div className={styles['step-range']}>
      <label className={styles['step-range__label']}>{label}</label>

      <div ref={inputRef} className={styles['step-range__input']}>
        <div
          className={styles['step-range__input__selection']}
          style={{ left: `${minBulletValue}%`, width: `calc(${maxBulletValue}% - ${minBulletValue}%)` }}
        />

        <div
          ref={minBulletRef}
          className={styles['step-range__input__bullet']}
          style={{ left: `${minBulletValue}%` }}
          onMouseDown={(event) => handleOnStartDragging(event, 'min')}
          onMouseMove={updateMinBulletPosition}
        />

        <div
          ref={maxBulletRef}
          className={styles['step-range__input__bullet']}
          style={{ left: `${maxBulletValue}%` }}
          onMouseDown={(event) => handleOnStartDragging(event, 'max')}
          onMouseMove={updateMaxBulletPosition}
        />
      </div>

      <div className={styles['step-range__input__range-values']}>
        {rangeValues.map((rangeValue: number) => (
          <label key={`step-range__value-${rangeValue}`} className={styles['step-range__input__range-values__item']}>
            {rangeValue}
          </label>
        ))}
      </div>
    </div>
  );
};

export { StepRange };
