'use client';

import { useCallback, useState } from 'react';

import { Range } from '@/shared/components/Range/range.component';

import styles from '../page.module.scss';

type Props = {
  min: number;
  max: number;
};

const NormalRangeSection = ({ min: defaultMin, max: defaultMax }: Props) => {
  const [min, setMin] = useState<number>(defaultMin);
  const [max, setMax] = useState<number>(defaultMax);

  const [range, setRange] = useState<[number, number]>([defaultMin, defaultMax]);

  const onChangeMinBulletValue = useCallback((value: number) => {
    setRange((prev) => [value, prev[1]]);
  }, []);

  const onChangeMaxBulletValue = useCallback((value: number) => {
    setRange((prev) => [prev[0], value]);
  }, []);

  return (
    <div className={styles['excercise1__solution-links']}>
      <Range
        label="Price range"
        minValue={min}
        maxValue={max}
        onChangeMinLabelValue={setMin}
        onChangeMaxLabelValue={setMax}
        onChangeMinBulletValue={onChangeMinBulletValue}
        onChangeMaxBulletValue={onChangeMaxBulletValue}
      />

      <div>
        <strong>Range selected:</strong> From {range[0]} to {range[1]}
      </div>
    </div>
  );
};

export default NormalRangeSection;
