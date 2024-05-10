'use client';

import { Range } from '@/shared/components';

import styles from './homeRange.module.scss';

export const HomeRange = () => {
  return (
    <div className={styles['home-range']}>
      <Range rangeValues={[0, 50, 100]} onChangeMinThumbValue={() => {}} onChangeMaxThumbValue={() => {}} />
    </div>
  );
};
