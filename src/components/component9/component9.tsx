import type { NextPage } from "next";
import Image from "next/image";
import styles from "./component9.module.css";
import unsplashImage3 from "../../images/unsplashutbx9x3y8ly-3@2x.png";
import image7 from "../../images/image-7@2x.png";
import frame2087325318 from "../../images/frame-2087325318@2x.png";
import { Button } from "../ui";

export type GraphicIndicatorsType = {
  className?: string;
  onOpenAuthModal?: () => void;
};

const GraphicIndicators: NextPage<GraphicIndicatorsType> = ({
  className = "",
  onOpenAuthModal,
}) => {
  return (
    <section className={[styles.graphicIndicators, className].join(" ")}>
      <Image
        className={styles.unsplashutbx9x3y8lyIcon}
        width={320}
        height={747}
        sizes="100vw"
        alt=""
        src={unsplashImage3}
        style={{ height: "auto" }}
      />
      <div className={styles.graphicIndicatorsItem} />
      <footer className={styles.priceOffering}>
        <div className={styles.subscriptionPlan}>
          <div className={styles.accessSummary}>
            <div className={styles.costOptions}>
              <div className={styles.purchaseOptions}>
                <div className={styles.enrollBenefits}>
                  <h2 className={styles.price}>Price:</h2>
                  <h2 className={styles.unitPrice}>$50</h2>
                </div>
                <div className={styles.neTimePaymentLifetimeContainer}>
                  <p className={styles.neTimePayment}>Оne-time payment.</p>
                  <p className={styles.neTimePayment}>
                    Lifetime access included.
                  </p>
                </div>
              </div>
              <div className={styles.earlyDiscount}>
                <Image
                  className={styles.image7Icon}
                  loading="lazy"
                  width={48}
                  height={101.4}
                  sizes="100vw"
                  alt=""
                  src={image7}
                  style={{ height: "auto" }}
                />
                <b className={styles.limitedTimeOffer}>Limited-Time Offer:</b>
                <b className={styles.only200SpotsContainer}>
                  <p className={styles.neTimePayment}>{`Only 200 spots `}</p>
                  <p className={styles.neTimePayment}>at $50</p>
                </b>
                <div className={styles.priceMayIncreaseContainer}>
                  <p className={styles.neTimePayment}>
                    Price may increase soon.
                  </p>
                  <p className={styles.neTimePayment}>
                    Join now while it's still available.
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.learnMoment}>
              <h2 className={styles.ready}>Ready</h2>
              <h2 className={styles.toLearn}>to Learn?</h2>
            </div>
            <Button variant="primary" onClick={onOpenAuthModal}>
              Enroll Now — Start Today
            </Button>
          </div>
          <div className={styles.chartVisibility}>
            <Image
              className={styles.chartVisibilityChild}
              loading="lazy"
              width={260}
              height={180}
              sizes="100vw"
              alt=""
              src={frame2087325318}
              style={{ height: "auto" }}
            />
            <div className={styles.yourChartAlreadyKnowsWhereParent}>
              <h3 className={styles.yourChartAlready}>
                Your chart already knows where your money is.
              </h3>
              <div className={styles.itsTimeFor}>
                It's time for you to see it too.
              </div>
            </div>
            <Button variant="secondary" onClick={onOpenAuthModal}>
              Start Today
            </Button>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default GraphicIndicators;
