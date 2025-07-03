import type { NextPage } from "next";
import ComparisonDetails from "../comparison-details/comparison-details";
import styles from "./frame-component.module.css";
import image1 from "../../images/image-1@2x.png";
import image2 from "../../images/image-2@2x.png";

export type FrameComponentType = {
  className?: string;
};

const FrameComponent: NextPage<FrameComponentType> = ({ className = "" }) => {
  return (
    <div className={[styles.investmentContentParent, className].join(" ")}>
      <div className={styles.investmentContent}>
        <div className={styles.investmentContent}>
          <div className={styles.costBreakdown}>
            <h1 className={styles.whyItsAContainer}>
              <p className={styles.whyIts}>{`Why It’s `}</p>
              <p className={styles.whyIts}>a Smart</p>
            </h1>
            <h2 className={styles.investment}>Investment:</h2>
          </div>
        </div>
      </div>
      <div className={styles.valueComparison}>
        <ComparisonDetails image={image1} />
        <h2 className={styles.vs}>VS</h2>
        <ComparisonDetails
          image={image2}
          privateAstrologyReadingContainerWidth="unset"
          privateAstrologyReadingContainerDisplay="unset"
        />
      </div>
    </div>
  );
};

export default FrameComponent;
