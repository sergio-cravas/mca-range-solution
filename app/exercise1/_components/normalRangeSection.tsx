'use client';

import { useCallback, useState } from 'react';

import { Range } from '@/shared/components';

import styles from './normalRangeSection.module.scss';

type Props = {
  min: number;
  max: number;
};

const NormalRangeSection = ({ min: defaultMin, max: defaultMax }: Props) => {
  const [min, setMin] = useState<number>(defaultMin);
  const [max, setMax] = useState<number>(defaultMax);

  const [range, setRange] = useState<[number, number]>([defaultMin, defaultMax]);

  const onChangeMinThumbValue = useCallback((value: number) => {
    setRange((prev) => [value, prev[1]]);
  }, []);

  const onChangeMaxThumbValue = useCallback((value: number) => {
    setRange((prev) => [prev[0], value]);
  }, []);

  const handleOnUpdateRangeValue = (index: number, value: number) => {
    if (index === 0) setMin(value);
    else if (index === 1) setMax(value);
  };

  return (
    <div className={styles['normal-range-section']}>
      <Range
        label="Price range"
        rangeValues={[min, max]}
        onUpdateRangeValue={handleOnUpdateRangeValue}
        onChangeMinThumbValue={onChangeMinThumbValue}
        onChangeMaxThumbValue={onChangeMaxThumbValue}
      />

      <div>
        <strong>Range selected:</strong> From {range[0]} to {range[1]}
      </div>
    </div>
  );
};

export default NormalRangeSection;
