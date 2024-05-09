import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import styles from './range.module.scss';

type Props = {
  label: string;
  minValue: number;
  maxValue: number;
  onChangeMinValue: (value: number) => void;
  onChangeMaxValue: (value: number) => void;
  onChangeMinBulletValue: (min: number) => void;
  onChangeMaxBulletValue: (max: number) => void;
};

const Range = ({
  label,
  minValue = 0,
  maxValue = 100,
  onChangeMinValue,
  onChangeMaxValue,
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
        const clickPosition = event.clientX;
        const sliderWidth = rangeInput.offsetWidth;
        const bulletHalfWidth = minBullet.offsetWidth / 2;
        const initialPosition = inputRef.current.getBoundingClientRect().left;

        let finalPosition = Math.round(((clickPosition - initialPosition - bulletHalfWidth) / sliderWidth) * 100);

        const minRangeValue = minValue;
        const maxRangeValue = Math.min(maxBulletValue, maxValue);

        finalPosition = Math.max(minRangeValue, finalPosition);
        finalPosition = Math.min(maxRangeValue, finalPosition);

        const numToSend = (maxValue * (finalPosition / 100)) / 1;
        const numToSendRounded = Math.round(numToSend * 100) / 100;

        onChangeMinBulletValue(numToSendRounded);
        setMinBulletValue(finalPosition);
      }
    },
    [isDragging, minValue, maxBulletValue, maxValue, onChangeMinBulletValue]
  );

  const updateMaxBulletPosition = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rangeInput = inputRef.current;
      const maxBullet = maxBulletRef.current;

      if (isDragging && rangeInput && maxBullet) {
        const clickPosition = event.clientX;
        const sliderWidth = rangeInput.offsetWidth;
        const bulletHalfWidth = maxBullet.offsetWidth / 2;
        const initialPosition = inputRef.current.getBoundingClientRect().left;

        let finalPosition = Math.round(((clickPosition - initialPosition - bulletHalfWidth) / sliderWidth) * 100);

        const minRangeValue = Math.max(minValue, minBulletValue);
        const maxRangeValue = maxValue;

        finalPosition = Math.max(minRangeValue, finalPosition);
        finalPosition = Math.min(maxRangeValue, finalPosition);

        const numToSend = (maxValue * (finalPosition / 100)) / 1;
        const numToSendRounded = Math.round(numToSend * 100) / 100;

        onChangeMaxBulletValue(numToSendRounded);

        if (finalPosition === maxValue) finalPosition -= Math.round((bulletHalfWidth / sliderWidth) * 100);

        setMaxBulletValue(finalPosition);
      }
    },
    [isDragging, minValue, minBulletValue, maxValue, onChangeMaxBulletValue]
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

  return (
    <div className={styles.range}>
      <label className={styles.range__label}>{label}</label>

      <div ref={inputRef} className={styles.range__input}>
        <div
          className={styles.range__input__selection}
          style={{ left: `${minValue}%`, width: `calc(${maxValue}% - ${minValue}%)` }}
        />

        <div
          ref={minBulletRef}
          className={styles.range__input__bullet}
          style={{ left: `${minValue}%` }}
          onMouseDown={(event) => handleOnStartDragging(event, 'min')}
          onMouseMove={updateMinBulletPosition}
        />

        <div
          ref={maxBulletRef}
          className={styles.range__input__bullet}
          style={{ left: `${maxValue}%` }}
          onMouseDown={(event) => handleOnStartDragging(event, 'max')}
          onMouseMove={updateMaxBulletPosition}
        />
      </div>

      <div className={styles['range__input__range-values']}>
        <input
          type="number"
          className={styles['range__input__range-values__input']}
          value={minValue}
          onChange={(event) => onChangeMinValue(+event.target.value)}
        />

        <input
          type="number"
          className={styles['range__input__range-values__input']}
          value={maxValue}
          onChange={(event) => onChangeMaxValue(+event.target.value)}
        />
      </div>
    </div>
  );
};

export { Range };
