import Link from 'next/link';
import styles from './page.module.scss';

export default function Page() {
  return (
    <div className={styles.home}>
      <h1 className={styles.home__title}>Range component selector</h1>

      <p className={styles.home__description}>
        Hi, I'm Sergio! And wellcome to my technical interview solution for MCA Spain. Below you have the access for the two
        versions of my project:
      </p>

      <div className={styles['home__solution-links']}>
        <Link href="/exercise1">Solución 1</Link>

        <Link href="/exercise2">Solución 2</Link>
      </div>
    </div>
  );
}
