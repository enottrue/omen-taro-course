import React, { useContext, useEffect, useRef } from 'react';
import Button from '@/components/button/Button';
import OnboardingButton from './OnboardingButton';
import { useRouter } from 'next/router';
import { MainContext } from '@/contexts/MainContext';
import courseFinishHeader from '@/images/cource-finish-header.png';
import Image from 'next/image';
import { useState } from 'react';
import useUpdateUserData from '@/hooks/useUpdateUserData';
import Component1 from "../component1/component1";
import OnboardingMenuShell from '../component1/OnboardingMenuShell';
import './onboarding.scss';

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
    '',
    '',
    '',
  ];

  const images: string[][] = [
    ['/onboarding/screen2.png'],
    ['/onboarding/screen3.png'],
    ['/onboarding/screen4.png'],
    ['/onboarding/screen3.png'],
    ['/onboarding/screen2.png'],
    ['/onboarding/screen1.png'],
  ];

  const skipButtonHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
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

  const finishButtonHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (cc?.user?.id) {
      await update({
        id: cc?.user?.id,
        onboarded: true,
      });
    }
    localStorage.setItem('onboarded', 'true');
    router.push('/courses');
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
        <div className={`onboarding__image ${index + 1} mt-4`} key={i}>
          <Image
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
          <OnboardingButton
            type="skip"
            onClick={skipButtonHandler}
          />
        )}
        {index !== descriptions.length - 1 ? (
          <OnboardingButton
            type="next"
            onClick={nextButtonHandler}
          />
        ) : (
          <OnboardingButton
            type="finish"
            onClick={finishButtonHandler}
            loading={loading}
          />
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
                 width={600}
                 height={400}
                 layout="responsive"
               />
             </div>
            </div>
            <div className="onboarding__buttons">
              <OnboardingButton
                type="skip"
                onClick={skipButtonHandler}
              />
              <OnboardingButton
                type="next"
                onClick={nextButtonHandler}
              />
            </div>
          </div>
        )}
        {stage > 0 && stages[stage - 1]}
      </div>
    </OnboardingMenuShell>
  );
};

export default OnboardingStages;
