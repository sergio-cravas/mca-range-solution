import { useRef, useState } from 'react';
import styles from './range.module.scss';

type Props = {
  label: string;
  rangeValues: { value: number; label: string; onChange?: (value: number) => void }[];
  onChangeRangeMin: (min: number) => void;
  onChangeRangeMax: (max: number) => void;
};

const Range = ({ label, rangeValues, onChangeRangeMin, onChangeRangeMax }: Props) => {
  const inputRef = useRef<HTMLDivElement>(null);

  const [minValue, setMinValue] = useState<number>(rangeValues[0].value || 0);
  const [maxValue, setMaxValue] = useState<number>(rangeValues[rangeValues.length - 1].value || 100);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleOnMoveMin = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const percent = (x / rect.width) * 100;

      const newValue = Math.max(0, Math.min(maxValue, Math.round((percent / 100) * 100)));
      setMinValue(newValue);
    }
  };

  const handleOnMoveMax = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const percent = (x / rect.width) * 100;

      const newValue = Math.max(minValue, Math.min(100, Math.round((percent / 100) * 100)));
      setMaxValue(newValue);
    }
  };

  return (
    <div className={styles.range}>
      <label className={styles.range__label}>{label}</label>

      <div
        ref={inputRef}
        className={styles.range__input}
        onMouseUp={() => setIsDragging(false)}
        onMouseDown={() => setIsDragging(true)}
      >
        <div
          className={styles.range__input__selection}
          style={{ left: `${minValue}%`, width: `calc(${maxValue}% - ${minValue}%)` }}
        />

        <div onMouseMove={handleOnMoveMin} className={styles.range__input__bullet} style={{ left: `${minValue}%` }} />

        <div onMouseMove={handleOnMoveMax} className={styles.range__input__bullet} style={{ left: `${maxValue}%` }} />

        <div className={styles['range__input__range-values']}>
          {rangeValues.map((value, index) => (
            <span key={`range_value-label_${index}`}>{value.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export { Range };
