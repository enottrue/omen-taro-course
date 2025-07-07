import React, { useContext, useEffect, useRef } from 'react';
import Button from '@/components/button/Button'; // Replace with the actual path to your Button component
import ButtonArrow from '@/images/svg/button-arrow.svg'; // Replace with the actual path to your SVG component
import { useRouter } from 'next/router';
import { MainContext } from '@/contexts/MainContext';
import courseFinishHeader from '@/images/cource-finish-header.png';
import Image from 'next/image';
import { useState } from 'react';
import useUpdateUserData from '@/hooks/useUpdateUserData';
import Component1 from "../component1/component1";
import OnboardingMenuShell from '../component1/OnboardingMenuShell';


const OnboardingStages = () => {
  const [stage, setStage] = useState(0);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const burgerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const cc = useContext(MainContext);
  const { update, error, loading } = useUpdateUserData();

  const descriptions = [
    '',
    '',
    '',
    'Нажмите на название видео, чтобы перейти к просмотру:',
    'Используйте следующие кнопки, чтобы переключаться между уроками, либо вернуться в меню курса:',
    'После прохождения курса вы сможете скачать электронную методичку и получить именной сертификат:',
  ];

  const images: string[][] = [
    ['/onboarding/screen2.png'],
    ['/onboarding/screen3.png'],
    ['/onboarding/screen4.png'],
    ['/onboarding/screen5.png'],
    ['/onboarding/screen6.png'],
    ['/onboarding/screen7.png'],
  ];

  const skipButtonHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    // code logic here
    localStorage.setItem('onboarded', 'true');
    router.push('/courses');
  };
  const nextButtonHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    setStage(stage + 1);

    if (stage === descriptions.length) {
      localStorage.setItem('onboarded', 'true');
      router.push('/courses');
    }
  };

  const handleBurgerClick = () => {
    setIsBurgerOpen(!isBurgerOpen);
  };

  // Close burger menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (burgerRef.current && !burgerRef.current.contains(event.target as Node)) {
        setIsBurgerOpen(false);
      }
    };

    if (isBurgerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBurgerOpen]);

  const stages = descriptions.map((description, index) => (
    <div className="onboarding__item active" key={index}>
      <div className="onboarding__description">
        <p>{description}</p>
      </div>

      {images[index].map((src, i) => (
        <div className={`onboarding__image ${index + 1} mt-4`}>
          <Image
            key={i}
            src={`${src}`}
            alt={`Image ${i}`}
            width={'290'}
            height={'1000'}
          />
        </div>
      ))}

      <div
        className={`onboarding__buttons ${
          index === descriptions.length - 1 ? 'onboarding__buttons_last' : ''
        }`}
      >
        {index !== descriptions.length - 1 && (
          <Button
            title="Пропустить"
            isLink={true}
            className={`button_ternary button_little`}
            onClick={skipButtonHandler}
          />
        )}
        {index !== descriptions.length - 1 ? (
          <Button
            title="Далее"
            className="button_little js-onboarding-next"
            href={index === descriptions.length - 1 ? '/' : undefined}
            onClick={nextButtonHandler}
          >
            <span className="onboarding__button-icon">
              <ButtonArrow />
            </span>
          </Button>
        ) : (
          <Button
            title="Перейти к обучению"
            className="button_little js-onboarding-next"
            href={index === descriptions.length - 1 ? '/' : undefined}
            onClick={async () => {
              let a;
              if (cc?.user?.id) {
                a = await update({
                  id: cc?.user?.id,
                  onboarded: true,
                });
              }
              localStorage.setItem('onboarded', 'true');
              router.push('/courses');
            }}
          >
            <span className="onboarding__button-icon">
              <ButtonArrow />
            </span>
          </Button>
        )}
      </div>
    </div>
  ));

  return (
    <OnboardingMenuShell
      hideLoginButton={true}
      onBurgerClick={handleBurgerClick}
      isBurgerOpen={isBurgerOpen}
      burgerRef={burgerRef}
    >
    
      <div className="onboarding__content">
        {stage == 0 && (
          <div className="onboarding__item active">
            <div className="onboarding__description">
             <div className="onboarding__image">
               <Image
                 src="/onboarding/screen1.png"
                 alt="Onboarding Screen 1"
                 width={600} // Adjust the width as needed
                 height={400} // Adjust the height as needed
                 layout="responsive"
               />
             </div>
             {/* <p>Добро пожаловать на обучающий курс по колоде Уэйта, который идет в комплекте с колодой!</p> */}
            </div>
            <div className="onboarding__buttons">
              <Button
                title="Пропустить"
                isLink={true}
                className="button_ternary button_little"
                onClick={skipButtonHandler}
              />
              <Button
                title="Далее"
                className="button_little js-onboarding-next"
                onClick={nextButtonHandler}
              >
                <span className="onboarding__button-icon">
                  <ButtonArrow />
                </span>
              </Button>
            </div>
          </div>
        )}
        {stage > 0 && stages[stage - 1]}
      </div>
    </OnboardingMenuShell>
  );
};

export default OnboardingStages;
