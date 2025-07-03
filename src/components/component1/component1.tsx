import type { NextPage } from "next";
import Image from "next/image";
import styles from "./component1.module.css";
import unsplashImage from "../../images/back@2x.png";
import image3 from "../../images/image-3@2x.png";
import group2 from "../../images/group-2@2x.png";
import { Button } from "../ui";

export type Component1Type = {
  className?: string;
  onOpenModal?: () => void;
  onOpenRegisterModal?: () => void;
};

const Component1: NextPage<Component1Type> = ({ className = "", onOpenModal, onOpenRegisterModal }) => {
  return (
    <section className={[styles.section, className].join(" ")}>
      <div className={styles.wrapperImage3}>
        <Image
          className={styles.image3Icon}
          loading="lazy"
          width={583.6}
          height={283.2}
          sizes="100vw"
          alt=""
          src={image3}
        />
      </div>
      <div className={styles.wrapperGroup2}>
        <Image
          className={styles.wrapperGroup2Child}
          width={401.1}
          height={320.6}
          sizes="100vw"
          alt=""
          src={group2}
          priority
        />
      </div>
      <div className={styles.noMoreGuessingContainer}>
        <p className={styles.noMoreGuessing}>No more guessing -</p>
        <p className={styles.noMoreGuessing}>&nbsp;</p>
        <p className={styles.noMoreGuessing}>
          Become the one who decodes your own destiny.
        </p>
        <p className={styles.noMoreGuessing}>
          Learn to read your birth chart and unlock real opportunities.
        </p>
      </div>
      <div className={styles.frameParent}>
        <header className={styles.frameGroup}>
          <div className={styles.frameWrapper}>
            <div className={styles.cosmoParent}>
              <h3 className={styles.cosmo}>Cosmo.</h3>
              <b className={styles.irena}>Irena</b>
            </div>
          </div>
          <div className={styles.frameContainer}>
            <div 
              className={styles.wrapper}
              onClick={onOpenModal}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.div}>Вход</div>
            </div>
            
            <a 
              className={styles.container}
              href="https://t.me/salacoste"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={styles.div1}>Задать вопрос</div>
            </a>
          </div>
        </header>
        <div className={styles.frameDiv}>
          <div className={styles.yourMoneyIsInYourParent}>
            <h1 className={styles.cosmo}>
              <p className={styles.noMoreGuessing}>{`Your Money `}</p>
              <p className={styles.noMoreGuessing}>{`Is in Your `}</p>
            </h1>
            <h2 className={styles.birthChart}>Birth Chart</h2>
          </div>
        </div>
      </div>
      {/* <div className={styles.isAPersonalized}>
        is a personalized exploration of your birth chart, uncovering hidden
        potential and helping you overcome inner obstacles. You'll receive
        tailored guidance based on your unique astrological blueprint.
      </div> */}
      <div className={styles.frameDiv}>
        <Button variant="enroll" onClick={onOpenRegisterModal}>
          Enroll Now - only $50
        </Button>
      </div>
    </section>
  );
};

export default Component1;
