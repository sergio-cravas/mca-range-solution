import styles from './range.module.scss';

type Props = {
  label: string;
  rangeValues: { value: number; label: string; onChange?: (value: number) => void }[];
  onChangeRangeMin: (min: number) => void;
  onChangeRangeMax: (max: number) => void;
};

const Range = ({ label, rangeValues, onChangeRangeMin, onChangeRangeMax }: Props) => {
  return (
    <div className={styles.range}>
      <label className={styles.range__label}>{label}</label>

      <div className={styles.range__input}>
        <div className={styles['range__input__bullet']} style={{ left: '50%' }} />

        <div className={styles['range__input__bullet']} style={{ left: '0%' }} />
      </div>
    </div>
  );
};

export { Range };
