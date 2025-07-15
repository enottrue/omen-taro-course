import type { NextPage } from "next";
import Image from "next/image";
import styles from "./component1.module.scss";
import unsplashImage from "../../images/back@2x.png";
import image3 from "../../images/image-3@2x.png";
import group2 from "../../images/group-2@2x.png";
import { Button } from "../ui";
import Header from "./Header";
import Title from "./Title";
import { useContext } from "react";
import { MainContext } from "@/contexts/MainContext";
import { useStripePayment } from "@/hooks/useStripePayment";

export type Component1Type = {
  className?: string;
  onOpenModal?: () => void;
  onOpenRegisterModal?: () => void;
  hideLoginButton?: boolean;
  onBurgerClick?: () => void;
  isBurgerOpen?: boolean;
  burgerRef?: React.RefObject<HTMLDivElement>;
  showScreenImage?: boolean;
};

const Component1: NextPage<Component1Type> = ({ className = "", onOpenModal, onOpenRegisterModal, hideLoginButton = false, onBurgerClick, isBurgerOpen = false, burgerRef, showScreenImage = false }) => {
  const cc = useContext(MainContext);
  const { handlePayment } = useStripePayment();

  const handleOpenModal = () => {
    cc?.setModalOpen(true);
    cc?.setCurrentForm('auth');
  };

  const handleOpenRegisterModal = () => {
    cc?.setModalOpen(true);
    cc?.setCurrentForm('register');
  };

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
      {showScreenImage ? (
        <div className={styles.frameParent}>
         
        </div>
      ) : (
        <div className={styles.frameParent}>
          <Header onOpenModal={handleOpenModal} hideLoginButton={hideLoginButton} onBurgerClick={onBurgerClick} isBurgerOpen={isBurgerOpen} burgerRef={burgerRef} />
          <Title />
        </div>
      )}
      {/* <div className={styles.isAPersonalized}>
        is a personalized exploration of your birth chart, uncovering hidden
        potential and helping you overcome inner obstacles. You'll receive
        tailored guidance based on your unique astrological blueprint.
      </div> */}
      <div className={styles.frameDiv}>
        <Button variant="enroll" onClick={handlePayment}>
          Enroll Now - only $50
        </Button>
      </div>
    </section>
  );
};

export default Component1;
