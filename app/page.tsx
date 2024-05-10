import { ButtonLink } from '@/shared/components';
import { GithubIcon, LinkedinIcon } from '@/shared/assets/icons';

import { HomeRange } from './_components/homeRange.component';

import styles from './page.module.scss';

export default function Page() {
  return (
    <div className={styles.home}>
      <h1 className={styles.home__title}>Range Input</h1>

      <HomeRange />

      <p className={styles.home__description}>
        {`Hi, I'm Sergio! Welcome to my solution of the technical test on MCA Spain. You can use the header links for navigate around the page and visit the two solutions of the exercises requested on the test.`}
        <br />
        <br />
        {`Also, you can use the two buttons below for visit the source code of this project and my Linkedin profile if you want to know more about my work.`}
        <br />
        <br />
        {`Greetings and have a nice day!`}
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
