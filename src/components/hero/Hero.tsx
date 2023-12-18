import Image from 'next/image';
import HeroArrow from '@/images/svg/hero-arrow.svg';
import BigPlayBtn from '@/images/svg/big-play-btn.svg';
import HeroI from '@/images/hero.png';

export default function Hero() {
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
            <Image src={HeroArrow} alt="Arcan" className="w-full" />
          </div>
          <Image className="hero__img" src={HeroI} alt="" />
          <div className="hero__illustration-button">
            <Image src={BigPlayBtn} alt="Arcan" className="w-full" />
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
