import Link from 'next/link';

import styles from './header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <Link className={styles.header__link} href="/">
        Home
      </Link>

      <Link className={styles.header__link} href="/exercise1">
        Exercise 1
      </Link>

      <Link className={styles.header__link} href="/exercise2">
        Exercise 2
      </Link>
    </header>
  );
};

export { Header };
