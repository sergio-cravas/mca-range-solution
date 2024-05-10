import Link from 'next/link';

import styles from './buttonLink.module.scss';

type Props = {
  text: string;
  icon?: React.ReactNode;
  href: string;
  target?: React.HTMLAttributeAnchorTarget;
};

const ButtonLink = ({ text, icon, ...props }: Props) => {
  return (
    <Link className={styles['button-link']} {...props}>
      {icon}

      {text}
    </Link>
  );
};

export { ButtonLink };
