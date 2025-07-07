import React from 'react';
import Button from '@/components/button/Button';
import way1 from '@/images/way-1.png';
import way2 from '@/images/way-2.png';
import way3 from '@/images/way-3.png';
import way4 from '@/images/way-4.png';
import way5 from '@/images/way-5.png';

import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';

import Image from 'next/image';
import { useRouter } from 'next/router';

const Way = () => {
  const router = useRouter();
  const cc = useContext(MainContext);
  return (
    <section className="way">
      <div className="way__wrapper">
        <div className="way__image-1">
          <Image src={way1} alt="" priority />
        </div>

        <h2 className="way__title">Вас ждут:</h2>

        <div className="way__step way__step_1">
          <h3>Обучающие видеоуроки</h3>
          <ul>
            <li>Короткие, удобные уроки с таймкодами</li>
            <li>Понятная презентация без «говорящей головы»</li>
            <li>Субтитры и озвучка профессиональным диктором</li>
          </ul>
          <p>
            С помощью подробных видеоуроков вы научитесь правильно читать карты,
            толковать символы и элементы, делать простые и сложные расклады.
          </p>
        </div>
        <div className="way__image-2">
          <Image src={way2} alt="" />
        </div>

        <div className="way__step way__step_2">
          <h3>
            Электронное методическое пособие
            <br /> со значениями арканов,
          </h3>
          <p>историей возникновения колоды Таро А. Уэйта и раскладами</p>
          <p>
            Если вам нужна определенная информация, но нет времени
            пересматривать курс, вы можете воспользоваться электронным пособием,
            максимально приближенным к курсу.
          </p>
        </div>

        <div className="way__image-3">
          <Image src={way3} alt="" />
        </div>

        <div className="way__step way__step_3">
          <h3>Печатная методичка к колоде, которая является выжимкой</h3>
          <p>
            Если нужно быстро посмотреть значение <br /> карты, можно
            пользоваться бумажной методичкой со шпаргалками. Рекомендуем
            использовать ее для помощи в толковании раскладов после того, <br />{' '}
            как изучите материалы <br /> в электронном виде.
          </p>
        </div>

        <div className="way__image-4">
          <Image src={way4} alt="" />
        </div>

        <div className="way__step way__step_4">
          <h3>
            Особенная колода с подсказками <br /> на картах:
          </h3>
          <p>
            положительные значения, отрицательные значения <br /> и дополнения:
            значения здоровья и предупреждения.
          </p>
        </div>

        <div className="way__image-5">
          <Image src={way5} alt="" />
        </div>

        <div className="way__cards">
          <div className="way__cards-item bg-white">
            <div className="way__cards-item-title">Важно!</div>
            <div className="way__cards-item-number">01</div>
            <div className="way__cards-item-desc">
              Сначала пройдите курс, чтобы получить исчерпывающие знания по
              колоде.
            </div>
          </div>

          <div className="way__cards-item bg-white">
            <div className="way__cards-item-number">02</div>
            <div className="way__cards-item-desc">
              Затем используйте электронное пособие со значениями карт, чтобы
              закрепить материал.
            </div>
          </div>

          <div className="way__cards-item bg-white">
            <div className="way__cards-item-number">03</div>
            <div className="way__cards-item-desc">
              И после этого получайте подсказки прямо в процессе работы,
              используя печатное пособие и описания значений на картах.
            </div>
          </div>
        </div>

        <div className="way__bottom-desc">
          <p>Начните обучение прямо сейчас.</p>
          <p>Доступ к урока вы получите сразу после регистрации.</p>
        </div>

        <div className="way__greeting">
          Приятного
          <br /> обучения и успехов <br /> в мире таро!
        </div>

        <div className="way__button">
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
      </div>
    </section>
  );
};

export default Way;
