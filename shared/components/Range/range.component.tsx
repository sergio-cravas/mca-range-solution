import styles from './range.module.scss';

type Props = {
  label: string;
  min: { value: number; label: string; onChange: (value: number) => void };
  max: { value: number; label: string; onChange: (value: number) => void };
};

const Range = ({ label, min, max }: Props) => {
  return (
    <div className={styles.range}>
      <label className={styles.range__label}>{label}</label>

      <div>
        {min.label} - {max.label}
      </div>
    </div>
  );
};

export { Range };
