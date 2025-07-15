import type { NextPage } from "next";
import styles from "./component1.module.scss";

export type TitleType = {
  className?: string;
};

const Title: NextPage<TitleType> = ({ className = "" }) => {
  return (
    <div className={styles.frameDiv}>
      <div className={styles.yourMoneyIsInYourParent}>
        <h1 className={styles.cosmo}>
          <p className={styles.noMoreGuessing}>{`Your Money `}</p>
          <p className={styles.noMoreGuessing}>{`Is in Your `}</p>
        </h1>
        <h2 className={styles.birthChart}>Birth Chart</h2>
      </div>
    </div>
  );
};

export default Title; 