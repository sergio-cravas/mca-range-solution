'use client';

import { useCallback, useState } from 'react';

import { StepRange } from '@/shared/components/StepRange/stepRange.component';

import styles from '../page.module.scss';

type Props = {
  rangeValues: number[];
};

const FixedRangeSection = ({ rangeValues }: Props) => {
  const [range, setRange] = useState<[number, number]>([0, 100]);

  const onChangeMinBulletValue = useCallback((value: number) => {
    setRange((prev) => [value, prev[1]]);
  }, []);

  const onChangeMaxBulletValue = useCallback((value: number) => {
    setRange((prev) => [prev[0], value]);
  }, []);

  return (
    <div className={styles['excercise2__solution-links']}>
      <StepRange
        label="Price range"
        rangeValues={rangeValues}
        onChangeMinBulletValue={onChangeMinBulletValue}
        onChangeMaxBulletValue={onChangeMaxBulletValue}
      />

      <div>
        <strong>Range selected:</strong> From {range[0]} to {range[1]}
      </div>
    </div>
  );
};

export default FixedRangeSection;
