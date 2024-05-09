'use client';

import { useState } from 'react';

import { Range } from '@/shared/components/Range/range.component';

import styles from './page.module.scss';
import { StepRange } from '@/shared/components/StepRange/stepRange.component';

export default function Page() {
  const [range, setRange] = useState<[number, number]>([0, 100]);
  const [rangeValues, setRangeValues] = useState<number[]>([0, 25, 50, 75, 100]);

  const onChangeMinBulletValue = (value: number) => {
    setRange((prev) => [value, prev[1]]);
  };

  const onChangeMaxBulletValue = (value: number) => {
    setRange((prev) => [prev[0], value]);
  };

  return (
    <div className={styles.excercise1}>
      <h1 className={styles.excercise1__title}>Fixed Values Range</h1>

      <ul className={styles.excercise1__description}>
        On this excercise, the objective is to create a custom input range (without using any HTML range input tag) with two
        bullets, one for a min value and another for the max value.
      </ul>

      <div className={styles['excercise1__solution-links']}>
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
    </div>
  );
}
