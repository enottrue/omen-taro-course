import Image from 'next/image';
import { useEffect } from 'react';
import { useMetrica } from 'next-yandex-metrica';
import HeroArrow from '@/images/svg/hero-arrow.svg';
import BigPlayBtn from '@/images/svg/big-play-btn.svg';
import HeroI from '@/images/hero.png';

export default function Hero() {
  const { reachGoal } = useMetrica();

  useEffect(() => {
    // Send Yandex Metrica event for homepage view
    reachGoal('homepage_viewed');
  }, [reachGoal]);

  return (
    <section className="hero">
      <div className="hero__grid">
        <div className="hero__desc">
          Обучающая
          <br /> колода таро
          <div className="hero__desc-name">А.Э.Уэйта</div>
        </div>
        <div className="hero__illustration">
          <div className="hero__illustration-arrow">
            <HeroArrow />
            {/* <Image src={HeroArrow} alt="Arcan" className="w-full" /> */}
          </div>
          <Image className="hero__img" src={HeroI} alt="" priority />
          <div className="hero__illustration-button">
            <BigPlayBtn />
            {/* <Image src={BigPlayBtn} alt="Arcan" className="w-full" /> */}
          </div>
        </div>
        <h1 className="hero__title">
          ВИДЕОКУРС
          <br /> И ЭЛЕКТРОННОЕ ПОСОБИЕ ПО РАБОТЕ С ТАРО
        </h1>
      </div>
    </section>
  );
}
