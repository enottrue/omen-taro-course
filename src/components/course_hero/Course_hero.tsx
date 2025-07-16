import course_hero from '@/images/cource-hero.png';
import Image from 'next/image';
import { useContext, useState, useRef, useEffect } from 'react';
import { MainContext } from '@/contexts/MainContext';
import unsplashImage from '../../images/unsplashutbx9x3y8ly-2@2x.png';
import image3 from '../../images/image-3@2x.png';
import group2 from '../../images/group-2@2x.png';
import image4 from '../../images/image-4@2x.png';
import styles from '@/components/component1/component1.module.scss';
import CourseLessons from '@/components/course_lessons/courseLessons';
import Button from '../button/Button';

import { useStripePayment } from '@/hooks/useStripePayment';
import BurgerMenu from '../component1/BurgerMenu';

interface CourseHeroProps {
  lessons?: any[];
  token?: string | null;
  userId?: string | null;
}

const CourseHero = ({ lessons, token, userId }: CourseHeroProps) => {
  const cc = useContext(MainContext);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const burgerRef = useRef<HTMLDivElement>(null);
  const { handlePayment } = useStripePayment();
  
  // console.log('CourseHero lessons:', lessons);

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleEnrollClick = async () => {
    try {
      await handlePayment();
    } catch (error) {
      console.error('Payment error:', error);
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

  return (
    <div className="root">
      <div className="">
        <Image
          className="unsplashutbx9x3y8ly-icon"
          alt="Background"
          src={unsplashImage}
          width={484}
          height={1853}
          priority
        />        
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
      </div>
      
      <section className="root-inner">
        <div className="frame-parent">
          {/* Header с правильным дизайном */}
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
                href="mailto:support@astro-irena.com?subject=Вопрос по курсу Таро&body=Здравствуйте! У меня есть вопрос по курсу Таро:"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={styles.div1}>Ask a Question</div>
              </a>
              {!token ? (
                <div 
                  className={styles.wrapper}
                  onClick={() => {
                    cc?.setModalOpen(true);
                    cc?.setCurrentForm('auth');
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.div}>Sign In</div>
                </div>
              ) : (
                <div 
                  ref={burgerRef}
                  className={styles.burgerMenu}
                  onClick={handleBurgerClick}
                  style={{ cursor: 'pointer', marginLeft: '10px', position: 'relative', minWidth: 'fit-content' }}
                >
                  <div className={styles.burgerLine}></div>
                  <div className={styles.burgerLine}></div>
                  <div className={styles.burgerLine}></div>
                  <BurgerMenu isOpen={isBurgerOpen} onClose={handleBurgerClick} />
                </div>
              )}
            </div>
          </header>
          
          <div className="frame-div">
            <div className="frame-parent1">
              <div className="frame-parent2">
                <div className="parent">
                  <h3 className="cosmo">
                    <p className="p">We welcome you to the course that</p>
                  </h3>
                  <h3 className="h31">
                    <p className="p">will allow you to study the A.E. Waite deck</p>
                  </h3>
                </div>
                
                <div className="div1">
                  <p className="p">
                    Here you will find information from the history of tarot to a detailed study of the Major, Minor Arcana and spreads.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    The course will give you a solid foundation, based on which you will be able to do readings for yourself and others. If you wish, you can repeat the training and consolidate your knowledge. Or use the electronic manual. Access to the lessons remains for 6 months.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">We wish you success!</p>
                </div>
                {/* Figma-style button below description */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                  <a
                    href="#course-program"
                    className="enroll-now-only-50-wrapper enroll-now-"
                    style={{ textDecoration: 'none' }}
                  >
                    Watch Course Program
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
  
      
      {/* Секция cource-lessons bg-white внутри root */}
      {/* <section className="cource-lessons bg-white">
      <Image
          className={styles.wrapperGroup2Child}
          width={401.1}
          height={320.6}
          sizes="100vw"
          alt=""
          src={group2}
          priority
        />
        <CourseLessons lessons={lessons} />
        <div className="cource-bottom-bg"> </div>
      </section> */}

        <div className="frame-wrapper2">
          <div className="frame-wrapper3">
            <div className="cosmo-group">
              <h3 className="cosmo">Cosmo.</h3>
              <b className="irena1">Irena</b>
            </div>
          </div>
        </div>
    </div>
);
};

export default CourseHero;
