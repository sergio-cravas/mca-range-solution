'use client';

import { useState } from 'react';

import { Range } from '@/shared/components/Range/range.component';

import styles from './page.module.scss';

export default function Page() {
  const [min, setMin] = useState<number>(0);
  const [max, setMax] = useState<number>(100);

  const [range, setRange] = useState<[number, number]>([0, 0]);

  return (
    <div className={styles.excercise1}>
      <h1 className={styles.excercise1__title}>Normal Range</h1>

      <ul className={styles.excercise1__description}>
        On this excercise, the objective is to create a custom input range (without using any HTML range input tag) with two
        bullets, one for a min value and another for the max value.
      </ul>

      <div className={styles['excercise1__solution-links']}>
        <Range
          label="Price range"
          rangeValues={[
            { value: min, label: `${min}€`, onChange: setMin },
            { value: max, label: `${max}€`, onChange: setMax },
          ]}
          onChangeRangeMin={(value) => setRange((prev) => [value, prev[1]])}
          onChangeRangeMax={(value) => setRange((prev) => [prev[0], value])}
        />
      </div>
    </div>
  );
}