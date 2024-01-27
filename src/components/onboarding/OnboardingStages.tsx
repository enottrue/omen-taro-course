import React, { useContext } from 'react';
import Button from '@/components/button/Button'; // Replace with the actual path to your Button component
import ButtonArrow from '@/images/svg/button-arrow.svg'; // Replace with the actual path to your SVG component
import { useRouter } from 'next/router';
import { MainContext } from '@/contexts/MainContext';
import courseFinishHeader from '@/images/cource-finish-header.png';
import Image from 'next/image';
import { useState } from 'react';
import useUpdateUserData from '@/hooks/useUpdateUserData';

const OnboardingStages = () => {
  const [stage, setStage] = useState(0);
  const router = useRouter();
  const cc = useContext(MainContext);
  const { update, error, loading } = useUpdateUserData();

  const descriptions = [
    'Для перехода между разделами сайта используйте меню в правом верхнем углу',
    'Каждый урок содержит несколько видео. Для того, чтобы перейти к просмотру, нажмите на стрелочку рядом с названием урока – откроется список видео:',
    'Используйте обозначения, чтобы ориентироваться в уроках и понимать, на каком видео вы остановились:',
    'Нажмите на название видео, чтобы перейти к просмотру:',
    'Используйте следующие кнопки, чтобы переключаться между уроками, либо вернуться в меню курса:',
    'После прохождения курса вы сможете скачать электронную методичку и получить именной сертификат:',
  ];

  const images: string[][] = [
    ['/onboarding/1.png'],
    ['/onboarding/2-1.png', '/onboarding/2-2.png'],
    ['/onboarding/3-1.png', '/onboarding/3-2.png'],
    ['/onboarding/4.png'],
    ['/onboarding/5-1.png', '/onboarding/5-2.png', '/onboarding/5-3.png'],
    ['/onboarding/6.png'],
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
            width={'375'}
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
    <section className="onboarding">
      <h1>Начало работы</h1>
      {stage == 0 && (
        <div className="onboarding__item active">
          <div className="onboarding__description">
            <p>
              Добро пожаловать на обучающий курс по колоде Уэйта, который идет в
              комплекте с колодой!
            </p>
            <p>
              Прежде, чем начать обучение – предлагаем ознакомиться с тем, как
              устроен сайт, чтобы обучение было быстрым и эффективным.
            </p>
            <p>
              Если возникнут вопросы, вы можете задать их в нашем боте в
              Telegram по кнопке на верхней панели
            </p>
          </div>

          {/* <div className="onboarding__image">
            <Image src={courseFinishHeader} alt="" />
          </div> */}

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
    </section>
  );
};

export default OnboardingStages;
