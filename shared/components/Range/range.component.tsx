import { useCallback, useEffect, useRef, useState } from 'react';

import { getRealBulletValue, getBulletPositionRelativeToRangeSlider } from '@/shared/functions';

import styles from './range.module.scss';

const DEFAULT_MIN_RANGE = 0;
const DEFAULT_MAX_RANGE = 100;

type Props = {
  label: string;
  minValue: number;
  maxValue: number;
  onChangeMinLabelValue: (value: number) => void;
  onChangeMaxLabelValue: (value: number) => void;
  onChangeMinBulletValue: (min: number) => void;
  onChangeMaxBulletValue: (max: number) => void;
};

const Range = ({
  label,
  minValue = DEFAULT_MIN_RANGE,
  maxValue = DEFAULT_MAX_RANGE,
  onChangeMinLabelValue,
  onChangeMaxLabelValue,
  onChangeMinBulletValue,
  onChangeMaxBulletValue,
}: Props) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const minBulletRef = useRef<HTMLDivElement>(null);
  const maxBulletRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [minBulletValue, setMinBulletValue] = useState<number>(minValue);
  const [maxBulletValue, setMaxBulletValue] = useState<number>(maxValue);

  const updateMinBulletPosition = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rangeInput = inputRef.current;
      const minBullet = minBulletRef.current;

      if (isDragging && rangeInput && minBullet) {
        let valueRelativeToRange = getBulletPositionRelativeToRangeSlider(minBullet, rangeInput, event.clientX);

        const minRangeValue = minValue;
        const maxRangeValue = Math.min(maxBulletValue, maxValue);

        valueRelativeToRange = Math.max(minRangeValue, valueRelativeToRange);
        valueRelativeToRange = Math.min(maxRangeValue, valueRelativeToRange);

        const numToSendRounded = getRealBulletValue(maxValue, valueRelativeToRange);

        onChangeMinBulletValue(numToSendRounded);
        setMinBulletValue(valueRelativeToRange);
      }
    },
    [isDragging, maxBulletValue, minValue, maxValue, onChangeMinBulletValue]
  );

  const updateMaxBulletPosition = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rangeInput = inputRef.current;
      const maxBullet = maxBulletRef.current;

      if (isDragging && rangeInput && maxBullet) {
        let valueRelativeToRange = getBulletPositionRelativeToRangeSlider(maxBullet, rangeInput, event.clientX);

        const minRangeValue = Math.max(minValue, minBulletValue);
        const maxRangeValue = maxValue;

        valueRelativeToRange = Math.max(minRangeValue, valueRelativeToRange);
        valueRelativeToRange = Math.min(maxRangeValue, valueRelativeToRange);

        const numToSend = (maxValue * (valueRelativeToRange / 100)) / 1;
        const numToSendRounded = Math.round(numToSend * 100) / 100;

        onChangeMaxBulletValue(numToSendRounded);

        setMaxBulletValue(valueRelativeToRange);
      }
    },
    [isDragging, minBulletValue, minValue, maxValue, onChangeMaxBulletValue]
  );

  const handleOnStartDragging = useCallback(
    (event: React.MouseEvent<HTMLDivElement>, bullet: 'min' | 'max') => {
      setIsDragging(true);

      if (bullet === 'min') updateMinBulletPosition(event);
      else updateMaxBulletPosition(event);

      event.preventDefault();
    },
    [updateMaxBulletPosition, updateMinBulletPosition]
  );

  const handleOnEndDragging = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleOnEndDragging);

    return () => {
      document.removeEventListener('mouseup', handleOnEndDragging);
    };
  }, [handleOnEndDragging]);

  const handleOnChangeMinLabelValue = (value: number) => {
    onChangeMinLabelValue(value);
  };

  const handleOnChangeMaxLabelValue = (value: number) => {
    onChangeMaxLabelValue(value);
  };

  return (
    <div className={styles.range}>
      <label className={styles.range__label}>{label}</label>

      <div ref={inputRef} className={styles.range__input}>
        <div
          className={styles.range__input__selection}
          style={{ left: `${minBulletValue}%`, width: `calc(${maxBulletValue}% - ${minBulletValue}%)` }}
        />

        <div
          ref={minBulletRef}
          className={styles.range__input__bullet}
          style={{ left: `${minBulletValue}%` }}
          onMouseDown={(event) => handleOnStartDragging(event, 'min')}
          onMouseMove={updateMinBulletPosition}
        />

        <div
          ref={maxBulletRef}
          className={styles.range__input__bullet}
          style={{ left: `${maxBulletValue}%` }}
          onMouseDown={(event) => handleOnStartDragging(event, 'max')}
          onMouseMove={updateMaxBulletPosition}
        />
      </div>

      <div className={styles['range__input__range-values']}>
        <input
          className={styles['range__input__range-values__input']}
          type="number"
          min={0}
          max={maxValue}
          value={minValue}
          onChange={(event) => handleOnChangeMinLabelValue(+event.target.value)}
        />

        <input
          className={styles['range__input__range-values__input']}
          type="number"
          min={minValue}
          value={maxValue}
          onChange={(event) => handleOnChangeMaxLabelValue(+event.target.value)}
        />
      </div>
    </div>
  );
};

export { Range };
