'use client';

import { useCallback, useState } from 'react';

import { Range } from '@/shared/components';

import styles from './fixedRangeSection.module.scss';

type Props = {
  rangeValues: number[];
};

const FixedRangeSection = ({ rangeValues }: Props) => {
  const [range, setRange] = useState<[number, number]>([0, 100]);

  const onChangeMinThumbValue = useCallback((value: number) => {
    setRange((prev) => [value, prev[1]]);
  }, []);

  const onChangeMaxThumbValue = useCallback((value: number) => {
    setRange((prev) => [prev[0], value]);
  }, []);

  return (
    <div className={styles['fixed-range-section']}>
      <Range
        isFixedRange
        label="Price range"
        rangeValues={rangeValues}
        onChangeMinThumbValue={onChangeMinThumbValue}
        onChangeMaxThumbValue={onChangeMaxThumbValue}
      />

      <div>
        <strong>Range selected:</strong> From {range[0]} to {range[1]}
      </div>
    </div>
  );
};

export default FixedRangeSection;
