import course_hero from '@/images/cource-hero.png';
import Image from 'next/image';
import { useContext, useState } from 'react';
import { MainContext } from '@/contexts/MainContext';
import unsplashImage from '../../images/unsplashutbx9x3y8ly-2@2x.png';
import image3 from '../../images/image-3@2x.png';
import group2 from '../../images/group-2@2x.png';
import image4 from '../../images/image-4@2x.png';
import styles from '@/components/component1/component1.module.css';
import CourseLessons from '@/components/course_lessons/courseLessons';

interface CourseHeroProps {
  lessons?: any[];
}

const CourseHero = ({ lessons }: CourseHeroProps) => {
  const cc = useContext(MainContext);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <div className="root">
      <main className="">
        <Image
          className="unsplashutbx9x3y8ly-icon"
          alt="Background"
          src={unsplashImage}
          width={484}
          height={1853}
          priority
        />
        
        <section className="frame-child"></section>
        
        <Image
          className="image-3-icon"
          alt=""
          src={image3}
          width={584}
          height={283}
          priority
        />
        
        {/* <section className="frame-item"></section> */}
        
        {/* <Image
          className="frame-inner"
          alt=""
          src={group2}
          width={401}
          height={321}
        /> */}
      </main>
      
      <section className="root-inner">
        <div className="frame-parent">
          {/* Header внутри root с правильными отступами */}
          <header className={styles.frameGroup}>
            <div className={styles.frameWrapper}>
              <div className={styles.cosmoParent}>
                <h3 className={styles.cosmo}>Cosmo.</h3>
                <b className={styles.irena}>Irena</b>
              </div>
            </div>
            <div className={styles.frameContainer}>
              <a 
                className={styles.container}
                href="mailto:support@astro-irena.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={styles.div1}>Задать вопрос</div>
              </a>
              <div 
                className={styles.burgerMenu}
                style={{ cursor: 'pointer', marginLeft: '10px', position: 'relative', minWidth: 'fit-content' }}
              >
                <div className={styles.burgerLine}></div>
                <div className={styles.burgerLine}></div>
                <div className={styles.burgerLine}></div>
              </div>
            </div>
          </header>
          
          <div className="frame-div">
            <div className="frame-parent1">
              <div className="frame-parent2">
                <div className="parent">
                  <h3 className="cosmo">
                    <p className="p">Мы приветствуем</p>
                    <p className="p">вас на обучающем</p>
                    <p className="p">курсе, который</p>
                  </h3>
                  <h3 className="h31">
                    <p className="p">позволит</p>
                    <p className="p">вам изучить</p>
                    <p className="p">колоду</p>
                    <p className="p">А.Э.Уэйта.</p>
                  </h3>
                </div>
                
                <div className="div1">
                  <p className="p">
                    Здесь вы найдете информацию от истории таро до подробного
                    изучения Старших, Младших арканов и раскладов.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    Курс даст вам крепкую базу, основываясь на которой вы
                    сможете делать расклады себе и другим. По желанию вы можете
                    повторить обучение и закрепить знания. Либо воспользоваться
                    электронным пособием. Доступ к урокам остается на 6 месяцев.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">Желаем вам успехов!</p>
                </div>
              </div>
              
              <button className="enroll-now-only-50-wrapper">
                <b className="enroll-now-">Enroll Now - only $50</b>
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <section className="frame-section">
        <div className="frame-wrapper2">
          <div className="frame-wrapper3">
            <div className="cosmo-group">
              <h3 className="cosmo">Cosmo.</h3>
              <b className="irena1">Irena</b>
            </div>
          </div>
        </div>
      </section>
      
      {/* Секция cource-lessons bg-white внутри root */}
      <section className="cource-lessons bg-white">
        <CourseLessons lessons={lessons} />
        <div className="cource-bottom-bg"> </div>
      </section>
    </div>
);
};

export default CourseHero;
