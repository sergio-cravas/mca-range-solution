import config from '@/shared/config';

import FixedRangeSection from './_components/fixedRangeSection';

import styles from './page.module.scss';

const getRangeValuesData = async () => {
  const response = await fetch(config.apiURL + '/fixed-values').then((response) => {
    if (!response?.ok) throw new Error('Failed at fetching data!');
    return response.json();
  });

  return { rangeValues: response?.rangeValues || [0, 100] };
};

export default async function Page() {
  const { rangeValues } = await getRangeValuesData();

  return (
    <div className={styles.excercise2}>
      <h1 className={styles.excercise2__title}>Fixed Values Range</h1>

      <ul className={styles.excercise2__description}>
        On this excercise, the objective is to create a custom input range (without using any HTML range input tag) with two
        bullets, one for a min value and another for the max value.
      </ul>

      <FixedRangeSection rangeValues={rangeValues} />
    </div>
  );
}
