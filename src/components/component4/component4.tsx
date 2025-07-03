import type { NextPage } from "next";
import Image from "next/image";
import styles from "./component4.module.css";
import { Button } from "../ui";
import unsplashImage from "../../images/back@2x.png";

export type Component4Type = {
  className?: string;
  onOpenAuthModal?: () => void;
};

const Component4: NextPage<Component4Type> = ({ className = "", onOpenAuthModal }) => {
  return (
    <section className={[styles.section, className].join(" ")}>
      <div className={styles.wrapperUnsplashutbx9x3y8ly}>
        <Image
          className={styles.unsplashutbx9x3y8lyIcon}
          loading="lazy"
          width={348}
          height={-905}
          sizes="100vw"
          alt=""
          src={unsplashImage}
        />
      </div>
      <div className={styles.frameParent}>
        <div className={styles.youllLearnParent}>
          <h2 className={styles.youllLearn}>{`You'll Learn `}</h2>
          <h2 className={styles.howTo}>How To:</h2>
        </div>
        <div className={styles.decodeFinancialsWrapper}>
          <div className={styles.decodeFinancials}>
            <div className={styles.frameGroup}>
              <div className={styles.financialSeparatorsWrapper}>
                <h2 className={styles.financialSeparators}>
                  <span className={styles.span}>0</span>
                  <span className={styles.span1}>1</span>
                </h2>
              </div>
              <div className={styles.decodeTheFinancial}>
                Decode the financial side in your birth chart
              </div>
            </div>
            <div className={styles.frameGroup}>
              <div className={styles.wrapper}>
                <h2 className={styles.h2}>02</h2>
              </div>
              <div className={styles.identifyYourMost}>
                Identify your most profitable periods and income opportunities
              </div>
            </div>
            <div className={styles.frameGroup}>
              <div className={styles.wrapper}>
                <h2 className={styles.h2}>03</h2>
              </div>
              <div className={styles.identifyYourMost}>
                Select careers that align perfectly with your astrological
                strengths
              </div>
            </div>
            <div className={styles.frameGroup}>
              <div className={styles.wrapper}>
                <h2 className={styles.h22}>04</h2>
              </div>
              <div className={styles.identifyYourMost}>
                Time financial decisions for maximum success
              </div>
            </div>
            <div className={styles.frameGroup}>
              <div className={styles.wrapper}>
                <h2 className={styles.h2}>05</h2>
              </div>
              <div className={styles.identifyYourMost}>
                Guide yourself and others toward smarter money choices
              </div>
            </div>
          </div>
        </div>
        <Button variant="enroll" onClick={onOpenAuthModal}>
          Enroll Now - only $50
        </Button>
      </div>
    </section>
  );
};

export default Component4;
