import config from '@/shared/config';
import NormalRangeSection from './_components/normalRangeSection';

import styles from './page.module.scss';

const getMinAndMaxData = async () => {
  const response = await fetch(config.apiURL + '/normal-values', { next: { revalidate: 30 } }).then((data) => {
    if (!data?.ok) throw new Error('Failed at fetching data!');
    return data.json();
  });

  return { min: response?.min || 0, max: response?.max || 100 };
};

export default async function Page() {
  const { min, max } = await getMinAndMaxData();

  return (
    <div className={styles.exercise1}>
      <h1 className={styles.exercise1__title}>Normal Range</h1>

      <p className={styles.exercise1__description}>
        For the first exercise, the objective is to create a custom Range Input without the use of any html input tag.
        <br />
        <br />
        This component recieves an array of numbers, using the first one of its minimum value and the last one as the maximum.
        This array of values comes from a mocked http service, but it accepts values from any source, as long as they are passed
        by parameters.
        <br />
        <br />
        Also, you can update all this step values typing the new ones on the inputs below.
      </p>

      <NormalRangeSection min={min} max={max} />
    </div>
  );
}
