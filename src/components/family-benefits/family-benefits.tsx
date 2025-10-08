import type { NextPage } from "next";
import Image from "next/image";
import styles from "./family-benefits.module.css";
import group8 from "../../images/group-8@2x.png";
import { useStripePayment } from "@/hooks/useStripePayment";
import { useGoogleAnalytics } from "@/hooks/useGoogleAnalytics";

export type FamilyBenefitsType = {
  className?: string;
  onOpenRegisterModal?: () => void;
};

const FamilyBenefits: NextPage<FamilyBenefitsType> = ({ className = "", onOpenRegisterModal }) => {
  const { handlePayment, isLoading } = useStripePayment();
  const { trackFamilyCTA } = useGoogleAnalytics();
  return (
    <div className={[styles.familyBenefits, className].join(" ")}>
      <div className={styles.analysisAccess}>
        <div className={styles.useItForContainer}>
          <p className={styles.useItForYourFamily}>
            <span className={styles.useIt}>Use it </span>
            <span className={styles.useIt}>for your family </span>
            <span>— </span>
          </p>
          <p className={styles.useItForYourFamily}>analyze charts for your </p>
          <p className={styles.useItForYourFamily}>partner, kids, or friends</p>
        </div>
      </div>
      <div className={styles.learningApproach}>
        <div className={styles.structuredLearning}>
          <div className={styles.learnYourWayContainer}>
            <span>Learn your way — binge solo or make it a</span>
            <span> group activity </span>
            <span>(like Netflix for your future)</span>
          </div>
        </div>
        <div className={styles.effortlessAcquisition}>
          <div className={styles.selfpacedContent}>
            <Image
              className={styles.selfpacedContentChild}
              loading="lazy"
              width={98.8}
              height={106.2}
              sizes="100vw"
              alt=""
              src={group8}
            />
            <div className={styles.learningStyle}>
              <div className={styles.stressFreeLearningContainer}>
                <p className={styles.useItForYourFamily}>
                  <span className={styles.useIt}>Stress-free learning</span>
                  <span> — </span>
                </p>
                <p className={styles.useItForYourFamily}>
                  self-paced video lessons, zero pressure
                </p>
              </div>
            </div>
          </div>
          <button 
            className={styles.enrollPromotion}
            onClick={() => {
              trackFamilyCTA('Get the first lesson for free');
              handlePayment();
            }}
            disabled={isLoading}
            style={{ 
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <b className={styles.enrollNow}>Redirecting...</b>
              </>
            ) : (
              <b className={styles.enrollNow}>Get the first lesson for free</b>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FamilyBenefits; 