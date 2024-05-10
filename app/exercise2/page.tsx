import config from '@/shared/config';

import FixedRangeSection from './_components/fixedRangeSection';

import styles from './page.module.scss';

const getRangeValuesData = async () => {
  const response = await fetch(config.apiURL + '/fixed-values', { next: { revalidate: 30 } }).then((response) => {
    if (!response?.ok) throw new Error('Failed at fetching data!');
    return response.json();
  });

  return { rangeValues: response?.rangeValues || [0, 100] };
};

export default async function Page() {
  const { rangeValues } = await getRangeValuesData();

  return (
    <div className={styles.exercise2}>
      <h1 className={styles.exercise2__title}>Fixed Values Range</h1>

      <p className={styles.exercise2__description}>
        For the second exercise, using the last component created I have extended its functionallity to allow only fixed ranges.
        <br />
        <br />
        On this component, you can&apos;t edit the step values, but instead it allows you to set only a fixed range of values.
        When you drag one thumb far away from a step point, it will reach the nearest one.
      </p>

      <FixedRangeSection rangeValues={rangeValues} />
    </div>
  );
}
