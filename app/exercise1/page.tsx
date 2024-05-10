import config from '@/shared/config';
import NormalRangeSection from './_components/normalRangeSection';

import styles from './page.module.scss';

const getMinAndMaxData = async () => {
  const response = await fetch(config.apiURL + '/normal-values').then((data) => {
    if (!data?.ok) throw new Error('Failed at fetching data!');
    return data.json();
  });

  return { min: response?.min || 0, max: response?.max || 100 };
};

export default async function Page() {
  const { min, max } = await getMinAndMaxData();

  return (
    <div className={styles.excercise1}>
      <h1 className={styles.excercise1__title}>Normal Range</h1>

      <ul className={styles.excercise1__description}>
        On this excercise, the objective is to create a custom input range (without using any HTML range input tag) with two
        thumbs, one for a min value and another for the max value.
      </ul>

      <NormalRangeSection min={min} max={max} />
    </div>
  );
}
