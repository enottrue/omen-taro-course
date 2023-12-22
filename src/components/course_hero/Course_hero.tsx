import course_hero from '@/images/cource-hero.png';
import Image from 'next/image';

const CourseHero = () => (
  <section className="cource-hero">
    <div className="cource-hero__wrapper">
      <div className="cource-hero__wrapper-img">
        {/* <img src={course_hero} alt="" /> */}
        <Image src={course_hero} alt="" priority />
      </div>

      <div className="cource-hero__content">
        <h1 className="cource-hero__content-title">
          <strong>Мы приветствуем вас на обучающем курсе,</strong> который
          позволит вам изучить колоду А.Э.Уэйта.
        </h1>

        <p>
          Здесь вы найдете информацию от истории таро до подробного изучения
          Старших, Младших арканов и раскладов.
        </p>

        <p>
          Курс даст вам крепкую базу, основываясь на которой вы сможете делать
          расклады себе и другим. По желанию вы можете повторить обучение и
          закрепить знания. Либо воспользоваться электронным пособием. Доступ к
          урокам остается на 6 месяцев.
        </p>

        <p>
          <strong>Желаем вам успехов!</strong>
        </p>
      </div>
    </div>
  </section>
);

export default CourseHero;
