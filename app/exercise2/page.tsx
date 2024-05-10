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
        On this exercise, the objective is to create a custom input range (without using any HTML range input tag) with two
        thumbs, one for a min value and another for the max value.
      </p>

      <FixedRangeSection rangeValues={rangeValues} />
    </div>
  );
}
