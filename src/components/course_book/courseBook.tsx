import React from 'react';
import book from '@/images/book.png';
import Image from 'next/image';
import Button from '../button/Button';
import { useRouter } from 'next/router';

const CourseBook = () => {
  const router = useRouter();
  return (
    <section className="cource-book">
      <h1 className="cource-book__title">
        Электронное
        <br /> методическое
        <br /> пособие
      </h1>

      <div className="cource-book__img">
        <Image src={book} alt="" priority />
      </div>

      <div className="cource-book__content">
        <p>
          В этом электронном <br />
          методическом <br />
          пособии вы найдете <br />
          значения арканов, <br />
          историю возникновения <br />
          колоды таро А. Уэйта <br />и расклады.
        </p>
        <p>
          Если в процессе работы
          <br /> с картами вам понадобится определенная информация, <br /> вы
          можете не пересматривать заново курс, а воспользоваться электронным
          пособием, максимально приближенным <br /> к курсу. Это позволит вам
          быстрее ориентироваться в раскладах.
        </p>
      </div>

      <div className="cource-book__button">
        <Button
          title="Скачать методичку"
          isLink
          href="/Omen_taro_book.pdf"
          download
          target="_blank"
        >
          <span className="cource-book__icon-download">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 22 24"
              fill="none"
            >
              <path
                d="M12 1.75C12 1.19772 11.5523 0.75 11 0.75C10.4477 0.75 10 1.19772 10 1.75L12 1.75ZM10.2929 16.1238C10.6834 16.5143 11.3166 16.5143 11.7071 16.1238L18.0711 9.75981C18.4616 9.36929 18.4616 8.73612 18.0711 8.3456C17.6805 7.95507 17.0474 7.95507 16.6569 8.3456L11 14.0025L5.34315 8.3456C4.95262 7.95507 4.31946 7.95507 3.92893 8.3456C3.53841 8.73612 3.53841 9.36929 3.92893 9.75981L10.2929 16.1238ZM10 1.75L10 15.4167L12 15.4167L12 1.75L10 1.75Z"
                fill="white"
              />
              <path
                d="M1.27783 17.6944V22.25H20.7223V17.6944"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </Button>
      </div>
      <div className="cource-book__button">
        <Button
          title="Назад"
          isLink
          href="/courses"
          className="button_ternary"
          onClick={() => router.back()}
        ></Button>
      </div>
    </section>
  );
};

export default CourseBook;
