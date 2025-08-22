import type { NextPage } from "next";
import styles from "./discover.module.css";
import { useStripePayment } from "@/hooks/useStripePayment";
import { useGoogleAnalytics } from "@/hooks/useGoogleAnalytics";

export type DiscoverType = {
  className?: string;
  onOpenRegisterModal?: () => void;
};

const Discover: NextPage<DiscoverType> = ({ className = "", onOpenRegisterModal }) => {
  const { handlePayment } = useStripePayment();
  const { trackDiscoverCTA } = useGoogleAnalytics();
  return (
    <section className={[styles.section, className].join(" ")}>
      <div className={styles.frameParent}>
        <div className={styles.youllParent}>
          <h2 className={styles.youll}>You'll </h2>
          <h2 className={styles.discover}>Discover:</h2>
        </div>
        <div className={styles.frameGroup}>
          <div className={styles.frameContainer}>
            <div className={styles.wrapper}>
              <h2 className={styles.h2}>💸</h2>
            </div>
            <div className={styles.whereYouCan}>
              Where you can earn more — without exhausting yourself
            </div>
          </div>
          <div className={styles.frameContainer}>
            <div className={styles.wrapper}>
              <h2 className={styles.h2}>💼</h2>
            </div>
            <div className={styles.whichPathFits}>
              Which path fits you best — business, stable job, or creative pursuits
            </div>
          </div>
          <div className={styles.frameParent1}>
            <div className={styles.wrapper}>
              <h2 className={styles.h2}>✨</h2>
            </div>
            <div className={styles.howToTurn}>
              How to turn your natural gifts into income
            </div>
          </div>
          <div className={styles.frameParent1}>
            <div className={styles.wrapper}>
              <h2 className={styles.h2}>💰</h2>
            </div>
            <div className={styles.howToTurn}>
              When to save, invest, or make big financial decisions
            </div>
          </div>
          <div className={styles.frameContainer}>
            <div className={styles.wrapper}>
              <h2 className={styles.h2}>🧿</h2>
            </div>
            <div className={styles.whereYouCan}>
              Whether you have a deeper purpose — and how to monetize it
            </div>
          </div>
          <div className={styles.frameParent1}>
            <div className={styles.wrapper}>
              <h2 className={styles.h2}>📈</h2>
            </div>
            <div className={styles.howToTurn}>
              How to create a personalized money forecast — for you and your family
            </div>
          </div>
          <div className={styles.frameParent1}>
            <div className={styles.wrapper}>
              <h2 className={styles.h2}>🔭</h2>
            </div>
            <div className={styles.howToTurn}>
              Even with zero astrology background or math skills — you'll do great
            </div>
          </div>
        </div>
      </div>
      <button 
        className={styles.enrollNowOnly50Wrapper}
        onClick={() => {
          trackDiscoverCTA('Enroll Now - only $50');
          handlePayment();
        }}
        style={{ cursor: 'pointer' }}
      >
        <b className={styles.enrollNow}>Enroll Now - only $50</b>
      </button>
    </section>
  );
};

export default Discover; 