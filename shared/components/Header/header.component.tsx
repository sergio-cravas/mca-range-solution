import Link from 'next/link';

import styles from './header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <Link href="/">Home</Link>
      <Link href="/exercise1">Exercise 1</Link>
      <Link href="/exercise2">Exercise 2</Link>
    </header>
  );
};

export { Header };
