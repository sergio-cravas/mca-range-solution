import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './range.module.scss';

type Props = {
  label: string;
  rangeValues: { value: number; onChange?: (value: number) => void }[];
  onChangeRangeMin: (min: number) => void;
  onChangeRangeMax: (max: number) => void;
};

const Range = ({ label, rangeValues, onChangeRangeMin, onChangeRangeMax }: Props) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const minBulletRef = useRef<HTMLDivElement>(null);
  const maxBulletRef = useRef<HTMLDivElement>(null);

  const initialMinRangeValue = rangeValues[0].value || 0;
  const initialMaxRangeValue = rangeValues[rangeValues.length - 1].value || 100;

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [minValue, setMinValue] = useState<number>(initialMinRangeValue);
  const [maxValue, setMaxValue] = useState<number>(initialMaxRangeValue);

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

        const minRangeValue = initialMinRangeValue;
        const maxRangeValue = Math.min(maxValue, initialMaxRangeValue);

        finalPosition = Math.max(minRangeValue, finalPosition);
        finalPosition = Math.min(maxRangeValue, finalPosition);

        onChangeRangeMin(initialMinRangeValue * (1 + finalPosition / 100));
        setMinValue(finalPosition);
      }
    },
    [isDragging, maxValue, initialMinRangeValue, initialMaxRangeValue, onChangeRangeMin]
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

        const minRangeValue = Math.max(initialMinRangeValue, minValue);
        const maxRangeValue = initialMaxRangeValue;

        finalPosition = Math.max(minRangeValue, finalPosition);
        finalPosition = Math.min(maxRangeValue, finalPosition);

        onChangeRangeMax(initialMinRangeValue * (1 + finalPosition / 100));

        if (finalPosition === initialMaxRangeValue) finalPosition -= Math.round((bulletHalfWidth / sliderWidth) * 100);

        setMaxValue(finalPosition);
      }
    },
    [isDragging, minValue, initialMinRangeValue, initialMaxRangeValue, onChangeRangeMax]
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

        <div className={styles['range__input__range-values']}>
          {rangeValues.map((value, index) =>
            Boolean(value.onChange) ? (
              <input
                key={`range_value-input_${index}`}
                type="number"
                className={styles['range__input__range-values__input']}
                value={value.value}
                onChange={(event) => value.onChange && value.onChange(+event.target.value)}
              />
            ) : (
              <span key={`range_value-label_${index}`} className={styles['range__input__range-values__label']}>
                {value.value}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export { Range };
