import React from 'react';
import Button from '@/components/button/Button';
import Fire from '@/images/svg/about-fire.svg';

import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import { useRouter } from 'next/router';

const About = () => {
  const cc = useContext(MainContext);
  const router = useRouter();

  return (
    <section className="about">
      <div className="about__card bg-white">
        <h2>
          Это полноценный обучающий курс
          <br /> по колоде,
        </h2>
        <div className="about__fire">
          <Fire />
          {/* include /svg/about-fire.svg */}
        </div>
        <div className="about__subdesc">
          включающий в себя <br /> несколько максимально
          <br /> подробных источников информации. Он позволит вам самостоятельно
          изучить колоду и обойтись без дорогостоящего обучения в школах Таро. 
        </div>
        <div className="about__desc">
          Тысячи тарологов уже
          <br />
          применяют знания колоды
          <br />
          на практике, используя обучение
          <br />
          только на этом курсе.
        </div>
      </div>
      <div className="about__button">
        <Button
          title="Начать учиться"
          className="js-modal-open"
          data-modal="register"
          onClick={() => {
            if (cc?.token) {
              const onboarding = localStorage.getItem('onboarded');
              !onboarding && localStorage.setItem('onboarded', 'false');
              const shouldRedirect =
                onboarding === 'true' ? '/courses' : '/onboarding';

              router.push(shouldRedirect);
            } else {
              cc?.setModalOpen(true);
              cc?.setCurrentForm('register');
            }
          }}
        />
      </div>
    </section>
  );
};

export default About;
