import { GithubIcon, LinkedinIcon } from '@/shared/assets/icons';
import { ButtonLink } from '@/shared/components/Link/buttonLink.component';

import styles from './page.module.scss';

export default function Page() {
  return (
    <div className={styles.home}>
      <h1 className={styles.home__title}>Range component selector</h1>

      <p className={styles.home__description}>
        Hi, I&apos;m Sergio! And wellcome to my technical interview solution for MCA Spain. Below you have the access for the
        two versions of my project:
      </p>

      <div className={styles['home__solution-links']}>
        <ButtonLink
          text="Source code"
          target="_blank"
          icon={<GithubIcon size={24} color="#ffffff" />}
          href="https://github.com/sergio-cravas/mca-range-solution"
        />

        <ButtonLink
          text="Linkedin"
          target="_blank"
          icon={<LinkedinIcon size={24} color="#ffffff" />}
          href="https://www.linkedin.com/in/sergio-cerda-hervas/"
        />
      </div>
    </div>
  );
}
